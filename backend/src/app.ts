import cors from 'cors'
import express from 'express'

export const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

// health check — quick way to verify the server is alive
app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' })
})

// TODO: mount routes here
// app.use('/api/auth', authRoutes)
// app.use('/api/datasets', datasetRoutes)
