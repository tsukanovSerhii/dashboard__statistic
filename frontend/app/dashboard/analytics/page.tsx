'use client'

import { ChartCard } from '@/components/charts/ChartCard'
import { StatCard } from '@/components/charts/StatCard'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { useDatasets } from '@/lib/hooks/useDatasets'
import { formatBytes } from '@/lib/utils'
import { Database, FileStack, Rows3, Weight } from 'lucide-react'
import dynamic from 'next/dynamic'

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
	const { data: datasets = [], isLoading: datasetsLoading } = useDatasets()
	const { data: summary, isLoading: summaryLoading } = useAnalytics()

	const loading = datasetsLoading || summaryLoading

	return (
		<div className="animate-fade-up flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold">Analytics</h1>
				<p className="mt-1 text-sm text-light-gray">Overview across all your datasets</p>
			</div>

			{loading ? (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-24 animate-pulse rounded-2xl bg-light-gray/10" />
					))}
				</div>
			) : !summary || summary.totals.datasetCount === 0 ? (
				<ChartCard title="No data yet">
					<p className="py-8 text-center text-sm text-light-gray">
						Upload a file on the Dashboard to see analytics.
					</p>
				</ChartCard>
			) : (
				<>
					<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
						<StatCard label="Datasets"      value={summary.totals.datasetCount}                            icon={Database}  accent="primary"   />
						<StatCard label="Total rows"    value={summary.totals.totalRows.toLocaleString('en-US')}       icon={Rows3}     accent="secondary" />
						<StatCard label="Total columns" value={summary.totals.totalColumns}                            icon={FileStack} accent="warning"   />
						<StatCard label="Total size"    value={formatBytes(Number(summary.totals.totalSize))}          icon={Weight}    accent="error"     />
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<ChartCard title="Files by type" subtitle="Distribution across formats">
							<DatasetsByTypePie datasets={datasets} />
						</ChartCard>
						<div className="lg:col-span-2">
							<ChartCard title="Column types" subtitle="How many columns per data type">
								<ColumnTypesBar data={summary.columnsByType} />
							</ChartCard>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<ChartCard title="Rows per dataset" subtitle="Compare dataset sizes">
								<RowsByDatasetBar datasets={datasets} />
							</ChartCard>
						</div>
						<ChartCard title="Data quality" subtitle="Fill rate across all columns">
							<DataQualityCard
								totalRows={summary.totals.totalRows}
								totalColumns={summary.totals.totalColumns}
								totalNulls={summary.quality.totalNulls}
							/>
						</ChartCard>
					</div>
				</>
			)}
		</div>
	)
}
