import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

// Поки немає auth — користувач захардкоджений. Потім заміниться на реальні дані.
const user = {
	name: 'Hope Siefata',
	imgSrc: 'https://i.pravatar.cc/150?img=3'
}

export default function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex h-screen">
			<Sidebar user={user} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Topbar user={user} />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	)
}
