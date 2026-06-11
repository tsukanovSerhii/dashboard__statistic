import { Router } from 'express'
import {
	deleteAccount,
	login,
	me,
	register,
	updatePassword
} from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

export const authRoutes = Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.get('/me', authenticate, me)
authRoutes.patch('/password', authenticate, updatePassword)
authRoutes.delete('/account', authenticate, deleteAccount)
