'use client'

import { useAuthStore } from '@/lib/stores/auth.store'
import { useSidebarStore } from '@/lib/stores/sidebar.store'
import { useThemeStore } from '@/lib/stores/theme.store'
import { cn } from '@/lib/utils'
import { User } from '@/types'
import {
	BarChart3,
	ChartNoAxesColumnIncreasing,
	ChevronsLeft,
	LayoutDashboardIcon,
	LogOut,
	Moon,
	SettingsIcon,
	Sun,
	X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from '../ui/Avatar'

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
	{ name: 'Analytics', href: '/dashboard/analytics', icon: ChartNoAxesColumnIncreasing },
	{ name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
]

type Props = { user: User; mobileOpen?: boolean; onMobileClose?: () => void }

export const Sidebar = ({ user, mobileOpen = false, onMobileClose }: Props) => {
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

	const handleNavClick = () => {
		onMobileClose?.()
	}

	const rowClass = (active = false, danger = false) =>
		cn(
			'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-150',
			collapsed ? 'justify-center px-2' : 'px-3',
			danger
				? 'text-error hover:bg-error/8'
				: active
					? 'bg-primary text-white shadow-sm shadow-primary/30'
					: 'text-light-gray hover:bg-primary/8 hover:text-gray'
		)

	const sidebarContent = (
		<div className={cn(
			'flex h-full flex-col py-5 transition-all duration-300',
			collapsed ? 'px-3' : 'px-4'
		)}>
			{/* Logo + toggle */}
			<div className={cn('flex items-center mb-6', collapsed ? 'justify-center' : 'justify-between px-1')}>
				{!collapsed && (
					<div className="flex items-center gap-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
							<BarChart3 size={14} className="text-white" />
						</div>
						<span className="font-semibold text-title">DataLens</span>
					</div>
				)}
				<div className="flex items-center gap-1">
					{/* mobile close */}
					{mobileOpen && (
						<button
							type="button"
							onClick={onMobileClose}
							className="rounded-lg p-1.5 text-light-gray hover:bg-primary/8 hover:text-gray lg:hidden"
						>
							<X size={16} />
						</button>
					)}
					{/* desktop collapse */}
					<button
						type="button"
						onClick={toggleSidebar}
						aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						className="hidden rounded-lg p-1.5 text-light-gray hover:bg-primary/8 hover:text-gray lg:block"
					>
						<ChevronsLeft
							size={16}
							className={cn('transition-transform duration-300', collapsed && 'rotate-180')}
						/>
					</button>
				</div>
			</div>

			{/* Nav */}
			<nav className="flex-1">
				{!collapsed && (
					<p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-light-gray/70">
						Menu
					</p>
				)}
				<ul className="space-y-1">
					{navigation.map(item => {
						const isActive = pathname === item.href
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									onClick={handleNavClick}
									title={collapsed ? item.name : undefined}
									className={rowClass(isActive)}
								>
									<item.icon size={18} className="shrink-0" />
									{!collapsed && <span>{item.name}</span>}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			{/* Bottom */}
			<div className="space-y-1">
				{!collapsed && (
					<p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-light-gray/70">
						Preferences
					</p>
				)}
				<button
					type="button"
					onClick={toggleTheme}
					title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
					className={cn(rowClass(), 'w-full')}
				>
					{isDark
						? <Sun size={18} className="shrink-0" />
						: <Moon size={18} className="shrink-0" />
					}
					{!collapsed && (isDark ? 'Light mode' : 'Dark mode')}
				</button>
				<button
					type="button"
					onClick={handleLogout}
					title={collapsed ? 'Logout' : undefined}
					className={cn(rowClass(false, true), 'w-full')}
				>
					<LogOut size={18} className="shrink-0" />
					{!collapsed && 'Logout'}
				</button>

				<div className={cn(
					'mt-3 flex items-center border-t border-light-gray/15 pt-3',
					collapsed ? 'justify-center' : 'gap-3 px-1'
				)}>
					<Avatar name={user.name} src={user.imgSrc || null} />
					{!collapsed && (
						<div className="min-w-0 flex flex-col">
							<span className="truncate text-sm font-medium text-title">{user.name}</span>
							<span className="text-xs text-light-gray">Free plan</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)

	return (
		<>
			{/* Desktop sidebar */}
			<aside className={cn(
				'hidden h-screen shrink-0 border-r border-light-gray/15 bg-surface transition-all duration-300 lg:flex lg:flex-col',
				collapsed ? 'w-17' : 'w-60'
			)}>
				{sidebarContent}
			</aside>

			{/* Mobile drawer overlay */}
			{mobileOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
						onClick={onMobileClose}
					/>
					<aside className="absolute left-0 top-0 h-full w-64 bg-surface shadow-2xl animate-slide-left">
						{sidebarContent}
					</aside>
				</div>
			)}
		</>
	)
}
