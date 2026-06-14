'use client'

import { invalidateCache, uploadDataset } from '@/lib/api/datasets'
import { useConfirm } from '@/lib/hooks/useConfirm'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { CheckCircle2, FileSpreadsheet, Loader2, UploadCloud, X, XCircle } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmModal } from '../ui/ConfirmModal'
import { UploadSuccessModal } from './UploadSuccessModal'

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

type UploadedFile = { name: string; sizeBytes: number }

const ACCEPT = ['.csv', '.xlsx', '.json']
const isValid = (f: File) => ACCEPT.some(ext => f.name.toLowerCase().endsWith(ext))

export const UploadZone = ({ onUploaded, existingNames = [] }: UploadZoneProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [queue, setQueue] = useState<QueueItem[]>([])
	const [dragging, setDragging] = useState(false)
	const [modalFiles, setModalFiles] = useState<UploadedFile[] | null>(null)
	const { confirm, state: confirmState, handleConfirm, handleCancel } = useConfirm()

	const setStatus = (id: string, status: FileStatus, error?: string) =>
		setQueue(q => q.map(item => item.id === id ? { ...item, status, error } : item))

	const runQueue = useCallback(async (items: QueueItem[]) => {
		const pending = items.filter(i => i.status === 'pending')
		const succeeded: UploadedFile[] = []

		for (const item of pending) {
			setStatus(item.id, 'uploading')
			try {
				await uploadDataset(item.file)
				setStatus(item.id, 'done')
				succeeded.push({ name: item.file.name, sizeBytes: item.file.size })
			} catch (err) {
				const msg = axios.isAxiosError(err)
					? (err.response?.data?.error ?? 'Upload failed')
					: 'Upload failed'
				setStatus(item.id, 'error', msg)
			}
		}

		invalidateCache()
		onUploaded()

		if (succeeded.length > 0) {
			setModalFiles(succeeded)
		}
	}, [onUploaded])

	const handleAddAndRun = useCallback(async (files: File[]) => {
		const valid = files.filter(isValid)
		if (valid.length === 0) {
			toast.error('Only CSV, XLSX and JSON files are supported')
			return
		}

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

		const duplicates = valid.filter(f => existingNames.includes(f.name))
		if (duplicates.length > 0) {
			const names = duplicates.map(f => `"${f.name}"`).join(', ')
			const ok = await confirm({
				title: `${duplicates.length > 1 ? 'Files' : 'File'} already exist${duplicates.length > 1 ? '' : 's'}`,
				description: `${names} ${duplicates.length > 1 ? 'are' : 'is'} already in your datasets. Upload anyway and overwrite?`,
				confirmLabel: 'Upload anyway',
				variant: 'warning',
			})
			doAdd(ok ? valid : valid.filter(f => !duplicates.includes(f)))
		} else {
			doAdd(valid)
		}
	}, [existingNames, runQueue, confirm])

	const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
	const onDragLeave = () => setDragging(false)
	const onDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setDragging(false)
		handleAddAndRun(Array.from(e.dataTransfer.files))
	}

	const removeItem = (id: string) => setQueue(q => q.filter(i => i.id !== id))
	const clearDone = () => setQueue(q => q.filter(i => i.status !== 'done' && i.status !== 'error'))

	const hasDone = queue.some(i => i.status === 'done' || i.status === 'error')
	const isUploading = queue.some(i => i.status === 'uploading')

	return (
		<>
			<div className="flex flex-col gap-3">
				{/* Drop zone — compact horizontal */}
				<div
					onClick={() => { if (!isUploading) inputRef.current?.click() }}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					onDrop={onDrop}
					className={cn(
						'relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-4 transition-all duration-200',
						dragging
							? 'border-primary bg-primary/8 scale-[1.005]'
							: isUploading
								? 'pointer-events-none border-light-gray/20 opacity-60'
								: 'border-light-gray/20 hover:border-primary/50 hover:bg-primary/3'
					)}
				>
					<div className={cn(
						'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
						dragging ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
					)}>
						<UploadCloud size={20} />
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium text-title">
							{dragging ? 'Drop files here' : 'Click or drag & drop to upload'}
						</p>
						<p className="text-xs text-light-gray">CSV, XLSX, JSON · multiple files at once</p>
					</div>
					{isUploading && <Loader2 size={16} className="animate-spin shrink-0 text-primary" />}
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
					<div className="flex flex-col gap-1.5 rounded-xl border border-light-gray/15 bg-surface p-2.5">
						<div className="flex items-center justify-between px-1 pb-1">
							<span className="text-xs font-medium text-light-gray">
								{queue.length} file{queue.length !== 1 ? 's' : ''}
								{isUploading && <span className="ml-1 text-primary">· uploading…</span>}
							</span>
							{hasDone && !isUploading && (
								<button
									type="button"
									onClick={clearDone}
									className="text-xs text-light-gray transition-colors hover:text-title"
								>
									Clear
								</button>
							)}
						</div>

						{queue.map(item => (
							<div
								key={item.id}
								className={cn(
									'flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors',
									item.status === 'done'      && 'bg-secondary/8',
									item.status === 'error'     && 'bg-error/8',
									item.status === 'uploading' && 'bg-primary/8',
									item.status === 'pending'   && 'bg-background',
								)}
							>
								<FileSpreadsheet size={14} className="shrink-0 text-light-gray" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-medium text-title">{item.file.name}</p>
									{item.error && <p className="text-xs text-error">{item.error}</p>}
								</div>
								<div className="shrink-0">
									{item.status === 'uploading' && <Loader2 size={13} className="animate-spin text-primary" />}
									{item.status === 'done'      && <CheckCircle2 size={13} className="text-secondary" />}
									{item.status === 'error'     && <XCircle size={13} className="text-error" />}
									{item.status === 'pending'   && (
										<button
											type="button"
											onClick={() => removeItem(item.id)}
											className="rounded p-0.5 text-light-gray transition-colors hover:text-error"
										>
											<X size={12} />
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Success modal */}
			{modalFiles && (
				<UploadSuccessModal
					files={modalFiles}
					onClose={() => setModalFiles(null)}
				/>
			)}

			{/* Duplicate confirm */}
			{confirmState && (
				<ConfirmModal
					title={confirmState.title}
					description={confirmState.description}
					confirmLabel={confirmState.confirmLabel}
					variant={confirmState.variant}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}
		</>
	)
}
