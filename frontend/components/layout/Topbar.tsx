'use client'

import { cn } from '@/lib/utils'
import { User } from '@/types'
import { Menu } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

type Props = {
	user: User
	onMenuClick?: () => void
}

const today = () =>
	new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})

export const Topbar = ({ user, onMenuClick }: Props) => {
	return (
		<header className="flex min-h-16 items-center justify-between border-b border-light-gray/15 bg-surface/80 px-4 py-3 backdrop-blur-sm sm:px-6">
			<div className="flex items-center gap-3">
				{/* Mobile burger */}
				<button
					type="button"
					onClick={onMenuClick}
					className={cn(
						'flex h-9 w-9 items-center justify-center rounded-xl text-light-gray',
						'transition-colors hover:bg-primary/8 hover:text-gray lg:hidden'
					)}
					aria-label="Open menu"
				>
					<Menu size={20} />
				</button>

				<div className="flex flex-col">
					<h4 className="text-base font-semibold leading-tight sm:text-lg">
						Welcome back, <span className="text-primary">{user.name.split('@')[0]}</span>!
					</h4>
					<p className="hidden text-xs text-light-gray sm:block">{today()}</p>
				</div>
			</div>

			<Avatar name={user.name} src={user.imgSrc || null} />
		</header>
	)
}
