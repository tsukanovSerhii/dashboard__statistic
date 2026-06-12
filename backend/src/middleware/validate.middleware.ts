import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

// validate req.body against a zod schema; respond 400 with a clear message on failure
export const validateBody =
	(schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body)
		if (!result.success) {
			const message = result.error.issues[0]?.message ?? 'Invalid input'
			return res.status(400).json({ error: message })
		}
		req.body = result.data
		next()
	}
