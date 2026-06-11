import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<'button'> & {
	size?: 'xs' | 'sm' | 'md' | 'lg'
	variant?: 'primary' | 'danger' | 'ghost'
	disable?: boolean
}

const sizes = {
	xs: 'px-3 py-1.5 text-sm',
	sm: 'px-4 py-2 text-base',
	md: 'px-6 py-3 text-base',
	lg: 'px-5.5 py-4 text-lg'
}

const variants = {
	primary: 'bg-btn text-white hover:bg-btn-hover focus:bg-btn-pressed',
	danger: 'bg-error text-white hover:bg-error/90 focus:bg-error/80',
	ghost: 'bg-transparent text-error hover:bg-error/10'
}

export const Button = ({
	children,
	size = 'md',
	variant = 'primary',
	className,
	disable = false,
	...props
}: ButtonProps) => {
	return (
		<button
			className={cn(
				'rounded-lg transition-colors duration-300 ease-in-out',
				sizes[size],
				disable
					? 'cursor-not-allowed bg-btn-disabled text-gray hover:bg-btn-disabled focus:bg-btn-disabled'
					: cn('cursor-pointer', variants[variant]),
				className
			)}
			{...props}
		>
			{children}
		</button>
	)
}
