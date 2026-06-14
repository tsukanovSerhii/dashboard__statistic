'use client'

import { getColumnDistribution } from '@/lib/api/datasets'
import { useQuery } from '@tanstack/react-query'

export const useColumnDistribution = (datasetId: string, columnName: string | null) =>
	useQuery({
		queryKey: ['column-distribution', datasetId, columnName],
		queryFn: () => getColumnDistribution(datasetId, columnName!),
		enabled: !!columnName,
		staleTime: 60_000,
	})
