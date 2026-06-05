import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

type InputProps = React.ComponentProps<'input'> & {
	label?: string
	hint?: string
	state?: 'default' | 'error' | 'success'
	iconLeft?: LucideIcon
	iconRight?: LucideIcon
}

const states = {
	default: 'border-transparent focus:border-light-gray',
	error: 'border-error bg-error/10',
	success: 'border-secondary bg-secondary/10'
}

export const Input = ({
	label,
	hint,
	state = 'default',
	id,
	className,
	iconLeft: IconLeft,
	iconRight: IconRight,
	...props
}: InputProps) => {
	const hintColor =
		state === 'error'
			? 'text-error'
			: state === 'success'
				? 'text-secondary'
				: 'text-light-gray'

	return (
		<div className="flex w-full flex-col gap-1">
			{label && (
				<label
					htmlFor={id}
					className="text-xs text-light-gray"
				>
					{label}
				</label>
			)}
			<div
				className={cn(
					'flex min-h-11 items-center gap-2 rounded-lg border bg-background px-3',
					states[state]
				)}
			>
				{IconLeft && (
					<IconLeft
						size={20}
						className="shrink-0 text-light-gray"
					/>
				)}
				<input
					id={id}
					className={cn(
						'flex-1 bg-transparent py-1.5 text-sm text-gray outline-none placeholder:text-light-gray',
						className
					)}
					{...props}
				/>
				{IconRight && (
					<IconRight
						size={20}
						className="shrink-0 text-light-gray"
					/>
				)}
			</div>

			{hint && <span className={cn('text-[10px]', hintColor)}>{hint}</span>}
		</div>
	)
}
