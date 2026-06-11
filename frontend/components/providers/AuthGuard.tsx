'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const token = useAuthStore(state => state.token)
	const hydrated = useAuthStore(state => state.hydrated)

	useEffect(() => {
		if (hydrated && !token) {
			router.replace('/login')
		}
	}, [hydrated, token, router])

	if (!hydrated) return null

	if (!token) return null

	return <>{children}</>
}
