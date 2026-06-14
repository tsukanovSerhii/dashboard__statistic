import { formatBytes } from '@/lib/utils'
import { Dataset } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type DatasetHeaderProps = {
	dataset: Dataset
}

export const DatasetHeader = ({ dataset }: DatasetHeaderProps) => {
	const totalNulls = (dataset.columns ?? []).reduce((s, c) => s + c.nullCount, 0)

	return (
		<>
			<Link
				href="/dashboard"
				className="flex w-fit items-center gap-1 text-sm text-light-gray hover:text-gray"
			>
				<ArrowLeft size={16} />
				Back to list
			</Link>

			<div className="flex flex-wrap items-center gap-3">
				<h1 className="text-2xl font-semibold">{dataset.filename}</h1>
				<span className="rounded px-1.5 py-0.5 text-xs font-medium uppercase bg-primary/15 text-primary">
					{dataset.fileType}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{[
					{ label: 'Rows',        value: dataset.rowCount.toLocaleString('en-US') },
					{ label: 'Columns',     value: String(dataset.columnCount) },
					{ label: 'Size',        value: formatBytes(dataset.sizeBytes) },
					{ label: 'Total nulls', value: totalNulls.toLocaleString('en-US') },
				].map(s => (
					<div key={s.label} className="rounded-2xl border border-light-gray/20 bg-surface p-4">
						<p className="text-xs font-medium uppercase tracking-wider text-light-gray">{s.label}</p>
						<p className="mt-1 text-2xl font-bold text-title">{s.value}</p>
					</div>
				))}
			</div>
		</>
	)
}
