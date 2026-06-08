import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL
})

// attach the JWT token to every request (read straight from the store)
api.interceptors.request.use(config => {
	const token = useAuthStore.getState().token
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// on 401 (expired/invalid token) — log out so the UI redirects to login
api.interceptors.response.use(
	res => res,
	error => {
		if (error.response?.status === 401) {
			useAuthStore.getState().logout()
		}
		return Promise.reject(error)
	}
)
