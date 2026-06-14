'use client'

import { getDatasetById } from '@/lib/api/datasets'
import { useQuery } from '@tanstack/react-query'

export const datasetByIdKey = (id: string) => ['dataset', id] as const

export const useDatasetById = (id: string) =>
	useQuery({
		queryKey: datasetByIdKey(id),
		queryFn: () => getDatasetById(id),
		enabled: !!id,
	})
