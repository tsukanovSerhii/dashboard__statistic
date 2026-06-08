import { and, desc, eq } from 'drizzle-orm'
import fs from 'node:fs'
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

export const createDataset = async ({
	userId,
	filePath,
	originalName,
	sizeBytes
}: UploadInput) => {
	const fileType = detectFileType(originalName)

	const rows = parseFile(filePath, fileType)
	const stats = analyzeRows(rows)

	fs.unlink(filePath, () => {})

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

	return dataset
}

export const listDatasets = (userId: string) =>
	db
		.select()
		.from(datasets)
		.where(eq(datasets.userId, userId))
		.orderBy(desc(datasets.createdAt))

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

export const deleteDataset = async (id: string, userId: string) => {
	const deleted = await db
		.delete(datasets)
		.where(and(eq(datasets.id, id), eq(datasets.userId, userId)))
		.returning({ id: datasets.id })

	return deleted.length > 0
}
