'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const router = useRouter()
	const token = useAuthStore(state => state.token)
	const hydrated = useAuthStore(state => state.hydrated)

	useEffect(() => {
		// wait for persist to load localStorage before deciding
		if (!hydrated) return
		router.replace(token ? '/dashboard' : '/login')
	}, [hydrated, token, router])

	return null
}
