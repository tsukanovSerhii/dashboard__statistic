'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const router = useRouter()
	const token = useAuthStore(state => state.token)

	useEffect(() => {
		// send the user where they belong
		router.replace(token ? '/dashboard' : '/login')
	}, [token, router])

	return null
}
