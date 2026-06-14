'use client'

import { COLUMN_TYPE_BADGE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Column } from '@/types'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ColumnDetailPanel } from './ColumnDetailPanel'

type ColumnSchemaTableProps = {
	datasetId: string
	columns: Column[]
	rowCount: number
}

export const ColumnSchemaTable = ({ datasetId, columns, rowCount }: ColumnSchemaTableProps) => {
	const [selected, setSelected] = useState<Column | null>(null)

	if (columns.length === 0) return null

	return (
		<>
			<div>
				<h2 className="mb-3 text-sm font-medium text-light-gray">
					Columns · {columns.length}
					<span className="ml-2 text-xs text-light-gray/60">Click a row to inspect</span>
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
								<th className="w-8 px-2 py-3" />
							</tr>
						</thead>
						<tbody>
							{columns.map(col => {
								const fillRate = Math.round(((rowCount - col.nullCount) / rowCount) * 100)
								const isActive = selected?.name === col.name
								return (
									<tr
										key={col.name}
										onClick={() => setSelected(isActive ? null : col)}
										className={cn(
											'cursor-pointer border-t border-light-gray/20 transition-colors',
											isActive
												? 'bg-primary/5'
												: 'hover:bg-background'
										)}
									>
										<td className="px-4 py-3 font-medium text-gray">{col.name}</td>
										<td className="px-4 py-3">
											<span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', COLUMN_TYPE_BADGE[col.dataType])}>
												{col.dataType}
											</span>
										</td>
										<td className="px-4 py-3 text-light-gray">{col.nullCount}</td>
										<td className="px-4 py-3 text-light-gray">{col.uniqueCount.toLocaleString('en-US')}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<div className="h-1.5 w-24 overflow-hidden rounded-full bg-background">
													<div
														className={cn(
															'h-full rounded-full',
															fillRate >= 90 ? 'bg-secondary' : fillRate >= 60 ? 'bg-warning' : 'bg-error'
														)}
														style={{ width: `${fillRate}%` }}
													/>
												</div>
												<span className="text-xs text-light-gray">{fillRate}%</span>
											</div>
										</td>
										<td className="px-2 py-3">
											<ChevronRight
												size={14}
												className={cn(
													'text-light-gray/40 transition-transform',
													isActive && 'rotate-90 text-primary'
												)}
											/>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>

			{selected && (
				<ColumnDetailPanel
					datasetId={datasetId}
					column={selected}
					rowCount={rowCount}
					onClose={() => setSelected(null)}
				/>
			)}
		</>
	)
}
