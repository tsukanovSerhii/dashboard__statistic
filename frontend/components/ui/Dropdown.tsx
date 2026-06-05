'use client'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type DropdownProps = {
	options: string[]
	value?: string
	onChange?: (v: string) => void
	placeholder?: string
}

export const Dropdown = ({
	options,
	value,
	onChange,
	placeholder = 'Dropdown'
}: DropdownProps) => {
	const [open, setOpen] = useState(false)

	const ref = useRef<HTMLDivElement>(null)

	const handleSelect = (option: string) => {
		onChange?.(option)
		setOpen(false)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			className="relative w-full"
			ref={ref}
		>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-light-gray bg-background px-3 text-sm text-gray"
			>
				{value || placeholder}
				<ChevronDownIcon
					size={20}
					className={cn(
						'shrink-0 text-light-gray transition-transform',
						open && 'rotate-180'
					)}
				/>
			</button>

			{open && (
				<ul className="absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-lg border border-light-gray bg-background">
					{options.map(option => (
						<li key={option}>
							<button
								type="button"
								onClick={() => handleSelect(option)}
								className={cn(
									'w-full px-3 py-2.5 text-left text-sm text-gray transition-colors hover:bg-primary/10',
									value === option && 'bg-primary/10 text-primary'
								)}
							>
								{option}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
