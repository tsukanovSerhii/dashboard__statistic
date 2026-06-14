import { Router } from 'express'
import {
	getDataset,
	getDatasets,
	getDistribution,
	getRows,
	getSummary,
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
// static route must come before '/:id' so it isn't treated as an id
datasetRoutes.get('/stats/summary', getSummary)
datasetRoutes.get('/:id', getDataset)
datasetRoutes.get('/:id/rows', getRows)
datasetRoutes.get('/:id/columns/:col/distribution', getDistribution)
datasetRoutes.delete('/:id', removeDataset)
