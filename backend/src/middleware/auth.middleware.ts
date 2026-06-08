import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

declare global {
	namespace Express {
		interface Request {
			userId?: string
		}
	}
}

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const header = req.headers.authorization

	// expect "Bearer <token>"
	if (!header || !header.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No token provided' })
	}

	const token = header.split(' ')[1]

	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string }
		req.userId = payload.userId
		next()
	} catch {
		return res.status(401).json({ error: 'Invalid or expired token' })
	}
}
