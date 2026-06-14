import { and, asc, desc, eq, sql } from 'drizzle-orm'
import fs from 'node:fs'
import { db } from '../db/index.js'
import { columnStats, datasetRows, datasets } from '../db/schema.js'
import { analyzeRows } from './analytics.service.js'
import { detectFileType, parseFile } from './parser.service.js'

// Cap stored rows to keep DB size manageable.
// Files with more rows are parsed fully for stats (rowCount, column types, nulls)
// but only the first MAX_STORED_ROWS are available for preview and distribution queries.
const MAX_STORED_ROWS = 1000

type UploadInput = {
	userId: string
	filePath: string
	originalName: string
	sizeBytes: number
}

export const createDataset = async ({
	userId,
	filePath,
	originalName,
	sizeBytes
}: UploadInput) => {
	const fileType = detectFileType(originalName)

	const rows = parseFile(filePath, fileType)
	const stats = analyzeRows(rows)

	// file is parsed — remove it from disk regardless of the outcome
	fs.unlink(filePath, () => {})

	// reject files with no data rows
	if (rows.length === 0) {
		throw new Error('File has no data rows')
	}

	const [dataset] = await db
		.insert(datasets)
		.values({
			userId,
			filename: originalName,
			fileType,
			sizeBytes,
			rowCount: rows.length,
			columnCount: stats.length
		})
		.returning()

	if (stats.length > 0) {
		await db.insert(columnStats).values(
			stats.map(s => ({
				datasetId: dataset.id,
				name: s.name,
				dataType: s.dataType,
				nullCount: s.nullCount,
				uniqueCount: s.uniqueCount
			}))
		)
	}

	// store the first N rows so we can show file content later
	const rowsToStore = rows.slice(0, MAX_STORED_ROWS)
	if (rowsToStore.length > 0) {
		await db.insert(datasetRows).values(
			rowsToStore.map((row, index) => ({
				datasetId: dataset.id,
				rowIndex: index,
				data: row
			}))
		)
	}

	return dataset
}

export const listDatasets = (userId: string) =>
	db
		.select()
		.from(datasets)
		.where(eq(datasets.userId, userId))
		.orderBy(desc(datasets.createdAt))

// aggregated analytics across all of the user's datasets
export const getAnalyticsSummary = async (userId: string) => {
	// totals from the datasets table
	const [totals] = await db
		.select({
			datasetCount: sql<number>`cast(count(*) as int)`,
			totalRows: sql<number>`cast(coalesce(sum(${datasets.rowCount}), 0) as int)`,
			totalColumns: sql<number>`cast(coalesce(sum(${datasets.columnCount}), 0) as int)`,
			totalSize: sql<number>`cast(coalesce(sum(${datasets.sizeBytes}), 0) as bigint)`
		})
		.from(datasets)
		.where(eq(datasets.userId, userId))

	// datasets grouped by file type
	const byType = await db
		.select({
			fileType: datasets.fileType,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(datasets)
		.where(eq(datasets.userId, userId))
		.groupBy(datasets.fileType)

	// column types across all datasets (join column_stats -> datasets for ownership)
	const columnsByType = await db
		.select({
			dataType: columnStats.dataType,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(columnStats)
		.innerJoin(datasets, eq(columnStats.datasetId, datasets.id))
		.where(eq(datasets.userId, userId))
		.groupBy(columnStats.dataType)

	// data quality: total cells vs missing cells
	const [quality] = await db
		.select({
			totalNulls: sql<number>`cast(coalesce(sum(${columnStats.nullCount}), 0) as int)`,
			totalColumnsCounted: sql<number>`cast(count(*) as int)`
		})
		.from(columnStats)
		.innerJoin(datasets, eq(columnStats.datasetId, datasets.id))
		.where(eq(datasets.userId, userId))

	return { totals, byType, columnsByType, quality }
}

export const getDatasetById = async (id: string, userId: string) => {
	const [dataset] = await db
		.select()
		.from(datasets)
		.where(and(eq(datasets.id, id), eq(datasets.userId, userId)))

	if (!dataset) return null

	const columns = await db
		.select()
		.from(columnStats)
		.where(eq(columnStats.datasetId, id))

	return { ...dataset, columns }
}

export const getColumnDistribution = async (
	datasetId: string,
	userId: string,
	columnName: string
) => {
	const [owned] = await db
		.select({ id: datasets.id, rowCount: datasets.rowCount })
		.from(datasets)
		.where(and(eq(datasets.id, datasetId), eq(datasets.userId, userId)))

	if (!owned) return null

	// pull raw values from stored rows
	const rawRows = await db
		.select({ data: datasetRows.data })
		.from(datasetRows)
		.where(eq(datasetRows.datasetId, datasetId))
		.orderBy(asc(datasetRows.rowIndex))

	// count occurrences per value
	const freq = new Map<string, number>()
	let nullCount = 0
	for (const { data } of rawRows) {
		const val = (data as Record<string, unknown>)[columnName]
		if (val === null || val === undefined || val === '') {
			nullCount++
		} else {
			const key = String(val)
			freq.set(key, (freq.get(key) ?? 0) + 1)
		}
	}

	// top 10 by frequency
	const topValues = [...freq.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([value, count]) => ({ value, count }))

	return {
		columnName,
		totalRows: owned.rowCount,
		sampledRows: rawRows.length,
		nullCount,
		uniqueCount: freq.size,
		topValues,
	}
}

export const deleteDataset = async (id: string, userId: string) => {
	const deleted = await db
		.delete(datasets)
		.where(and(eq(datasets.id, id), eq(datasets.userId, userId)))
		.returning({ id: datasets.id })

	return deleted.length > 0
}

type RowsQuery = {
	datasetId: string
	userId: string
	search?: string
	page?: number
	limit?: number
}

// paginated + searchable rows for one dataset (only if it belongs to the user)
export const getDatasetRows = async ({
	datasetId,
	userId,
	search,
	page = 1,
	limit = 50
}: RowsQuery) => {
	// make sure the dataset belongs to this user
	const [owned] = await db
		.select({ id: datasets.id })
		.from(datasets)
		.where(and(eq(datasets.id, datasetId), eq(datasets.userId, userId)))

	if (!owned) return null

	// base filter: rows of this dataset
	const filters = [eq(datasetRows.datasetId, datasetId)]

	// search across the whole row by casting the JSON to text
	if (search && search.trim()) {
		filters.push(
			sql`${datasetRows.data}::text ILIKE ${'%' + search.trim() + '%'}`
		)
	}

	const where = and(...filters)

	// total matching rows (for pagination)
	const [{ total }] = await db
		.select({ total: sql<number>`cast(count(*) as int)` })
		.from(datasetRows)
		.where(where)

	const offset = (page - 1) * limit

	const rows = await db
		.select({ rowIndex: datasetRows.rowIndex, data: datasetRows.data })
		.from(datasetRows)
		.where(where)
		.orderBy(asc(datasetRows.rowIndex))
		.limit(limit)
		.offset(offset)

	return {
		rows: rows.map(r => r.data),
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit)
	}
}
