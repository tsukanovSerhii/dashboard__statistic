'use client'

import { UploadZone } from '@/components/dataset/UploadZone'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { deleteDataset, getDatasets } from '@/lib/api/datasets'
import { FILE_TYPE_BADGE } from '@/lib/constants'
import { cn, formatBytes, formatDate } from '@/lib/utils'
import { Dataset, FileType } from '@/types'
import { ChevronRight, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
	const [filter, setFilter] = useState<FileType | 'all'>('all')
	const [datasets, setDatasets] = useState<Dataset[]>([])
	const [loading, setLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)

	const loadDatasets = async () => {
		try {
			const data = await getDatasets()
			setDatasets(data)
			setLoadError(false)
		} catch {
			setLoadError(true)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteDataset = async (
		e: React.MouseEvent,
		id: string,
		filename: string
	) => {
		e.preventDefault()
		e.stopPropagation()
		if (!confirm(`Delete "${filename}"?`)) return
		await deleteDataset(id)
		loadDatasets()
	}

	useEffect(() => {
		const load = async () => {
			try {
				const data = await getDatasets()
				setDatasets(data)
				setLoadError(false)
			} catch {
				setLoadError(true)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	const filteredDatasets =
		filter === 'all' ? datasets : datasets.filter(d => d.fileType === filter)

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">My datasets</h1>
				<p className="mt-1 text-sm text-light-gray">
					Upload a file to view column analytics
				</p>
			</div>

			<UploadZone onUploaded={loadDatasets} />

			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-light-gray">
					Files · {filteredDatasets.length}
				</h2>
				<div className="w-48">
					<Dropdown
						options={['all', 'csv', 'xlsx', 'json']}
						value={filter}
						onChange={v => setFilter(v as FileType | 'all')}
						placeholder="Filter by type"
					/>
				</div>
			</div>

			{loading ? (
				<div className="rounded-xl border border-dashed border-light-gray/30 p-10 text-center text-sm text-light-gray">
					Loading files...
				</div>
			) : loadError ? (
				<div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-error/30 bg-error/5 p-10 text-center text-sm text-error">
					Could not load datasets. Is the server running?
					<button
						type="button"
						onClick={loadDatasets}
						className="cursor-pointer rounded-lg border border-error/40 px-3 py-1.5 text-error transition-colors hover:bg-error/10"
					>
						Retry
					</button>
				</div>
			) : filteredDatasets.length === 0 ? (
				<div className="rounded-xl border border-dashed border-light-gray/30 p-10 text-center text-sm text-light-gray">
					No datasets yet. Upload a file to get started.
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{filteredDatasets.map(d => (
						<Link
							key={d.id}
							href={`/dashboard/${d.id}`}
							className="group flex items-center gap-4 rounded-xl border border-light-gray/20 bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
						>
							{/* icon */}
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background">
								<FileSpreadsheet
									size={22}
									className="text-light-gray"
								/>
							</div>

							{/* name + type */}
							<div className="flex min-w-0 flex-1 flex-col">
								<div className="flex items-center gap-2">
									<span className="truncate font-medium text-gray">
										{d.filename}
									</span>
									<span
										className={cn(
											'rounded px-1.5 py-0.5 text-xs font-medium uppercase',
											FILE_TYPE_BADGE[d.fileType]
										)}
									>
										{d.fileType}
									</span>
								</div>
								<span className="mt-0.5 text-xs text-light-gray">
									{formatDate(d.createdAt)}
								</span>
							</div>

							{/* metadata */}
							<div className="hidden shrink-0 gap-6 text-right sm:flex">
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray">
										{d.rowCount.toLocaleString('en-US')}
									</span>
									<span className="text-xs text-light-gray">rows</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray">
										{d.columnCount}
									</span>
									<span className="text-xs text-light-gray">columns</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray">
										{formatBytes(d.sizeBytes)}
									</span>
									<span className="text-xs text-light-gray">size</span>
								</div>
								<Button
									size="xs"
									variant="danger"
									onClick={e => handleDeleteDataset(e, d.id, d.filename)}
								>
									Delete
								</Button>
							</div>

							<ChevronRight
								size={20}
								className="shrink-0 text-light-gray transition-transform group-hover:translate-x-0.5"
							/>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
