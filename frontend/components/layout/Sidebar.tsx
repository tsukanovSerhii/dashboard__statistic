'use client'

import { useThemeStore } from '@/lib/useThemeStore'
import { cn } from '@/lib/utils'
import { User } from '@/types'
import {
	ChartNoAxesColumnIncreasing,
	ChevronsLeftRight,
	LayoutDashboardIcon,
	LogOut,
	Moon,
	SettingsIcon,
	Sun
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
	const theme = useThemeStore(state => state.theme)
	const toggleTheme = useThemeStore(state => state.toggleTheme)
	const isDark = theme === 'dark'

	return (
		<aside className="flex h-screen w-64 flex-col border-r border-light-gray/20 px-6 py-4">
			<div className="flex items-center justify-between">
				<img
					src="/logo.svg"
					alt="Logoipsum"
					className="h-8 w-auto"
				/>
				<button type="button">
					<ChevronsLeftRight
						size={16}
						className="opacity-50"
					/>
				</button>
			</div>

			<nav className="mt-6">
				<h2 className="mb-4 px-2 text-sm tracking-wider text-light-gray">
					Main
				</h2>
				<ul className="space-y-3">
					{navigation.map(item => {
						const isActive = pathname === item.href
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={cn(
										'flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors',
										isActive
											? 'bg-primary/10 text-primary'
											: 'text-gray hover:bg-primary/5'
									)}
								>
									<item.icon size={20} />
									{item.name}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			<div className="mt-auto">
				<h2 className="mb-4 px-2 text-sm tracking-wider text-light-gray">
					Other menu
				</h2>
				<ul className="space-y-3">
					<li>
						<button
							type="button"
							onClick={toggleTheme}
							className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-gray transition-colors hover:bg-primary/5"
						>
							{isDark ? <Sun size={20} /> : <Moon size={20} />}
							{isDark ? 'Light mode' : 'Dark mode'}
						</button>
					</li>
					<li>
						<button
							type="button"
							className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/5"
						>
							<LogOut size={20} />
							Logout
						</button>
					</li>
				</ul>

				<div className="mt-4 flex items-center gap-3 border-t border-light-gray/20 pt-4">
					<Avatar
						name={user.name}
						src={user.imgSrc || null}
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray">{user.name}</span>
						<span className="text-xs text-light-gray">Product designer</span>
					</div>
				</div>
			</div>
		</aside>
	)
}
