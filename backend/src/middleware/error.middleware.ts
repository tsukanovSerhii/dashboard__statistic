import type { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'

// centralized error handler — catches errors from multer and elsewhere
export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction
) => {
	if (err instanceof MulterError) {
		return res.status(400).json({ error: err.message })
	}
	if (err instanceof Error) {
		return res.status(400).json({ error: err.message })
	}
	res.status(500).json({ error: 'Internal server error' })
}
