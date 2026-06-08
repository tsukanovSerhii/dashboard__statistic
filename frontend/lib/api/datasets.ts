import type { Dataset } from '@/types'
import { api } from './client'

export const getDatasets = async (): Promise<Dataset[]> => {
	const { data } = await api.get<{ datasets: Dataset[] }>('/datasets')
	return data.datasets
}

export const getDatasetById = async (id: string): Promise<Dataset> => {
	const { data } = await api.get<{ dataset: Dataset }>(`/datasets/${id}`)
	return data.dataset
}

export const uploadDataset = async (file: File): Promise<Dataset> => {
	const formData = new FormData()
	formData.append('file', file)

	const { data } = await api.post<{ dataset: Dataset }>(
		'/datasets/upload',
		formData
	)
	return data.dataset
}

export const deleteDataset = async (id: string): Promise<void> => {
	await api.delete(`/datasets/${id}`)
}
