'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DashboardShell = () => (
	<div className="flex h-screen bg-background">
		{/* sidebar placeholder */}
		<div className="hidden w-60 shrink-0 border-r border-light-gray/10 bg-surface lg:block" />
		{/* main area */}
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* topbar placeholder */}
			<div className="h-14 shrink-0 border-b border-light-gray/10 bg-surface" />
			{/* content pulse */}
			<div className="flex-1 overflow-hidden p-6">
				<div className="flex flex-col gap-4">
					<div className="h-8 w-48 animate-pulse rounded-xl bg-light-gray/10" />
					<div className="h-4 w-72 animate-pulse rounded-xl bg-light-gray/10" />
					<div className="mt-2 h-16 w-full animate-pulse rounded-2xl bg-light-gray/10" />
					<div className="grid grid-cols-3 gap-4 pt-2">
						{[1, 2, 3, 4, 5, 6].map(i => (
							<div key={i} className="h-44 animate-pulse rounded-2xl bg-light-gray/10" />
						))}
					</div>
				</div>
			</div>
		</div>
	</div>
)

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const token = useAuthStore(state => state.token)
	const hydrated = useAuthStore(state => state.hydrated)

	useEffect(() => {
		if (hydrated && !token) {
			router.replace('/login')
		}
	}, [hydrated, token, router])

	// show full-page skeleton while store hydrates from localStorage
	if (!hydrated) return <DashboardShell />

	// redirect in progress — keep skeleton visible
	if (!token) return <DashboardShell />

	return <>{children}</>
}
