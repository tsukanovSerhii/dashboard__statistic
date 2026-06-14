import { COLUMN_TYPE_BADGE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Column } from '@/types'

type ColumnSchemaTableProps = {
	columns: Column[]
	rowCount: number
}

export const ColumnSchemaTable = ({ columns, rowCount }: ColumnSchemaTableProps) => {
	if (columns.length === 0) return null

	return (
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
							const fillRate = Math.round(
								((rowCount - col.nullCount) / rowCount) * 100
							)
							return (
								<tr key={col.name} className="border-t border-light-gray/20">
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
												<div className="h-full rounded-full bg-secondary" style={{ width: `${fillRate}%` }} />
											</div>
											<span className="text-xs text-light-gray">{fillRate}%</span>
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}
