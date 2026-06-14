'use client'

import { useDatasetRows } from '@/lib/hooks/useDatasetRows'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Input } from '../ui/Input'

const LIMIT = 25

const formatCell = (value: unknown): string => {
	if (value === null || value === undefined) return '—'
	if (typeof value === 'boolean') return value ? 'true' : 'false'
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}

export const DatasetTable = ({ datasetId }: { datasetId: string }) => {
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [page, setPage] = useState(1)

	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(search), 300)
		return () => clearTimeout(t)
	}, [search])

	const { data, isFetching } = useDatasetRows(datasetId, debouncedSearch, page, LIMIT)

	const rows = data?.rows ?? []
	const columnKeys = rows.length > 0 ? Object.keys(rows[0]) : []

	const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(
		() =>
			columnKeys.map(key => ({
				id: key,
				accessorKey: key,
				header: key,
				cell: info => (
					<span className="whitespace-nowrap">{formatCell(info.getValue())}</span>
				),
			})),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[columnKeys.join(',')]
	)

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		pageCount: data?.totalPages ?? 1,
	})

	const handleSearch = (value: string) => {
		setSearch(value)
		setPage(1)
	}

	const totalPages = data?.totalPages ?? 1

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="flex items-center gap-2 text-sm font-medium text-light-gray">
					Content
					{data && <span>· {data.total.toLocaleString('en-US')} rows</span>}
					{isFetching && <Loader2 size={13} className="animate-spin text-primary" />}
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

			<div className="overflow-x-auto rounded-xl border border-light-gray/20">
				<table className="w-full text-sm">
					<thead className="bg-background text-left text-light-gray">
						{table.getHeaderGroups().map(hg => (
							<tr key={hg.id}>
								{hg.headers.map(header => (
									<th key={header.id} className="whitespace-nowrap px-4 py-3 font-medium">
										{flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowCount() === 0 ? (
							<tr>
								<td
									colSpan={Math.max(columnKeys.length, 1)}
									className="px-4 py-8 text-center text-light-gray"
								>
									{isFetching ? 'Loading…' : 'No rows found'}
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map(row => (
								<tr key={row.id} className="border-t border-light-gray/20 hover:bg-background">
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} className="px-4 py-2.5 text-gray">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-light-gray">
						Page {page} of {totalPages}
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
							onClick={() => setPage(p => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages}
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
