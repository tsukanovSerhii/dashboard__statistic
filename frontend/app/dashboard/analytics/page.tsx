'use client'

import { ChartCard } from '@/components/charts/ChartCard'
import { StatCard } from '@/components/charts/StatCard'
import { getAnalyticsSummary, getDatasets } from '@/lib/api/datasets'
import { formatBytes } from '@/lib/utils'
import type { AnalyticsSummary, Dataset } from '@/types'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ChartSkeleton = () => (
	<div className="h-70 animate-pulse rounded-xl bg-light-gray/10" />
)

const ColumnTypesBar = dynamic(
	() => import('@/components/charts/ColumnTypesBar').then(m => m.ColumnTypesBar),
	{ loading: ChartSkeleton }
)
const DatasetsByTypePie = dynamic(
	() => import('@/components/charts/DatasetsByTypePie').then(m => m.DatasetsByTypePie),
	{ loading: ChartSkeleton }
)
const RowsByDatasetBar = dynamic(
	() => import('@/components/charts/RowsByDatasetBar').then(m => m.RowsByDatasetBar),
	{ loading: ChartSkeleton }
)
const DataQualityCard = dynamic(
	() => import('@/components/charts/DataQualityCard').then(m => m.DataQualityCard),
	{ loading: ChartSkeleton }
)

export default function AnalyticsPage() {
	const [datasets, setDatasets] = useState<Dataset[]>([])
	const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Promise.all([getDatasets(), getAnalyticsSummary()])
			.then(([d, s]) => {
				setDatasets(d)
				setSummary(s)
			})
			.finally(() => setLoading(false))
	}, [])

	return (
		<div className="animate-fade-up flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">Analytics</h1>
				<p className="mt-1 text-sm text-light-gray">
					Overview across all your datasets
				</p>
			</div>

			{loading ? (
				<p className="text-sm text-light-gray">Loading…</p>
			) : !summary || summary.totals.datasetCount === 0 ? (
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
							value={summary.totals.datasetCount}
						/>
						<StatCard
							label="Total rows"
							value={summary.totals.totalRows.toLocaleString('en-US')}
						/>
						<StatCard
							label="Total columns"
							value={summary.totals.totalColumns}
						/>
						<StatCard
							label="Total size"
							value={formatBytes(Number(summary.totals.totalSize))}
						/>
					</div>

					{/* first row of charts */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<DatasetsByTypePie datasets={datasets} />
						<ColumnTypesBar data={summary.columnsByType} />
					</div>

					{/* second row */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<RowsByDatasetBar datasets={datasets} />
						</div>
						<DataQualityCard
							totalRows={summary.totals.totalRows}
							totalColumns={summary.totals.totalColumns}
							totalNulls={summary.quality.totalNulls}
						/>
					</div>
				</>
			)}
		</div>
	)
}
