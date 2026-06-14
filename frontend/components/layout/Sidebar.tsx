'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useSidebarStore } from '@/lib/stores/sidebar.store'
import { useThemeStore } from '@/lib/stores/theme.store'
import { cn } from '@/lib/utils'
import { User } from '@/types'
import {
	ChartNoAxesColumnIncreasing,
	ChevronsLeft,
	LayoutDashboardIcon,
	LogOut,
	Moon,
	SettingsIcon,
	Sun
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from '../ui/Avatar'

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
	{
		name: 'Analytics',
		href: '/dashboard/analytics',
		icon: ChartNoAxesColumnIncreasing
	},
	{ name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon }
]

type Props = {
	user: User
}

export const Sidebar = ({ user }: Props) => {
	const pathname = usePathname()
	const router = useRouter()
	const logout = useAuthStore(state => state.logout)
	const theme = useThemeStore(state => state.theme)
	const toggleTheme = useThemeStore(state => state.toggleTheme)
	const collapsed = useSidebarStore(state => state.collapsed)
	const toggleSidebar = useSidebarStore(state => state.toggle)
	const isDark = theme === 'dark'

	const handleLogout = () => {
		logout()
		router.replace('/login')
	}

	// shared classes for a clickable row (nav link / menu button)
	const rowClass = (active = false, danger = false) =>
		cn(
			'flex items-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors',
			collapsed ? 'justify-center px-0' : 'px-2',
			danger
				? 'text-error hover:bg-error/5'
				: active
					? 'bg-primary/10 text-primary'
					: 'text-gray hover:bg-primary/5'
		)

	return (
		<aside
			className={cn(
				'flex h-screen flex-col border-r border-light-gray/20 py-4 transition-all duration-300',
				collapsed ? 'w-20 px-3' : 'w-64 px-6'
			)}
		>
			{/* logo + collapse toggle */}
			<div
				className={cn(
					'flex items-center',
					collapsed ? 'justify-center' : 'justify-between'
				)}
			>
				{!collapsed && (
					<img
						src="/logo.svg"
						alt="Logoipsum"
						className="h-8 w-auto"
					/>
				)}
				<button
					type="button"
					onClick={toggleSidebar}
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					className="rounded-md p-1 text-light-gray transition-colors hover:bg-primary/5 hover:text-gray"
				>
					<ChevronsLeft
						size={18}
						className={cn('transition-transform', collapsed && 'rotate-180')}
					/>
				</button>
			</div>

			<nav className="mt-6">
				{!collapsed && (
					<h2 className="mb-4 px-2 text-sm tracking-wider text-light-gray">
						Main
					</h2>
				)}
				<ul className="space-y-3">
					{navigation.map(item => {
						const isActive = pathname === item.href
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									title={collapsed ? item.name : undefined}
									className={rowClass(isActive)}
								>
									<item.icon
										size={20}
										className="shrink-0"
									/>
									{!collapsed && item.name}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			<div className="mt-auto">
				{!collapsed && (
					<h2 className="mb-4 px-2 text-sm tracking-wider text-light-gray">
						Other menu
					</h2>
				)}
				<ul className="space-y-3">
					<li>
						<button
							type="button"
							onClick={toggleTheme}
							title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
							className={cn(rowClass(), 'w-full')}
						>
							{isDark ? (
								<Sun
									size={20}
									className="shrink-0"
								/>
							) : (
								<Moon
									size={20}
									className="shrink-0"
								/>
							)}
							{!collapsed && (isDark ? 'Light mode' : 'Dark mode')}
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={handleLogout}
							title={collapsed ? 'Logout' : undefined}
							className={cn(rowClass(false, true), 'w-full')}
						>
							<LogOut
								size={20}
								className="shrink-0"
							/>
							{!collapsed && 'Logout'}
						</button>
					</li>
				</ul>

				<div
					className={cn(
						'mt-4 flex items-center border-t border-light-gray/20 pt-4',
						collapsed ? 'justify-center' : 'gap-3'
					)}
				>
					<Avatar
						name={user.name}
						src={user.imgSrc || null}
					/>
					{!collapsed && (
						<div className="flex flex-col">
							<span className="text-sm font-medium text-gray">{user.name}</span>
							<span className="text-xs text-light-gray">Product designer</span>
						</div>
					)}
				</div>
			</div>
		</aside>
	)
}
