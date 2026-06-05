import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<'button'> & {
	size?: 'xs' | 'sm' | 'md' | 'lg'
	disable?: boolean
}

const sizes = {
	xs: 'px-3 py-1.5 text-sm',
	sm: 'px-4 py-2 text-base',
	md: 'px-6 py-3 text-base',
	lg: 'px-5.5 py-4 text-lg'
}

export const Button = ({
	children,
	size = 'md',
	className,
	disable = false,
	...props
}: ButtonProps) => {
	return (
		<button
			className={cn(
				'bg-btn text-white transition-colors duration-300 ease-in-out hover:bg-btn-hover focus:bg-btn-pressed',
				sizes[size],
				disable
					? 'cursor-not-allowed text-gray bg-btn-disabled hover:bg-btn-disabled focus:bg-btn-disabled'
					: 'cursor-pointer',
				className
			)}
			{...props}
		>
			{children}
		</button>
	)
}
