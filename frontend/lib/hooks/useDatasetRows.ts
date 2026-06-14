'use client'

import { getDatasetRows } from '@/lib/api/datasets'
import { useQuery } from '@tanstack/react-query'

export const datasetRowsKey = (id: string, search: string, page: number, limit: number) =>
	['dataset-rows', id, search, page, limit] as const

export const useDatasetRows = (
	datasetId: string,
	search: string,
	page: number,
	limit = 25
) =>
	useQuery({
		queryKey: datasetRowsKey(datasetId, search, page, limit),
		queryFn: () => getDatasetRows(datasetId, { search: search || undefined, page, limit }),
		placeholderData: prev => prev,
	})
