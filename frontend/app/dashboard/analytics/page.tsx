'use client'

import { ChartCard } from '@/components/charts/ChartCard'
import { DatasetsByTypePie } from '@/components/charts/DatasetsByTypePie'
import { RowsByDatasetBar } from '@/components/charts/RowsByDatasetBar'
import { StatCard } from '@/components/charts/StatCard'
import { getDatasets } from '@/lib/api/datasets'
import type { Dataset } from '@/types'
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
	const [datasets, setDatasets] = useState<Dataset[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getDatasets()
			.then(setDatasets)
			.finally(() => setLoading(false))
	}, [])

	// aggregate stats for the KPI cards
	const totalRows = datasets.reduce((sum, d) => sum + d.rowCount, 0)
	const totalColumns = datasets.reduce((sum, d) => sum + d.columnCount, 0)

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">Analytics</h1>
				<p className="mt-1 text-sm text-light-gray">
					Overview across all your datasets
				</p>
			</div>

			{loading ? (
				<p className="text-sm text-light-gray">Loading…</p>
			) : datasets.length === 0 ? (
				<ChartCard title="">
					<p className="py-8 text-center text-sm text-light-gray">
						No datasets yet. Upload a file to see analytics.
					</p>
				</ChartCard>
			) : (
				<>
					{/* KPI cards */}
					<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
						<StatCard
							label="Datasets"
							value={datasets.length}
						/>
						<StatCard
							label="Total rows"
							value={totalRows.toLocaleString('en-US')}
						/>
						<StatCard
							label="Total columns"
							value={totalColumns}
						/>
						<StatCard
							label="File types"
							value={new Set(datasets.map(d => d.fileType)).size}
						/>
					</div>

					{/* charts */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<DatasetsByTypePie datasets={datasets} />
						<RowsByDatasetBar datasets={datasets} />
					</div>
				</>
			)}
		</div>
	)
}
