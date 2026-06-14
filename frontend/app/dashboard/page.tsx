'use client'

import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DatasetGrid } from '@/components/dashboard/DatasetGrid'
import { HeroBanner } from '@/components/dashboard/HeroBanner'
import { RecentDatasets } from '@/components/dashboard/RecentDatasets'
import { DatasetListSkeleton } from '@/components/dataset/DatasetListSkeleton'
import { UploadZone } from '@/components/dataset/UploadZone'
import { useDatasets, useDeleteDataset } from '@/lib/hooks/useDatasets'
import { FileType } from '@/types'
import axios from 'axios'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

type SortOption = 'newest' | 'oldest' | 'name' | 'size' | 'rows'

const RECENT_KEY = 'datalens:recent'
const MAX_RECENT = 4

function getRecentIds(): string[] {
	try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}
function pushRecentId(id: string) {
	const ids = [id, ...getRecentIds().filter(r => r !== id)].slice(0, MAX_RECENT)
	localStorage.setItem(RECENT_KEY, JSON.stringify(ids))
}

export default function DashboardPage() {
	const [filter, setFilter] = useState<FileType | 'all'>('all')
	const [sort, setSort] = useState<SortOption>('newest')
	const [search, setSearch] = useState('')
	const [recentIds, setRecentIds] = useState<string[]>(() => getRecentIds())

	const { data: datasets = [], isLoading, isError, refetch } = useDatasets()
	const deleteMutation = useDeleteDataset()

	const handleDelete = async (e: React.MouseEvent, id: string, filename: string) => {
		e.preventDefault()
		e.stopPropagation()
		if (!confirm(`Delete "${filename}"?`)) return
		try {
			await deleteMutation.mutateAsync(id)
			toast.success(`"${filename}" deleted`)
		} catch (err) {
			const message = axios.isAxiosError(err)
				? (err.response?.data?.error ?? 'Failed to delete dataset')
				: 'Failed to delete dataset'
			toast.error(message)
		}
	}

	const handleOpen = (id: string) => {
		pushRecentId(id)
		setRecentIds(getRecentIds())
	}

	const totalCols = datasets.reduce((s, d) => s + d.columnCount, 0)

	const filteredDatasets = useMemo(() => {
		let list = filter === 'all' ? datasets : datasets.filter(d => d.fileType === filter)
		if (search.trim()) {
			const q = search.trim().toLowerCase()
			list = list.filter(d => d.filename.toLowerCase().includes(q))
		}
		return [...list].sort((a, b) => {
			switch (sort) {
				case 'oldest': return a.createdAt.localeCompare(b.createdAt)
				case 'name':   return a.filename.localeCompare(b.filename)
				case 'size':   return b.sizeBytes - a.sizeBytes
				case 'rows':   return b.rowCount - a.rowCount
				default:       return b.createdAt.localeCompare(a.createdAt)
			}
		})
	}, [datasets, filter, sort, search])

	return (
		<div className="animate-fade-up flex flex-col gap-6">
			<HeroBanner datasets={datasets} />

			<UploadZone
				onUploaded={() => refetch()}
				existingNames={datasets.map(d => d.filename)}
			/>

			<RecentDatasets recentIds={recentIds} datasets={datasets} />

			<div className="flex flex-col gap-4">
				<DashboardFilters
					count={filteredDatasets.length}
					totalCols={totalCols}
					search={search}
					onSearch={setSearch}
					sort={sort}
					onSort={setSort}
					filter={filter}
					onFilter={setFilter}
				/>

				{isLoading ? (
					<DatasetListSkeleton />
				) : isError ? (
					<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-error/30 bg-error/5 p-10 text-center text-sm text-error">
						Could not load datasets. Is the server running?
						<button
							type="button"
							onClick={() => refetch()}
							className="cursor-pointer rounded-lg border border-error/40 px-3 py-1.5 text-error transition-colors hover:bg-error/10"
						>
							Retry
						</button>
					</div>
				) : (
					<DatasetGrid
						datasets={filteredDatasets}
						onDelete={handleDelete}
						onOpen={handleOpen}
						search={search}
						filter={filter}
					/>
				)}
			</div>
		</div>
	)
}
