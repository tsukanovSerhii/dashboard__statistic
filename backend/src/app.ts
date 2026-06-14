import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { openapiSpec } from './config/openapi.js'
import { errorHandler } from './middleware/error.middleware.js'
import { authRoutes } from './routes/auth.routes.js'
import { datasetRoutes } from './routes/dataset.routes.js'

export const app = express()

// Security headers
app.use(helmet())

// CORS — origin from env so it works both locally and in production
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

app.use(express.json({ limit: '1mb' }))

// Global rate limit: 200 req / 15 min per IP
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 200,
		standardHeaders: true,
		legacyHeaders: false,
		message: { error: 'Too many requests, please try again later' },
	})
)

// Stricter limit on auth endpoints: 20 req / 15 min per IP
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many auth attempts, please try again later' },
})

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' })
})

app.use(
	'/api/docs',
	swaggerUi.serve,
	swaggerUi.setup(openapiSpec, { customSiteTitle: 'Analytics API Docs' })
)

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/datasets', datasetRoutes)

app.use(errorHandler)
