import type { Request, Response } from 'express'
import {
	changePassword,
	deleteUser,
	getUserById,
	loginUser,
	refreshAccessToken,
	registerUser,
	revokeRefreshToken
} from '../services/auth.service.js'

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const result = await registerUser(email, password)
		res.status(201).json(result)
	} catch (err) {
		res.status(400).json({ error: (err as Error).message })
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const result = await loginUser(email, password)
		res.status(200).json(result)
	} catch (err) {
		res.status(400).json({ error: (err as Error).message })
	}
}

export const me = async (req: Request, res: Response) => {
	// req.userId is set by the authenticate middleware
	const user = await getUserById(req.userId!)
	if (!user) {
		return res.status(404).json({ error: 'User not found' })
	}
	res.json({ user })
}

export const updatePassword = async (req: Request, res: Response) => {
	try {
		const { currentPassword, newPassword } = req.body
		if (!currentPassword || !newPassword) {
			return res
				.status(400)
				.json({ error: 'Current and new password are required' })
		}
		if (String(newPassword).length < 6) {
			return res
				.status(400)
				.json({ error: 'New password must be at least 6 characters' })
		}
		await changePassword(req.userId!, currentPassword, newPassword)
		res.json({ message: 'Password updated' })
	} catch (err) {
		res.status(400).json({ error: (err as Error).message })
	}
}

export const deleteAccount = async (req: Request, res: Response) => {
	await deleteUser(req.userId!)
	res.status(204).send()
}

export const refresh = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.body
		const tokens = await refreshAccessToken(refreshToken)
		res.json(tokens)
	} catch {
		res.status(401).json({ error: 'Invalid or expired refresh token' })
	}
}

export const logout = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.body
		if (refreshToken) await revokeRefreshToken(refreshToken)
	} finally {
		res.status(204).send()
	}
}
