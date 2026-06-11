'use client'

import { DatasetTable } from '@/components/DatasetTable'
import { getDatasetById } from '@/lib/api/datasets'
import { cn, formatBytes } from '@/lib/utils'
import type { Column, Dataset } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const columnTypeBadge: Record<Column['dataType'], string> = {
	number: 'bg-primary/15 text-primary',
	string: 'bg-secondary/15 text-secondary',
	date: 'bg-warning/15 text-warning',
	boolean: 'bg-light-gray/20 text-light-gray'
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
	<div className="flex flex-col gap-1 rounded-xl border border-light-gray/20 bg-surface p-4">
		<span className="text-xs text-light-gray">{label}</span>
		<span className="text-xl font-semibold text-gray">{value}</span>
	</div>
)

export default function DatasetPage() {
	const params = useParams()
	const id = params.id as string

	const [dataset, setDataset] = useState<Dataset | null>(null)
	const [loading, setLoading] = useState(true)
	const [notFound, setNotFound] = useState(false)

	useEffect(() => {
		getDatasetById(id)
			.then(setDataset)
			.catch(() => setNotFound(true))
			.finally(() => setLoading(false))
	}, [id])

	if (loading) return <p>Loading…</p>
	if (notFound || !dataset) return <p>Dataset not found</p>

	const columns = dataset.columns ?? []
	const totalNulls = columns.reduce((sum, c) => sum + c.nullCount, 0)

	return (
		<div className="flex flex-col gap-6">
			<Link
				href="/dashboard"
				className="flex w-fit items-center gap-1 text-sm text-light-gray hover:text-gray"
			>
				<ArrowLeft size={16} />
				Back to list
			</Link>

			{/* header */}
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold">{dataset.filename}</h1>
				<span className="rounded px-1.5 py-0.5 text-xs font-medium uppercase bg-primary/15 text-primary">
					{dataset.fileType}
				</span>
			</div>

			{/* stat cards */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatCard
					label="Rows"
					value={dataset.rowCount.toLocaleString('en-US')}
				/>
				<StatCard
					label="Columns"
					value={String(dataset.columnCount)}
				/>
				<StatCard
					label="Size"
					value={formatBytes(dataset.sizeBytes)}
				/>
				<StatCard
					label="Total nulls"
					value={totalNulls.toLocaleString('en-US')}
				/>
			</div>

			{/* columns table */}
			<div>
				<h2 className="mb-3 text-sm font-medium text-light-gray">
					Columns · {columns.length}
				</h2>
				<div className="overflow-hidden rounded-xl border border-light-gray/20">
					<table className="w-full text-sm">
						<thead className="bg-background text-left text-light-gray">
							<tr>
								<th className="px-4 py-3 font-medium">Column</th>
								<th className="px-4 py-3 font-medium">Type</th>
								<th className="px-4 py-3 font-medium">Nulls</th>
								<th className="px-4 py-3 font-medium">Unique</th>
								<th className="px-4 py-3 font-medium">Fill rate</th>
							</tr>
						</thead>
						<tbody>
							{columns.map(col => {
								// percentage of non-null values in this column
								const fillRate = Math.round(
									((dataset.rowCount - col.nullCount) / dataset.rowCount) * 100
								)
								return (
									<tr
										key={col.name}
										className="border-t border-light-gray/20"
									>
										<td className="px-4 py-3 font-medium text-gray">
											{col.name}
										</td>
										<td className="px-4 py-3">
											<span
												className={cn(
													'rounded px-1.5 py-0.5 text-xs font-medium',
													columnTypeBadge[col.dataType]
												)}
											>
												{col.dataType}
											</span>
										</td>
										<td className="px-4 py-3 text-light-gray">
											{col.nullCount}
										</td>
										<td className="px-4 py-3 text-light-gray">
											{col.uniqueCount.toLocaleString('en-US')}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<div className="h-1.5 w-24 overflow-hidden rounded-full bg-background">
													<div
														className="h-full rounded-full bg-secondary"
														style={{ width: `${fillRate}%` }}
													/>
												</div>
												<span className="text-xs text-light-gray">
													{fillRate}%
												</span>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* table content with search + pagination */}
			<DatasetTable datasetId={dataset.id} />
		</div>
	)
}
