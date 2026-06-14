import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL
})

// attach the access token to every outgoing request
api.interceptors.request.use(config => {
	const token = useAuthStore.getState().token
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

api.interceptors.response.use(
	res => res,
	async err => {
		const original = err.config

		if (err.response?.status !== 401 || original._retry) {
			return Promise.reject(err)
		}

		original._retry = true

		const { refreshToken, setAuth, logout, user } = useAuthStore.getState()

		if (!refreshToken) {
			logout()
			return Promise.reject(err)
		}

		try {
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
				{ refreshToken }
			)
			setAuth(data.accessToken, data.refreshToken, user!)
			original.headers.Authorization = `Bearer ${data.accessToken}`
			return api(original)
		} catch {
			logout()
			return Promise.reject(err)
		}
	}
)
