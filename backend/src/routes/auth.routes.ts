import { Router } from 'express'
import {
	deleteAccount,
	login,
	me,
	register,
	updatePassword
} from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { validateBody } from '../middleware/validate.middleware.js'
import {
	changePasswordSchema,
	loginSchema,
	registerSchema
} from '../validators/auth.schema.js'

export const authRoutes = Router()

authRoutes.post('/register', validateBody(registerSchema), register)
authRoutes.post('/login', validateBody(loginSchema), login)
authRoutes.get('/me', authenticate, me)
authRoutes.patch(
	'/password',
	authenticate,
	validateBody(changePasswordSchema),
	updatePassword
)
authRoutes.delete('/account', authenticate, deleteAccount)
