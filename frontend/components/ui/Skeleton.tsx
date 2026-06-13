import { cn } from '@/lib/utils'

// a shimmering placeholder block used while content loads
export const Skeleton = ({ className }: { className?: string }) => (
	<div
		className={cn(
			'animate-pulse rounded-md bg-light-gray/20',
			className
		)}
	/>
)
