import fs from 'node:fs'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { columnStats, datasets } from '../db/schema.js'
import { analyzeRows } from './analytics.service.js'
import { detectFileType, parseFile } from './parser.service.js'

type UploadInput = {
	userId: string
	filePath: string
	originalName: string
	sizeBytes: number
}

// parse an uploaded file, compute stats, and persist everything
export const createDataset = async ({
	userId,
	filePath,
	originalName,
	sizeBytes
}: UploadInput) => {
	const fileType = detectFileType(originalName)

	// 1. parse file into rows, then compute column stats
	const rows = parseFile(filePath, fileType)
	const stats = analyzeRows(rows)

	// 2. file already analyzed — remove it from disk to save space
	fs.unlink(filePath, () => {})

	// 3. insert dataset row
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

	// 4. insert column stats (if any)
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

	return dataset
}

// all datasets for a user, newest first
export const listDatasets = (userId: string) =>
	db
		.select()
		.from(datasets)
		.where(eq(datasets.userId, userId))
		.orderBy(desc(datasets.createdAt))

// one dataset with its column stats (only if it belongs to the user)
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

// delete a dataset (column stats cascade); returns true if something was deleted
export const deleteDataset = async (id: string, userId: string) => {
	const deleted = await db
		.delete(datasets)
		.where(and(eq(datasets.id, id), eq(datasets.userId, userId)))
		.returning({ id: datasets.id })

	return deleted.length > 0
}
