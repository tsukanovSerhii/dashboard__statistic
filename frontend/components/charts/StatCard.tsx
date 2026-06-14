import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
	label: string
	value: string | number
	icon?: LucideIcon
	accent?: 'primary' | 'secondary' | 'warning' | 'error'
	sub?: string
}

const accentMap = {
	primary:   { bar: 'bg-primary',   icon: 'bg-primary/10 text-primary' },
	secondary: { bar: 'bg-secondary', icon: 'bg-secondary/10 text-secondary' },
	warning:   { bar: 'bg-warning',   icon: 'bg-warning/10 text-warning' },
	error:     { bar: 'bg-error',     icon: 'bg-error/10 text-error' },
}

export const StatCard = ({ label, value, icon: Icon, accent = 'primary', sub }: StatCardProps) => {
	const colors = accentMap[accent]
	return (
		<div className="relative overflow-hidden rounded-2xl border border-light-gray/20 bg-surface p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
			{/* accent bar */}
			<div className={cn('absolute left-0 top-0 h-full w-1 rounded-l-2xl', colors.bar)} />

			<div className="flex items-start justify-between gap-3 pl-2">
				<div className="flex flex-col gap-1">
					<span className="text-xs font-medium uppercase tracking-wider text-light-gray">{label}</span>
					<span className="text-2xl font-bold text-title">{value}</span>
					{sub && <span className="text-xs text-light-gray">{sub}</span>}
				</div>
				{Icon && (
					<div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', colors.icon)}>
						<Icon size={18} />
					</div>
				)}
			</div>
		</div>
	)
}
