import bcrypt from 'bcryptjs'
import { and, eq, gt } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { db } from '../db/index.js'
import { refreshTokens, users } from '../db/schema.js'

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const signTokens = (userId: string) => ({
	accessToken: jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' }),
	refreshToken: jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
})

const storeRefreshToken = async (userId: string, token: string) => {
	await db.insert(refreshTokens).values({
		userId,
		token,
		expiresAt: new Date(Date.now() + REFRESH_TTL_MS)
	})
}

export const registerUser = async (email: string, password: string) => {
	const existing = await db.select().from(users).where(eq(users.email, email))
	if (existing.length > 0) throw new Error('Email already in use')

	const passwordHash = await bcrypt.hash(password, 10)
	const [user] = await db
		.insert(users)
		.values({ email, password: passwordHash })
		.returning({ id: users.id, email: users.email })

	const { accessToken, refreshToken } = signTokens(user.id)
	await storeRefreshToken(user.id, refreshToken)

	return { user, accessToken, refreshToken }
}

export const loginUser = async (email: string, password: string) => {
	const [found] = await db.select().from(users).where(eq(users.email, email))
	if (!found) throw new Error('Invalid email or password')

	const isMatch = await bcrypt.compare(password, found.password)
	if (!isMatch) throw new Error('Invalid email or password')

	const user = { id: found.id, email: found.email }
	const { accessToken, refreshToken } = signTokens(user.id)
	await storeRefreshToken(user.id, refreshToken)

	return { user, accessToken, refreshToken }
}

export const refreshAccessToken = async (token: string) => {
	// verify signature first — throws if expired or tampered
	const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string }

	// check it's in the DB and not revoked
	const [stored] = await db
		.select()
		.from(refreshTokens)
		.where(
			and(
				eq(refreshTokens.token, token),
				eq(refreshTokens.revoked, false),
				gt(refreshTokens.expiresAt, new Date())
			)
		)

	if (!stored) throw new Error('Refresh token is invalid or revoked')

	// rotate: revoke old, issue new pair
	await db
		.update(refreshTokens)
		.set({ revoked: true })
		.where(eq(refreshTokens.id, stored.id))

	const { accessToken, refreshToken: newRefreshToken } = signTokens(payload.userId)
	await storeRefreshToken(payload.userId, newRefreshToken)

	return { accessToken, refreshToken: newRefreshToken }
}

export const revokeRefreshToken = async (token: string) => {
	await db
		.update(refreshTokens)
		.set({ revoked: true })
		.where(eq(refreshTokens.token, token))
}

export const getUserById = async (id: string): Promise<{ id: string; email: string; createdAt: Date } | null> => {
	const [user] = await db
		.select({ id: users.id, email: users.email, createdAt: users.createdAt })
		.from(users)
		.where(eq(users.id, id))
	return user ?? null
}

export const changePassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string
) => {
	const [user] = await db.select().from(users).where(eq(users.id, userId))
	if (!user) throw new Error('User not found')

	const isMatch = await bcrypt.compare(currentPassword, user.password)
	if (!isMatch) throw new Error('Current password is incorrect')

	const passwordHash = await bcrypt.hash(newPassword, 10)
	await db.update(users).set({ password: passwordHash }).where(eq(users.id, userId))
}

export const deleteUser = async (userId: string) => {
	// datasets/columns/rows/refresh_tokens removed via ON DELETE CASCADE
	await db.delete(users).where(eq(users.id, userId))
}
