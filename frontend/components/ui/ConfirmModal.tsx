'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Variant = 'danger' | 'warning'

type ConfirmModalProps = {
	title: string
	description?: string
	confirmLabel?: string
	cancelLabel?: string
	variant?: Variant
	onConfirm: () => void
	onCancel: () => void
}

const variantStyles: Record<Variant, { icon: string; btn: string; iconBg: string }> = {
	danger:  { icon: 'text-error',   iconBg: 'bg-error/10',   btn: 'bg-error hover:bg-error/90 text-white' },
	warning: { icon: 'text-warning', iconBg: 'bg-warning/10', btn: 'bg-warning hover:bg-warning/90 text-white' },
}

export const ConfirmModal = ({
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	variant = 'danger',
	onConfirm,
	onCancel,
}: ConfirmModalProps) => {
	const confirmRef = useRef<HTMLButtonElement>(null)
	const styles = variantStyles[variant]

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onCancel()
			if (e.key === 'Enter') onConfirm()
		}
		window.addEventListener('keydown', handler)
		// focus confirm button for keyboard UX
		confirmRef.current?.focus()
		return () => window.removeEventListener('keydown', handler)
	}, [onCancel, onConfirm])

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onCancel}
			/>

			{/* Panel */}
			<div className="relative z-10 w-full max-w-sm animate-fade-up rounded-2xl border border-light-gray/20 bg-surface p-6 shadow-2xl">
				{/* Close */}
				<button
					type="button"
					onClick={onCancel}
					className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-light-gray transition-colors hover:bg-light-gray/10 hover:text-title"
				>
					<X size={14} />
				</button>

				{/* Icon + title */}
				<div className="flex items-start gap-4">
					<div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', styles.iconBg)}>
						<AlertTriangle size={20} className={styles.icon} />
					</div>
					<div className="min-w-0">
						<h2 id="confirm-title" className="text-sm font-semibold text-title">
							{title}
						</h2>
						{description && (
							<p className="mt-1 text-xs text-light-gray leading-relaxed">{description}</p>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-xl border border-light-gray/20 px-4 py-2 text-sm text-light-gray transition-colors hover:bg-light-gray/10 hover:text-title"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={onConfirm}
						className={cn('rounded-xl px-4 py-2 text-sm font-semibold transition-colors', styles.btn)}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	)
}
