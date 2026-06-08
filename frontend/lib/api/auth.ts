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
