import { cn } from '@/lib/utils'

type AvatarProps = { name: string; src?: string | null; className?: string }

export const Avatar = ({ name, src, className }: AvatarProps) => {
	const initial = name.charAt(0).toUpperCase()

	if (src) {
		return (
			<img
				src={src}
				alt={name}
				className={cn(
					'h-10 w-10 shrink-0 rounded-full object-cover',
					className
				)}
			/>
		)
	}

	return (
		<div
			className={cn(
				'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary leading-none',
				className
			)}
		>
			{initial}
		</div>
	)
}
