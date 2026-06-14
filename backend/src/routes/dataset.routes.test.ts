import jwt from 'jsonwebtoken'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../app.js'

vi.mock('../config/env.js', () => ({
	env: {
		DATABASE_URL: 'postgres://test',
		JWT_SECRET: 'test-secret-at-least-16-chars',
		JWT_REFRESH_SECRET: 'test-refresh-secret-16-chars!!',
		PORT: 4000,
		CORS_ORIGIN: 'http://localhost:3000',
	},
}))

vi.mock('../services/dataset.service.js', () => ({
	listDatasets: vi.fn(),
	getDatasetById: vi.fn(),
	createDataset: vi.fn(),
	deleteDataset: vi.fn(),
	getDatasetRows: vi.fn(),
	getColumnDistribution: vi.fn(),
	getAnalyticsSummary: vi.fn(),
}))

// multer tries to write to disk; stub it out so upload tests work without filesystem
vi.mock('../middleware/upload.middleware.js', () => ({
	upload: {
		single: () => (req: any, _res: any, next: any) => {
			// simulate a successfully parsed file
			req.file = {
				path: '/tmp/test.csv',
				originalname: 'test.csv',
				size: 1024,
				mimetype: 'text/csv',
			}
			next()
		},
	},
}))

import * as datasetService from '../services/dataset.service.js'

const USER_ID = 'user-uuid'
const DATASET_ID = 'dataset-uuid'

const makeToken = () =>
	jwt.sign({ userId: USER_ID }, 'test-secret-at-least-16-chars', { expiresIn: '15m' })

const mockDataset = {
	id: DATASET_ID,
	userId: USER_ID,
	filename: 'test.csv',
	fileType: 'csv',
	sizeBytes: 1024,
	rowCount: 10,
	columnCount: 3,
	createdAt: new Date().toISOString(),
}

describe('GET /api/datasets', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth header', async () => {
		const res = await request(app).get('/api/datasets')
		expect(res.status).toBe(401)
	})

	it('200 with dataset list', async () => {
		vi.mocked(datasetService.listDatasets).mockResolvedValue([mockDataset] as any)

		const res = await request(app)
			.get('/api/datasets')
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(200)
		expect(res.body.datasets).toHaveLength(1)
		expect(res.body.datasets[0]).toMatchObject({ filename: 'test.csv' })
	})

	it('200 with empty list when no datasets', async () => {
		vi.mocked(datasetService.listDatasets).mockResolvedValue([])

		const res = await request(app)
			.get('/api/datasets')
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(200)
		expect(res.body.datasets).toEqual([])
	})
})

describe('GET /api/datasets/:id', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth', async () => {
		const res = await request(app).get(`/api/datasets/${DATASET_ID}`)
		expect(res.status).toBe(401)
	})

	it('200 with dataset on valid id', async () => {
		vi.mocked(datasetService.getDatasetById).mockResolvedValue(mockDataset as any)

		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(200)
		expect(res.body.dataset).toMatchObject({ id: DATASET_ID })
	})

	it('404 when dataset does not exist or belongs to another user', async () => {
		vi.mocked(datasetService.getDatasetById).mockResolvedValue(null)

		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('error')
	})
})

describe('POST /api/datasets/upload', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth', async () => {
		const res = await request(app).post('/api/datasets/upload')
		expect(res.status).toBe(401)
	})

	it('201 on successful upload', async () => {
		vi.mocked(datasetService.createDataset).mockResolvedValue(mockDataset as any)

		const res = await request(app)
			.post('/api/datasets/upload')
			.set('Authorization', `Bearer ${makeToken()}`)
			.attach('file', Buffer.from('name,age\nAlice,30'), 'test.csv')

		expect(res.status).toBe(201)
		expect(res.body.dataset).toMatchObject({ filename: 'test.csv' })
	})
})

describe('DELETE /api/datasets/:id', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth', async () => {
		const res = await request(app).delete(`/api/datasets/${DATASET_ID}`)
		expect(res.status).toBe(401)
	})

	it('204 on successful delete', async () => {
		vi.mocked(datasetService.deleteDataset).mockResolvedValue(true)

		const res = await request(app)
			.delete(`/api/datasets/${DATASET_ID}`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(204)
	})

	it('404 when dataset not found', async () => {
		vi.mocked(datasetService.deleteDataset).mockResolvedValue(false)

		const res = await request(app)
			.delete(`/api/datasets/${DATASET_ID}`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('error')
	})
})

describe('GET /api/datasets/:id/rows', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth', async () => {
		const res = await request(app).get(`/api/datasets/${DATASET_ID}/rows`)
		expect(res.status).toBe(401)
	})

	it('200 with paginated rows', async () => {
		vi.mocked(datasetService.getDatasetRows).mockResolvedValue({
			rows: [{ name: 'Alice', age: 30 }],
			total: 1,
			page: 1,
			limit: 50,
		} as any)

		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}/rows`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(200)
		expect(res.body.rows).toHaveLength(1)
		expect(res.body).toMatchObject({ total: 1, page: 1 })
	})

	it('404 when dataset not found', async () => {
		vi.mocked(datasetService.getDatasetRows).mockResolvedValue(null)

		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}/rows`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(404)
	})

	it('caps limit at 200 even when a higher value is requested', async () => {
		vi.mocked(datasetService.getDatasetRows).mockResolvedValue({
			rows: [],
			total: 0,
			page: 1,
			limit: 200,
		} as any)

		await request(app)
			.get(`/api/datasets/${DATASET_ID}/rows?limit=9999`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(datasetService.getDatasetRows).toHaveBeenCalledWith(
			expect.objectContaining({ limit: 200 })
		)
	})
})

describe('GET /api/datasets/:id/columns/:col/distribution', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth', async () => {
		const res = await request(app).get(
			`/api/datasets/${DATASET_ID}/columns/name/distribution`
		)
		expect(res.status).toBe(401)
	})

	it('200 with distribution data', async () => {
		vi.mocked(datasetService.getColumnDistribution).mockResolvedValue({
			column: 'name',
			topValues: [{ value: 'Alice', count: 5 }],
			nullCount: 0,
			totalSampled: 10,
		} as any)

		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}/columns/name/distribution`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ column: 'name' })
	})

	it('400 on invalid column name (injection attempt)', async () => {
		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}/columns/${encodeURIComponent('<script>')}/distribution`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(400)
		expect(res.body.error).toBe('Invalid column name')
	})

	it('404 when dataset not found', async () => {
		vi.mocked(datasetService.getColumnDistribution).mockResolvedValue(null)

		const res = await request(app)
			.get(`/api/datasets/${DATASET_ID}/columns/name/distribution`)
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(404)
	})
})

describe('GET /api/datasets/stats/summary', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth', async () => {
		const res = await request(app).get('/api/datasets/stats/summary')
		expect(res.status).toBe(401)
	})

	it('200 with analytics summary', async () => {
		vi.mocked(datasetService.getAnalyticsSummary).mockResolvedValue({
			totalDatasets: 3,
			totalRows: 300,
			totalColumns: 9,
			totalSizeBytes: 3072,
			byFileType: [],
		} as any)

		const res = await request(app)
			.get('/api/datasets/stats/summary')
			.set('Authorization', `Bearer ${makeToken()}`)

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ totalDatasets: 3 })
	})
})
