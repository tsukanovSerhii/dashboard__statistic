import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { openapiSpec } from './config/openapi.js'
import { errorHandler } from './middleware/error.middleware.js'
import { authRoutes } from './routes/auth.routes.js'
import { datasetRoutes } from './routes/dataset.routes.js'

export const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' })
})

// interactive API docs
app.use(
	'/api/docs',
	swaggerUi.serve,
	swaggerUi.setup(openapiSpec, { customSiteTitle: 'Analytics API Docs' })
)

app.use('/api/auth', authRoutes)
app.use('/api/datasets', datasetRoutes)

// error handler must be last
app.use(errorHandler)
