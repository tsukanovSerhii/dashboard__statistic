'use client'

import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

export const UploadZone = () => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [fileName, setFileName] = useState<string | null>(null)

	const handleFile = (file: File | undefined) => {
		if (!file) return
		setFileName(file.name)
	}

	return (
		<div
			onClick={() => inputRef.current?.click()}
			className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-light-gray/30 p-8 text-center hover:border-primary"
		>
			<UploadCloud
				size={32}
				className="text-light-gray"
			/>
			<p className="text-sm text-gray">
				{fileName ?? 'Click or drag a file here'}
			</p>
			<p className="text-xs text-light-gray">CSV, XLSX, JSON</p>

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
