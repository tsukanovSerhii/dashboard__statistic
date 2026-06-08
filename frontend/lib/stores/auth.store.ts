import type { AuthUser } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
	token: string | null
	user: AuthUser | null
	// save token + user after login/register
	setAuth: (token: string, user: AuthUser) => void
	// clear on logout
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		set => ({
			token: null,
			user: null,
			setAuth: (token, user) => set({ token, user }),
			logout: () => set({ token: null, user: null })
		}),
		{ name: 'auth' } // localStorage key
	)
)
