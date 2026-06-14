'use client'

import { deleteDataset, getDatasets, uploadDataset } from '@/lib/api/datasets'
import { Dataset } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const DATASETS_KEY = ['datasets'] as const

export const useDatasets = () =>
	useQuery({
		queryKey: DATASETS_KEY,
		queryFn: () => getDatasets(true),
	})

export const useUploadDataset = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (file: File) => uploadDataset(file),
		onSuccess: () => qc.invalidateQueries({ queryKey: DATASETS_KEY }),
	})
}

export const useDeleteDataset = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteDataset(id),
		onMutate: async (id) => {
			await qc.cancelQueries({ queryKey: DATASETS_KEY })
			const prev = qc.getQueryData<Dataset[]>(DATASETS_KEY)
			qc.setQueryData<Dataset[]>(DATASETS_KEY, old => old?.filter(d => d.id !== id) ?? [])
			return { prev }
		},
		onError: (_err, _id, ctx) => {
			if (ctx?.prev) qc.setQueryData(DATASETS_KEY, ctx.prev)
		},
		onSettled: () => qc.invalidateQueries({ queryKey: DATASETS_KEY }),
	})
}
