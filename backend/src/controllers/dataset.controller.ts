import type { Request, Response } from 'express'
import {
	createDataset,
	deleteDataset,
	getAnalyticsSummary,
	getColumnDistribution,
	getDatasetById,
	getDatasetRows,
	listDatasets
} from '../services/dataset.service.js'

export const uploadDataset = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' })
		}

		const dataset = await createDataset({
			userId: req.userId!,
			filePath: req.file.path,
			originalName: req.file.originalname,
			sizeBytes: req.file.size
		})

		res.status(201).json({ dataset })
	} catch (err) {
		res.status(400).json({ error: (err as Error).message })
	}
}

export const getDatasets = async (req: Request, res: Response) => {
	const data = await listDatasets(req.userId!)
	res.json({ datasets: data })
}

export const getSummary = async (req: Request, res: Response) => {
	const summary = await getAnalyticsSummary(req.userId!)
	res.json(summary)
}

export const getDataset = async (req: Request, res: Response) => {
	const dataset = await getDatasetById(String(req.params.id), req.userId!)
	if (!dataset) {
		return res.status(404).json({ error: 'Dataset not found' })
	}
	res.json({ dataset })
}

export const removeDataset = async (req: Request, res: Response) => {
	const ok = await deleteDataset(String(req.params.id), req.userId!)
	if (!ok) {
		return res.status(404).json({ error: 'Dataset not found' })
	}
	res.status(204).send()
}

export const getDistribution = async (req: Request, res: Response) => {
	const result = await getColumnDistribution(
		String(req.params.id),
		req.userId!,
		String(req.params.col)
	)
	if (!result) return res.status(404).json({ error: 'Dataset not found' })
	res.json(result)
}

export const getRows = async (req: Request, res: Response) => {
	const search =
		typeof req.query.search === 'string' ? req.query.search : undefined
	const page = Number(req.query.page) || 1
	const limit = Math.min(Number(req.query.limit) || 50, 200) // cap at 200

	const result = await getDatasetRows({
		datasetId: String(req.params.id),
		userId: req.userId!,
		search,
		page,
		limit
	})

	if (!result) {
		return res.status(404).json({ error: 'Dataset not found' })
	}
	res.json(result)
}
