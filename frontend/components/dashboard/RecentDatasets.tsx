import { cn } from '@/lib/utils'
import { Dataset, FileType } from '@/types'
import { Clock, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import Link from 'next/link'

type RecentDatasetsProps = {
	recentIds: string[]
	datasets: Dataset[]
}

const fileIcon = (type: FileType) => {
	if (type === 'json') return FileJson
	if (type === 'xlsx') return FileSpreadsheet
	return FileText
}

const typeColor = (type: FileType) => {
	if (type === 'json') return 'text-warning bg-warning/10'
	if (type === 'xlsx') return 'text-secondary bg-secondary/10'
	return 'text-primary bg-primary/10'
}

export const RecentDatasets = ({ recentIds, datasets }: RecentDatasetsProps) => {
	const recent = recentIds
		.map(id => datasets.find(d => d.id === id))
		.filter(Boolean) as Dataset[]

	if (recent.length === 0) return null

	return (
		<div className="flex flex-col gap-3">
			<h2 className="flex items-center gap-2 text-sm font-semibold text-light-gray">
				<Clock size={14} />
				Recently opened
			</h2>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{recent.map(d => {
					const Icon = fileIcon(d.fileType)
					return (
						<Link
							key={d.id}
							href={`/dashboard/${d.id}`}
							className="flex items-center gap-3 rounded-xl border border-light-gray/15 bg-surface px-3 py-2.5 transition-all duration-200 hover:border-primary/30 hover:bg-primary/4 hover:shadow-sm"
						>
							<div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeColor(d.fileType))}>
								<Icon size={14} />
							</div>
							<div className="min-w-0">
								<p className="truncate text-xs font-semibold text-title">{d.filename}</p>
								<p className="text-xs text-light-gray">{d.rowCount.toLocaleString('en-US')} rows</p>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
