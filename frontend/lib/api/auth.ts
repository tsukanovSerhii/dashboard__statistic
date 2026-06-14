import type { AuthUser } from '@/types'
import { useAuthStore } from '../stores/auth.store'
import { api } from './client'

type AuthResponse = {
	accessToken: string
	refreshToken: string
	user: AuthUser
}

export const register = async (email: string, password: string) => {
	const { data } = await api.post<AuthResponse>('/auth/register', {
		email,
		password
	})
	useAuthStore.getState().setAuth(data.accessToken, data.refreshToken, data.user)
	return data
}

export const login = async (email: string, password: string) => {
	const { data } = await api.post<AuthResponse>('/auth/login', {
		email,
		password
	})
	useAuthStore.getState().setAuth(data.accessToken, data.refreshToken, data.user)
	return data
}

export const changePassword = async (
	currentPassword: string,
	newPassword: string
) => {
	await api.patch('/auth/password', { currentPassword, newPassword })
}

export const deleteAccount = async () => {
	const { refreshToken, logout } = useAuthStore.getState()
	await api.delete('/auth/account')
	// best-effort revoke — ignore errors
	if (refreshToken) {
		await api.post('/auth/logout', { refreshToken }).catch(() => null)
	}
	logout()
}
