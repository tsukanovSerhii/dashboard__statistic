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
import { ChevronRight, Database, FileSpreadsheet, HardDrive, Rows3 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type SortOption = 'newest' | 'oldest' | 'name' | 'size' | 'rows'

const filesTypes = ['all', 'csv', 'xlsx', 'json']
const sortOptions = ['newest', 'oldest', 'name', 'size', 'rows']

export default function DashboardPage() {
	const [filter, setFilter] = useState<FileType | 'all'>('all')
	const [sort, setSort] = useState<SortOption>('newest')
	const [datasets, setDatasets] = useState<Dataset[]>([])
	const [loading, setLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)

	const loadDatasets = useCallback(async () => {
		try {
			const data = await getDatasets()
			setDatasets(data)
			setLoadError(false)
		} catch {
			setLoadError(true)
		} finally {
			setLoading(false)
		}
	}, [])

	const handleDeleteDataset = async (e: React.MouseEvent, id: string, filename: string) => {
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
		const load = async () => { await loadDatasets() }
		load()
	}, [loadDatasets])

	const filtered = filter === 'all' ? datasets : datasets.filter(d => d.fileType === filter)
	const filteredDatasets = [...filtered].sort((a, b) => {
		switch (sort) {
			case 'oldest': return a.createdAt.localeCompare(b.createdAt)
			case 'name':   return a.filename.localeCompare(b.filename)
			case 'size':   return b.sizeBytes - a.sizeBytes
			case 'rows':   return b.rowCount - a.rowCount
			default:       return b.createdAt.localeCompare(a.createdAt)
		}
	})

	// summary stats from loaded datasets
	const totalRows  = datasets.reduce((s, d) => s + d.rowCount, 0)
	const totalSize  = datasets.reduce((s, d) => s + d.sizeBytes, 0)
	const totalCols  = datasets.reduce((s, d) => s + d.columnCount, 0)

	return (
		<div className="animate-fade-up flex flex-col gap-6">

			{/* ── Hero banner ── */}
			<div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 sm:px-8">
				{/* dot grid overlay */}
				<div className="absolute inset-0 bg-dot-grid" />
				{/* orb */}
				<div className="orb absolute -right-16 -top-16 h-48 w-48 bg-white/10" />
				<div className="orb absolute -bottom-8 right-32 h-32 w-32 bg-white/5" />

				<div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium text-blue-100">Overview</p>
						<h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">My datasets</h1>
						<p className="mt-1 text-sm text-blue-200">
							{datasets.length === 0 ? 'Upload your first file to get started' : `${datasets.length} file${datasets.length !== 1 ? 's' : ''} · ready to explore`}
						</p>
					</div>

					{/* mini stats */}
					{datasets.length > 0 && (
						<div className="flex flex-wrap gap-3">
							{[
								{ icon: Database, label: 'Files',   value: datasets.length },
								{ icon: Rows3,    label: 'Rows',    value: totalRows.toLocaleString('en-US') },
								{ icon: HardDrive,label: 'Size',    value: formatBytes(totalSize) },
							].map(s => (
								<div key={s.label} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
									<s.icon size={15} className="text-blue-200" />
									<div>
										<p className="text-xs text-blue-200">{s.label}</p>
										<p className="text-sm font-semibold text-white">{s.value}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* ── Upload zone ── */}
			<UploadZone onUploaded={loadDatasets} />

			{/* ── Filters + list ── */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h2 className="text-sm font-semibold text-light-gray">
						Files
						<span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
							{filteredDatasets.length}
						</span>
						{totalCols > 0 && (
							<span className="ml-2 text-xs text-light-gray/60">· {totalCols} columns total</span>
						)}
					</h2>
					<div className="flex gap-2">
						<div className="w-36">
							<Dropdown options={sortOptions} value={sort} onChange={v => setSort(v as SortOption)} placeholder="Sort by" />
						</div>
						<div className="w-36">
							<Dropdown options={filesTypes} value={filter} onChange={v => setFilter(v as FileType | 'all')} placeholder="Filter" />
						</div>
					</div>
				</div>

				{loading ? (
					<DatasetListSkeleton />
				) : loadError ? (
					<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-error/30 bg-error/5 p-10 text-center text-sm text-error">
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
					<div className="rounded-2xl border border-dashed border-light-gray/20 p-12 text-center text-sm text-light-gray">
						{filter !== 'all' ? `No ${filter.toUpperCase()} files found.` : 'No datasets yet. Upload a file to get started.'}
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{filteredDatasets.map((d, i) => (
							<Link
								key={d.id}
								href={`/dashboard/${d.id}`}
								style={{ animationDelay: `${i * 40}ms` }}
								className="animate-fade-up group flex items-center gap-4 rounded-2xl border border-light-gray/15 bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/3 hover:shadow-md hover:-translate-y-px"
							>
								{/* icon */}
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8">
									<FileSpreadsheet size={20} className="text-primary" />
								</div>

								{/* name + meta */}
								<div className="flex min-w-0 flex-1 flex-col gap-0.5">
									<div className="flex items-center gap-2">
										<span className="truncate text-sm font-semibold text-title">{d.filename}</span>
										<span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold uppercase', FILE_TYPE_BADGE[d.fileType])}>
											{d.fileType}
										</span>
									</div>
									<span className="text-xs text-light-gray">{formatDate(d.createdAt)}</span>
								</div>

								{/* stats */}
								<div className="hidden shrink-0 items-center gap-5 sm:flex">
									<div className="text-right">
										<p className="text-sm font-semibold text-title">{d.rowCount.toLocaleString('en-US')}</p>
										<p className="text-xs text-light-gray">rows</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-title">{d.columnCount}</p>
										<p className="text-xs text-light-gray">cols</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-title">{formatBytes(d.sizeBytes)}</p>
										<p className="text-xs text-light-gray">size</p>
									</div>
									<Button size="xs" variant="danger" onClick={e => handleDeleteDataset(e, d.id, d.filename)}>
										Delete
									</Button>
								</div>

								<ChevronRight size={16} className="shrink-0 text-light-gray/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
