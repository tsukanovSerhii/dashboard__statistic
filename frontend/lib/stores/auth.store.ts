import type { AuthUser } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
	token: string | null
	refreshToken: string | null
	user: AuthUser | null
	// becomes true once persist has finished reading localStorage
	hydrated: boolean
	// save token + user after login/register
	setAuth: (token: string, refreshToken: string, user: AuthUser) => void
	// clear on logout
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		set => ({
			token: null,
			refreshToken: null,
			user: null,
			hydrated: false,
			setAuth: (token, refreshToken, user) =>
				set({ token, refreshToken, user }),
			logout: () => set({ token: null, refreshToken: null, user: null })
		}),
		{
			name: 'auth', // localStorage key
			// runs after the persisted state is loaded from localStorage
			onRehydrateStorage: () => state => {
				if (state) state.hydrated = true
			}
		}
	)
)
