import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'

export const loginUser = async (email: string, password: string) => {
	const [found] = await db.select().from(users).where(eq(users.email, email))
	if (!found) {
		throw new Error('Invalid email or password')
	}

	const isMatch = await bcrypt.compare(password, found.password)
	if (!isMatch) {
		throw new Error('Invalid email or password')
	}

	const user = { id: found.id, email: found.email }

	const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
		expiresIn: '7d'
	})

	return { user, token }
}

export const getUserById = async (id: string) => {
	const [user] = await db
		.select({ id: users.id, email: users.email, createdAt: users.createdAt })
		.from(users)
		.where(eq(users.id, id))
	return user ?? null
}

export const registerUser = async (email: string, password: string) => {
	const existing = await db.select().from(users).where(eq(users.email, email))
	if (existing.length > 0) {
		throw new Error('Email already in use')
	}

	const passwordHash = await bcrypt.hash(password, 10)

	const [user] = await db
		.insert(users)
		.values({ email, password: passwordHash })
		.returning({ id: users.id, email: users.email })

	const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
		expiresIn: '7d'
	})

	return { user, token }
}
