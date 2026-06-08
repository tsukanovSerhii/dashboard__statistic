'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// redirect to /login if there is no token
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const token = useAuthStore(state => state.token)

	useEffect(() => {
		if (!token) {
			router.replace('/login')
		}
	}, [token, router])

	// don't render protected content while unauthenticated
	if (!token) return null

	return <>{children}</>
}
