import { Router } from 'express'
import {
	getDataset,
	getDatasets,
	getRows,
	removeDataset,
	uploadDataset
} from '../controllers/dataset.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'

export const datasetRoutes = Router()

// all dataset routes require authentication
datasetRoutes.use(authenticate)

datasetRoutes.post('/upload', upload.single('file'), uploadDataset)
datasetRoutes.get('/', getDatasets)
datasetRoutes.get('/:id', getDataset)
datasetRoutes.get('/:id/rows', getRows)
datasetRoutes.delete('/:id', removeDataset)
