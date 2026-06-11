import type { AuthUser } from '@/types'
import { useAuthStore } from '../stores/auth.store'
import { api } from './client'

type AuthResponse = {
	token: string
	user: AuthUser
}

export const register = async (email: string, password: string) => {
	const { data } = await api.post<AuthResponse>('/auth/register', {
		email,
		password
	})
	useAuthStore.getState().setAuth(data.token, data.user)
	return data
}

export const login = async (email: string, password: string) => {
	const { data } = await api.post<AuthResponse>('/auth/login', {
		email,
		password
	})
	useAuthStore.getState().setAuth(data.token, data.user)
	return data
}

export const changePassword = async (
	currentPassword: string,
	newPassword: string
) => {
	const { data } = await api.patch<AuthResponse>('/auth/password', {
		currentPassword,
		newPassword
	})
	useAuthStore.getState().setAuth(data.token, data.user)
	return data
}

export const deleteAccount = async () => {
	await api.delete('/auth/account')
	useAuthStore.getState().logout()
}
