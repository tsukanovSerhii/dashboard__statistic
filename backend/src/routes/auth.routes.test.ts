import jwt from 'jsonwebtoken'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../app.js'

// Mock the entire auth service so tests run without a real DB
vi.mock('../services/auth.service.js', () => ({
	registerUser: vi.fn(),
	loginUser: vi.fn(),
	refreshAccessToken: vi.fn(),
	revokeRefreshToken: vi.fn(),
	getUserById: vi.fn(),
	changePassword: vi.fn(),
	deleteUser: vi.fn(),
}))

// Also mock env so JWT_SECRET is always defined during tests
vi.mock('../config/env.js', () => ({
	env: {
		DATABASE_URL: 'postgres://test',
		JWT_SECRET: 'test-secret-at-least-16-chars',
		JWT_REFRESH_SECRET: 'test-refresh-secret-16-chars!!',
		PORT: 4000,
		CORS_ORIGIN: 'http://localhost:3000',
	},
}))

import * as authService from '../services/auth.service.js'

const mockUser = { id: 'user-uuid', email: 'test@example.com' }
const makeAccessToken = () =>
	jwt.sign({ userId: mockUser.id }, 'test-secret-at-least-16-chars', { expiresIn: '15m' })

describe('POST /api/auth/register', () => {
	beforeEach(() => vi.clearAllMocks())

	it('201 with user + tokens on valid input', async () => {
		vi.mocked(authService.registerUser).mockResolvedValue({
			user: mockUser,
			accessToken: 'access',
			refreshToken: 'refresh',
		})

		const res = await request(app)
			.post('/api/auth/register')
			.send({ email: 'test@example.com', password: 'password123' })

		expect(res.status).toBe(201)
		expect(res.body).toMatchObject({
			user: { email: 'test@example.com' },
			accessToken: 'access',
			refreshToken: 'refresh',
		})
	})

	it('400 when email is missing', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({ password: 'password123' })

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('error')
	})

	it('400 when password is missing', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({ email: 'test@example.com' })

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('error')
	})

	it('400 when email already in use', async () => {
		vi.mocked(authService.registerUser).mockRejectedValue(
			new Error('Email already in use')
		)

		const res = await request(app)
			.post('/api/auth/register')
			.send({ email: 'test@example.com', password: 'password123' })

		expect(res.status).toBe(400)
		expect(res.body.error).toBe('Email already in use')
	})
})

describe('POST /api/auth/login', () => {
	beforeEach(() => vi.clearAllMocks())

	it('200 with tokens on valid credentials', async () => {
		vi.mocked(authService.loginUser).mockResolvedValue({
			user: mockUser,
			accessToken: 'access',
			refreshToken: 'refresh',
		})

		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'test@example.com', password: 'password123' })

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ accessToken: 'access' })
	})

	it('400 on wrong credentials', async () => {
		vi.mocked(authService.loginUser).mockRejectedValue(
			new Error('Invalid email or password')
		)

		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'test@example.com', password: 'wrong' })

		expect(res.status).toBe(400)
		expect(res.body.error).toBe('Invalid email or password')
	})

	it('400 when body is empty', async () => {
		const res = await request(app).post('/api/auth/login').send({})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('error')
	})
})

describe('POST /api/auth/refresh', () => {
	beforeEach(() => vi.clearAllMocks())

	it('200 with new tokens on valid refresh token', async () => {
		vi.mocked(authService.refreshAccessToken).mockResolvedValue({
			accessToken: 'new-access',
			refreshToken: 'new-refresh',
		})

		const res = await request(app)
			.post('/api/auth/refresh')
			.send({ refreshToken: 'valid-refresh-token' })

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({
			accessToken: 'new-access',
			refreshToken: 'new-refresh',
		})
	})

	it('401 on invalid refresh token', async () => {
		vi.mocked(authService.refreshAccessToken).mockRejectedValue(
			new Error('Refresh token is invalid or revoked')
		)

		const res = await request(app)
			.post('/api/auth/refresh')
			.send({ refreshToken: 'bad-token' })

		expect(res.status).toBe(401)
		expect(res.body).toHaveProperty('error')
	})

	it('400 when refreshToken field is missing', async () => {
		const res = await request(app).post('/api/auth/refresh').send({})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('error')
	})
})

describe('POST /api/auth/logout', () => {
	beforeEach(() => vi.clearAllMocks())

	it('204 on logout with refresh token', async () => {
		vi.mocked(authService.revokeRefreshToken).mockResolvedValue(undefined)

		const res = await request(app)
			.post('/api/auth/logout')
			.send({ refreshToken: 'some-token' })

		expect(res.status).toBe(204)
		expect(authService.revokeRefreshToken).toHaveBeenCalledWith('some-token')
	})

	it('204 on logout without refresh token (graceful)', async () => {
		const res = await request(app).post('/api/auth/logout').send({})

		expect(res.status).toBe(204)
		expect(authService.revokeRefreshToken).not.toHaveBeenCalled()
	})
})

describe('GET /api/auth/me', () => {
	beforeEach(() => vi.clearAllMocks())

	it('401 without auth header', async () => {
		const res = await request(app).get('/api/auth/me')

		expect(res.status).toBe(401)
	})

	it('401 with malformed token', async () => {
		const res = await request(app)
			.get('/api/auth/me')
			.set('Authorization', 'Bearer not-a-real-jwt')

		expect(res.status).toBe(401)
	})

	it('200 with user data on valid token', async () => {
		vi.mocked(authService.getUserById).mockResolvedValue({
			...mockUser,
			createdAt: new Date(),
		})

		const token = makeAccessToken()
		const res = await request(app)
			.get('/api/auth/me')
			.set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
		expect(res.body.user).toMatchObject({ email: mockUser.email })
	})

	it('404 when user has been deleted', async () => {
		vi.mocked(authService.getUserById).mockResolvedValue(null)

		const token = makeAccessToken()
		const res = await request(app)
			.get('/api/auth/me')
			.set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(404)
	})
})
