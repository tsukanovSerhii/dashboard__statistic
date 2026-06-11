'use client'

import { uploadDataset } from '@/lib/api/datasets'
import { cn } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

type UploadZoneProps = {
	onUploaded: () => void
}

export const UploadZone = ({ onUploaded }: UploadZoneProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [fileName, setFileName] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleFile = async (file: File | undefined) => {
		if (!file) return
		setError(null)
		setFileName(file.name)
		setUploading(true)
		try {
			await uploadDataset(file)
			onUploaded()
		} catch (error) {
			console.error('Upload failed', error)
			setError('Failed to upload dataset')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div
			onClick={() => {
				if (!uploading) inputRef.current?.click()
			}}
			className={cn(
				'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center',
				uploading
					? 'pointer-events-none opacity-60 border-light-gray/30'
					: 'cursor-pointer border-light-gray/30 hover:border-primary'
			)}
		>
			<UploadCloud
				size={32}
				className="text-light-gray"
			/>
			<p className="text-sm text-gray">
				{uploading ? `Uploading ${fileName}...` : 'Click to upload a dataset'}
			</p>
			<p className="text-xs text-light-gray">CSV, XLSX, JSON</p>

			{error && <p className="text-xs text-error">{error}</p>}

			<input
				ref={inputRef}
				type="file"
				accept=".csv,.xlsx,.json"
				className="hidden"
				onChange={e => handleFile(e.target.files?.[0])}
			/>
		</div>
	)
}
