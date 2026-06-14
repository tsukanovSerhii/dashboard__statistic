'use client'

import { DatasetListSkeleton } from '@/components/dataset/DatasetListSkeleton'
import { UploadZone } from '@/components/dataset/UploadZone'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { deleteDataset, getDatasets, invalidateCache } from '@/lib/api/datasets'
import { FILE_TYPE_BADGE } from '@/lib/constants'
import { cn, formatBytes, formatDate } from '@/lib/utils'
import { Dataset, FileType } from '@/types'
import axios from 'axios'
import { ChevronRight, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type SortOption = 'newest' | 'oldest' | 'name' | 'size' | 'rows'

export default function DashboardPage() {
	const [filter, setFilter] = useState<FileType | 'all'>('all')
	const [sort, setSort] = useState<SortOption>('newest')
	const [datasets, setDatasets] = useState<Dataset[]>([])
	const [loading, setLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)

	const filesTypes = ['all', 'csv', 'xlsx', 'json']
	const sortOptions = ['newest', 'oldest', 'name', 'size', 'rows']

	const loadDatasets = useCallback(async (signal?: AbortSignal) => {
		try {
			const data = await getDatasets()
			if (signal?.aborted) return
			setDatasets(data)
			setLoadError(false)
		} catch (err) {
			if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') return
			if (signal?.aborted) return
			setLoadError(true)
		} finally {
			if (!signal?.aborted) setLoading(false)
		}
	}, [])

	const handleDeleteDataset = async (
		e: React.MouseEvent,
		id: string,
		filename: string
	) => {
		e.preventDefault()
		e.stopPropagation()
		if (!confirm(`Delete "${filename}"?`)) return
		try {
			await deleteDataset(id)
			invalidateCache()
			toast.success(`"${filename}" deleted`)
			loadDatasets()
		} catch (err) {
			const message = axios.isAxiosError(err)
				? (err.response?.data?.error ?? 'Failed to delete dataset')
				: 'Failed to delete dataset'
			toast.error(message)
		}
	}

	useEffect(() => {
		const controller = new AbortController()
		const load = async () => { await loadDatasets(controller.signal) }
		load()
		return () => controller.abort()
	}, [loadDatasets])

	const filtered =
		filter === 'all' ? datasets : datasets.filter(d => d.fileType === filter)

	// sort a copy so we don't mutate state
	const filteredDatasets = [...filtered].sort((a, b) => {
		switch (sort) {
			case 'oldest':
				return a.createdAt.localeCompare(b.createdAt)
			case 'name':
				return a.filename.localeCompare(b.filename)
			case 'size':
				return b.sizeBytes - a.sizeBytes
			case 'rows':
				return b.rowCount - a.rowCount
			default: // newest
				return b.createdAt.localeCompare(a.createdAt)
		}
	})

	return (
		<div className="animate-fade-up flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">My datasets</h1>
				<p className="mt-1 text-sm text-light-gray">
					Upload a file to view column analytics
				</p>
			</div>

			<UploadZone onUploaded={() => loadDatasets()} />

			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-light-gray">
					Files · {filteredDatasets.length}
				</h2>
				<div className="flex gap-2">
					<div className="w-40">
						<Dropdown
							options={sortOptions}
							value={sort}
							onChange={v => setSort(v as SortOption)}
							placeholder="Sort by"
						/>
					</div>
					<div className="w-40">
						<Dropdown
							options={filesTypes}
							value={filter}
							onChange={v => setFilter(v as FileType | 'all')}
							placeholder="Filter by type"
						/>
					</div>
				</div>
			</div>

			{loading ? (
				<DatasetListSkeleton />
			) : loadError ? (
				<div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-error/30 bg-error/5 p-10 text-center text-sm text-error">
					Could not load datasets. Is the server running?
					<button
						type="button"
						onClick={() => loadDatasets()}
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
							className="group flex items-center gap-4 rounded-xl border border-light-gray/20 bg-surface p-4 transition-all duration-200 hover:scale-[1.01] hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
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
