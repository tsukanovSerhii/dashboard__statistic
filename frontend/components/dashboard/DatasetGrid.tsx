import { FloatingShapes } from '@/components/decorative/FloatingShapes'
import { Button } from '@/components/ui/Button'
import { FILE_TYPE_BADGE } from '@/lib/constants'
import { cn, formatBytes, formatDate } from '@/lib/utils'
import { Dataset, FileType } from '@/types'
import { ChevronRight, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import Link from 'next/link'

type DatasetGridProps = {
	datasets: Dataset[]
	onDelete: (e: React.MouseEvent, id: string, filename: string) => void
	onOpen: (id: string) => void
	search: string
	filter: FileType | 'all'
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

export const DatasetGrid = ({ datasets, onDelete, onOpen, search, filter }: DatasetGridProps) => {
	if (datasets.length === 0) {
		return (
			<div className="relative overflow-hidden rounded-2xl border border-dashed border-light-gray/20 p-14 text-center">
				<FloatingShapes className="absolute inset-0 h-full w-full text-light-gray" />
				<p className="relative z-10 text-sm text-light-gray">
					{search
						? `No files matching "${search}"`
						: filter !== 'all'
							? `No ${filter.toUpperCase()} files found.`
							: 'No datasets yet. Upload a file to get started.'}
				</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{datasets.map((d, i) => {
				const Icon = fileIcon(d.fileType)
				return (
					<Link
						key={d.id}
						href={`/dashboard/${d.id}`}
						onClick={() => onOpen(d.id)}
						style={{ animationDelay: `${i * 40}ms` }}
						className="animate-fade-up group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-light-gray/15 bg-surface p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
					>
						<FloatingShapes className="absolute -right-4 -top-4 h-28 w-28 text-primary opacity-30" />

						<div className="relative z-10 flex items-start justify-between">
							<div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', typeColor(d.fileType))}>
								<Icon size={20} />
							</div>
							<span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold uppercase', FILE_TYPE_BADGE[d.fileType])}>
								{d.fileType}
							</span>
						</div>

						<div className="relative z-10 flex flex-col gap-0.5">
							<p className="truncate text-sm font-semibold text-title leading-snug">{d.filename}</p>
							<p className="text-xs text-light-gray">{formatDate(d.createdAt)}</p>
						</div>

						<div className="relative z-10 grid grid-cols-3 gap-2 rounded-xl bg-background px-3 py-2.5">
							<div className="text-center">
								<p className="text-sm font-bold text-title">{d.rowCount.toLocaleString('en-US')}</p>
								<p className="text-xs text-light-gray">rows</p>
							</div>
							<div className="text-center">
								<p className="text-sm font-bold text-title">{d.columnCount}</p>
								<p className="text-xs text-light-gray">cols</p>
							</div>
							<div className="text-center">
								<p className="text-sm font-bold text-title">{formatBytes(d.sizeBytes)}</p>
								<p className="text-xs text-light-gray">size</p>
							</div>
						</div>

						<div className="relative z-10 flex items-center justify-between">
							<span className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
								Open dataset <ChevronRight size={12} />
							</span>
							<Button size="xs" variant="danger" onClick={e => onDelete(e, d.id, d.filename)}>
								Delete
							</Button>
						</div>
					</Link>
				)
			})}
		</div>
	)
}
