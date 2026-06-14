'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { AuthGuard } from '@/components/providers/AuthGuard'
import { useAuthStore } from '@/lib/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const authUser = useAuthStore(state => state.user)
	const router = useRouter()
	const [mobileOpen, setMobileOpen] = useState(false)

	useEffect(() => {
		router.prefetch('/dashboard/analytics')
		router.prefetch('/dashboard/settings')
	}, [router])

	const user = {
		name: authUser?.email ?? 'User',
		imgSrc: ''
	}

	return (
		<AuthGuard>
			<div className="flex h-screen bg-background">
				<Sidebar
					user={user}
					mobileOpen={mobileOpen}
					onMobileClose={() => setMobileOpen(false)}
				/>
				<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
					<Topbar user={user} onMenuClick={() => setMobileOpen(true)} />
					<main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
				</div>
			</div>
		</AuthGuard>
	)
}
