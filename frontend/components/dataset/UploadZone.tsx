'use client'

import { invalidateCache, uploadDataset } from '@/lib/api/datasets'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { CheckCircle2, FileSpreadsheet, Loader2, UploadCloud, X, XCircle } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

type UploadZoneProps = {
	onUploaded: () => void
	existingNames?: string[]
}

type FileStatus = 'pending' | 'uploading' | 'done' | 'error'

type QueueItem = {
	id: string
	file: File
	status: FileStatus
	error?: string
}

const ACCEPT = ['.csv', '.xlsx', '.json']
const isValid = (f: File) => ACCEPT.some(ext => f.name.toLowerCase().endsWith(ext))

export const UploadZone = ({ onUploaded, existingNames = [] }: UploadZoneProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [queue, setQueue] = useState<QueueItem[]>([])
	const [dragging, setDragging] = useState(false)

	const setStatus = (id: string, status: FileStatus, error?: string) =>
		setQueue(q => q.map(item => item.id === id ? { ...item, status, error } : item))

	const addFiles = useCallback((files: File[]) => {
		const valid = files.filter(isValid)
		if (valid.length === 0) {
			toast.error('Only CSV, XLSX and JSON files are supported')
			return
		}

		// detect duplicates against existing datasets
		const duplicates = valid.filter(f => existingNames.includes(f.name))
		const proceed = (filesToAdd: File[]) => {
			const items: QueueItem[] = filesToAdd.map(f => ({
				id: `${f.name}-${Date.now()}-${Math.random()}`,
				file: f,
				status: 'pending'
			}))
			setQueue(q => [...q, ...items])
		}

		if (duplicates.length > 0) {
			const names = duplicates.map(f => `"${f.name}"`).join(', ')
			const confirmed = confirm(
				`${names} already exist${duplicates.length > 1 ? '' : 's'} in your datasets.\n\nUpload anyway?`
			)
			if (!confirmed) {
				// only add non-duplicates
				proceed(valid.filter(f => !duplicates.includes(f)))
				return
			}
		}

		proceed(valid)
	}, [existingNames])

	// upload all pending items one by one
	const runQueue = useCallback(async (items: QueueItem[]) => {
		const pending = items.filter(i => i.status === 'pending')
		for (const item of pending) {
			setStatus(item.id, 'uploading')
			try {
				await uploadDataset(item.file)
				setStatus(item.id, 'done')
			} catch (err) {
				const msg = axios.isAxiosError(err)
					? (err.response?.data?.error ?? 'Upload failed')
					: 'Upload failed'
				setStatus(item.id, 'error', msg)
			}
		}
		invalidateCache()
		onUploaded()
	}, [onUploaded])

	const handleAddAndRun = useCallback((files: File[]) => {
		const valid = files.filter(isValid)
		if (valid.length === 0) {
			toast.error('Only CSV, XLSX and JSON files are supported')
			return
		}

		const duplicates = valid.filter(f => existingNames.includes(f.name))
		const doAdd = (filesToAdd: File[]) => {
			if (filesToAdd.length === 0) return
			const items: QueueItem[] = filesToAdd.map(f => ({
				id: `${f.name}-${Date.now()}-${Math.random()}`,
				file: f,
				status: 'pending'
			}))
			setQueue(q => {
				const next = [...q, ...items]
				runQueue(next)
				return next
			})
		}

		if (duplicates.length > 0) {
			const names = duplicates.map(f => `"${f.name}"`).join(', ')
			const confirmed = confirm(
				`${names} already exist${duplicates.length > 1 ? '' : 's'} in your datasets.\n\nUpload anyway?`
			)
			doAdd(confirmed ? valid : valid.filter(f => !duplicates.includes(f)))
		} else {
			doAdd(valid)
		}
	}, [existingNames, runQueue])

	// drag events
	const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
	const onDragLeave = () => setDragging(false)
	const onDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setDragging(false)
		handleAddAndRun(Array.from(e.dataTransfer.files))
	}

	const removeItem = (id: string) =>
		setQueue(q => q.filter(i => i.id !== id))

	const clearDone = () =>
		setQueue(q => q.filter(i => i.status !== 'done' && i.status !== 'error'))

	const hasDone = queue.some(i => i.status === 'done' || i.status === 'error')
	const isUploading = queue.some(i => i.status === 'uploading')

	return (
		<div className="flex flex-col gap-3">
			{/* Drop zone */}
			<div
				onClick={() => { if (!isUploading) inputRef.current?.click() }}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={cn(
					'relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
					dragging
						? 'border-primary bg-primary/8 scale-[1.01]'
						: isUploading
							? 'pointer-events-none border-light-gray/20 opacity-60'
							: 'border-light-gray/25 hover:border-primary/60 hover:bg-primary/4'
				)}
			>
				<div className={cn(
					'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
					dragging ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
				)}>
					<UploadCloud size={24} />
				</div>

				<div>
					<p className="text-sm font-medium text-title">
						{dragging ? 'Drop files here' : 'Click or drag & drop to upload'}
					</p>
					<p className="mt-0.5 text-xs text-light-gray">CSV, XLSX, JSON · multiple files at once</p>
				</div>

				<input
					ref={inputRef}
					type="file"
					accept=".csv,.xlsx,.json"
					multiple
					className="hidden"
					onChange={e => {
						handleAddAndRun(Array.from(e.target.files ?? []))
						e.target.value = ''
					}}
				/>
			</div>

			{/* Queue list */}
			{queue.length > 0 && (
				<div className="flex flex-col gap-2 rounded-2xl border border-light-gray/15 bg-surface p-3">
					<div className="flex items-center justify-between px-1">
						<span className="text-xs font-medium text-light-gray">
							{queue.length} file{queue.length !== 1 ? 's' : ''}
							{isUploading && ' · uploading…'}
						</span>
						{hasDone && !isUploading && (
							<button
								type="button"
								onClick={clearDone}
								className="text-xs text-light-gray hover:text-gray transition-colors"
							>
								Clear done
							</button>
						)}
					</div>

					{queue.map(item => (
						<div
							key={item.id}
							className={cn(
								'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
								item.status === 'done'  && 'bg-secondary/8',
								item.status === 'error' && 'bg-error/8',
								item.status === 'uploading' && 'bg-primary/8',
								item.status === 'pending' && 'bg-background',
							)}
						>
							{/* file icon */}
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-light-gray/10">
								<FileSpreadsheet size={15} className="text-light-gray" />
							</div>

							{/* name */}
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-title">{item.file.name}</p>
								{item.error && (
									<p className="text-xs text-error">{item.error}</p>
								)}
							</div>

							{/* status icon */}
							<div className="shrink-0">
								{item.status === 'uploading' && (
									<Loader2 size={16} className="animate-spin text-primary" />
								)}
								{item.status === 'done' && (
									<CheckCircle2 size={16} className="text-secondary" />
								)}
								{item.status === 'error' && (
									<XCircle size={16} className="text-error" />
								)}
								{item.status === 'pending' && (
									<button
										type="button"
										onClick={() => removeItem(item.id)}
										className="rounded p-0.5 text-light-gray hover:text-error transition-colors"
									>
										<X size={14} />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
