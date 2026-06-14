'use client'

import { ColumnSchemaTable } from '@/components/dataset/ColumnSchemaTable'
import { DatasetDetailSkeleton } from '@/components/dataset/DatasetDetailSkeleton'
import { DatasetHeader } from '@/components/dataset/DatasetHeader'
import { DatasetTable } from '@/components/dataset/DatasetTable'
import { ErrorBoundary } from '@/components/providers/ErrorBoundary'
import { useDatasetById } from '@/lib/hooks/useDatasetById'
import { useParams } from 'next/navigation'

export default function DatasetPage() {
	const params = useParams()
	const id = params.id as string

	const { data: dataset, isLoading, isError } = useDatasetById(id)

	if (isLoading) return <DatasetDetailSkeleton />
	if (isError || !dataset)
		return <p className="text-sm text-light-gray">Dataset not found</p>

	return (
		<ErrorBoundary>
			<div className="animate-fade-up flex flex-col gap-6">
				<DatasetHeader dataset={dataset} />
				<ColumnSchemaTable
					datasetId={dataset.id}
					columns={dataset.columns ?? []}
					rowCount={dataset.rowCount}
				/>
				<DatasetTable datasetId={dataset.id} />
			</div>
		</ErrorBoundary>
	)
}
