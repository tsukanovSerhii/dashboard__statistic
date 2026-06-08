import type { Request, Response } from 'express'
import {
	createDataset,
	deleteDataset,
	getDatasetById,
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
