import { formatBytes } from '@/lib/utils'
import { Dataset } from '@/types'
import { Database, HardDrive, Rows3 } from 'lucide-react'

type HeroBannerProps = {
	datasets: Dataset[]
}

export const HeroBanner = ({ datasets }: HeroBannerProps) => {
	const totalRows = datasets.reduce((s, d) => s + d.rowCount, 0)
	const totalSize = datasets.reduce((s, d) => s + d.sizeBytes, 0)

	return (
		<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 className="text-2xl font-bold text-title">My datasets</h1>
				<p className="mt-0.5 text-sm text-light-gray">
					{datasets.length === 0
						? 'Upload your first file to get started'
						: `${datasets.length} file${datasets.length !== 1 ? 's' : ''} · ready to explore`}
				</p>
			</div>

			{datasets.length > 0 && (
				<div className="flex items-center gap-4 rounded-xl border border-light-gray/15 bg-surface px-4 py-2.5">
					{[
						{ icon: Database,  label: 'Files', value: String(datasets.length) },
						{ icon: Rows3,     label: 'Rows',  value: totalRows.toLocaleString('en-US') },
						{ icon: HardDrive, label: 'Size',  value: formatBytes(totalSize) },
					].map((s, i) => (
						<div key={s.label} className={`flex items-center gap-2 ${i > 0 ? 'border-l border-light-gray/15 pl-4' : ''}`}>
							<s.icon size={14} className="text-light-gray" />
							<div>
								<p className="text-xs text-light-gray">{s.label}</p>
								<p className="text-sm font-semibold text-title">{s.value}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
