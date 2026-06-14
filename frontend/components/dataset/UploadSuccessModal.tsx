'use client'

import { cn, formatBytes } from '@/lib/utils'
import { CheckCircle2, FileJson, FileSpreadsheet, FileText, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type UploadedFile = {
	name: string
	sizeBytes: number
}

type UploadSuccessModalProps = {
	files: UploadedFile[]
	onClose: () => void
}

const fileIcon = (name: string) => {
	if (name.endsWith('.json')) return FileJson
	if (name.endsWith('.xlsx')) return FileSpreadsheet
	return FileText
}

const fileAccent = (name: string) => {
	if (name.endsWith('.json')) return 'text-warning bg-warning/10'
	if (name.endsWith('.xlsx')) return 'text-secondary bg-secondary/10'
	return 'text-primary bg-primary/10'
}

export const UploadSuccessModal = ({ files, onClose }: UploadSuccessModalProps) => {
	const [closing, setClosing] = useState(false)

	const close = () => {
		setClosing(true)
		setTimeout(onClose, 220)
	}

	// auto-close after 6 seconds
	useEffect(() => {
		const t = setTimeout(close, 6000)
		return () => clearTimeout(t)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const totalSize = files.reduce((s, f) => s + f.sizeBytes, 0)

	return (
		<div
			className={cn(
				'fixed right-4 top-4 z-50 w-80 rounded-2xl border border-light-gray/20 bg-surface shadow-2xl',
				closing ? 'animate-slide-out-right' : 'animate-slide-right'
			)}
		>
			{/* header */}
			<div className="flex items-center justify-between gap-3 border-b border-light-gray/10 px-4 py-3">
				<div className="flex items-center gap-2.5">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/15">
						<CheckCircle2 size={15} className="text-secondary" />
					</div>
					<div>
						<p className="text-sm font-semibold text-title">
							{files.length === 1 ? '1 file uploaded' : `${files.length} files uploaded`}
						</p>
						<p className="text-xs text-light-gray">{formatBytes(totalSize)} total</p>
					</div>
				</div>
				<button
					type="button"
					onClick={close}
					className="flex h-6 w-6 items-center justify-center rounded-lg text-light-gray transition-colors hover:bg-light-gray/10 hover:text-title"
				>
					<X size={13} />
				</button>
			</div>

			{/* file list */}
			<div className="flex flex-col gap-1.5 p-3">
				{files.map((f, i) => {
					const Icon = fileIcon(f.name)
					return (
						<div
							key={i}
							className="flex items-center gap-2.5 rounded-xl bg-background px-3 py-2"
						>
							<div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', fileAccent(f.name))}>
								<Icon size={13} />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-xs font-medium text-title">{f.name}</p>
								<p className="text-xs text-light-gray">{formatBytes(f.sizeBytes)}</p>
							</div>
							<CheckCircle2 size={13} className="shrink-0 text-secondary" />
						</div>
					)
				})}
			</div>

			{/* progress bar (auto-close timer) */}
			<div className="overflow-hidden rounded-b-2xl">
				<div
					className="h-0.5 bg-secondary"
					style={{ animation: 'shrink-width 6s linear forwards' }}
				/>
			</div>

			<style>{`
				@keyframes shrink-width {
					from { width: 100%; }
					to   { width: 0%; }
				}
			`}</style>
		</div>
	)
}
