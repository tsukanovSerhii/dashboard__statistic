'use client'

import { getDatasetRows } from '@/lib/api/datasets'
import type { RowsResponse } from '@/types'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from './ui/Input'

const LIMIT = 25

export const DatasetTable = ({ datasetId }: { datasetId: string }) => {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [data, setData] = useState<RowsResponse | null>(null)
	const [loading, setLoading] = useState(true)

	// debounce search: wait 300ms after the user stops typing
	const [debouncedSearch, setDebouncedSearch] = useState('')
	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(search), 300)
		return () => clearTimeout(t)
	}, [search])

	// fetch rows whenever search or page changes
	useEffect(() => {
		let active = true

		const load = async () => {
			setLoading(true)
			try {
				const res = await getDatasetRows(datasetId, {
					search: debouncedSearch || undefined,
					page,
					limit: LIMIT
				})
				if (active) setData(res)
			} finally {
				if (active) setLoading(false)
			}
		}

		load()
		return () => {
			active = false
		}
	}, [datasetId, debouncedSearch, page])

	// when the search term changes, go back to the first page
	const handleSearch = (value: string) => {
		setSearch(value)
		setPage(1)
	}

	const rows = data?.rows ?? []
	// column names come from the keys of the first row
	const columns = rows.length > 0 ? Object.keys(rows[0]) : []

	return (
		<div className="flex flex-col gap-3">
			{/* header: title + search */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-sm font-medium text-light-gray">
					Content {data ? `· ${data.total} rows` : ''}
				</h2>
				<div className="w-64">
					<Input
						iconLeft={Search}
						placeholder="Search rows..."
						value={search}
						onChange={e => handleSearch(e.target.value)}
						wrapperClassName="border-light-gray/20"
					/>
				</div>
			</div>

			{/* table */}
			<div className="overflow-x-auto rounded-xl border border-light-gray/20">
				<table className="w-full text-sm">
					<thead className="bg-background text-left text-light-gray">
						<tr>
							{columns.map(col => (
								<th
									key={col}
									className="whitespace-nowrap px-4 py-3 font-medium"
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={Math.max(columns.length, 1)}
									className="px-4 py-8 text-center text-light-gray"
								>
									Loading…
								</td>
							</tr>
						) : rows.length === 0 ? (
							<tr>
								<td
									colSpan={Math.max(columns.length, 1)}
									className="px-4 py-8 text-center text-light-gray"
								>
									No rows found
								</td>
							</tr>
						) : (
							rows.map((row, i) => (
								<tr
									key={i}
									className="border-t border-light-gray/20 hover:bg-background"
								>
									{columns.map(col => (
										<td
											key={col}
											className="whitespace-nowrap px-4 py-2.5 text-gray"
										>
											{formatCell(row[col])}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* pagination */}
			{data && data.totalPages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-light-gray">
						Page {data.page} of {data.totalPages}
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page <= 1}
							className="flex items-center gap-1 rounded-lg border border-light-gray/20 px-3 py-1.5 text-gray transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft size={16} />
							Prev
						</button>
						<button
							type="button"
							onClick={() =>
								setPage(p => Math.min(data.totalPages, p + 1))
							}
							disabled={page >= data.totalPages}
							className="flex items-center gap-1 rounded-lg border border-light-gray/20 px-3 py-1.5 text-gray transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
						>
							Next
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

// render a cell value safely (handles null, boolean, objects)
const formatCell = (value: unknown): string => {
	if (value === null || value === undefined) return '—'
	if (typeof value === 'boolean') return value ? 'true' : 'false'
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}
