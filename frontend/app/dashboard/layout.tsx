'use client'

import { AuthGuard } from '@/components/providers/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { useAuthStore } from '@/lib/stores/auth.store'

export default function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const authUser = useAuthStore(state => state.user)

	// map the auth user to the UI user shape (name/imgSrc)
	const user = {
		name: authUser?.email ?? 'User',
		imgSrc: ''
	}

	return (
		<AuthGuard>
			<div className="flex h-screen">
				<Sidebar user={user} />
				<div className="flex flex-1 flex-col overflow-hidden">
					<Topbar user={user} />
					<main className="flex-1 overflow-y-auto p-6">{children}</main>
				</div>
			</div>
		</AuthGuard>
	)
}
