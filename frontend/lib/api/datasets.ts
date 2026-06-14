import type { AnalyticsSummary, Dataset, RowsResponse } from '@/types'
import { api } from './client'

const TTL = 30_000 // 30 s

type CacheEntry<T> = { data: T; at: number }
const cache: { datasets?: CacheEntry<Dataset[]>; summary?: CacheEntry<AnalyticsSummary> } = {}

const fresh = <T>(entry?: CacheEntry<T>) =>
	!!entry && Date.now() - entry.at < TTL

export const getDatasets = async (bust = false): Promise<Dataset[]> => {
	if (!bust && fresh(cache.datasets)) return cache.datasets!.data
	const { data } = await api.get<{ datasets: Dataset[] }>('/datasets')
	cache.datasets = { data: data.datasets, at: Date.now() }
	return data.datasets
}

export const getAnalyticsSummary = async (bust = false): Promise<AnalyticsSummary> => {
	if (!bust && fresh(cache.summary)) return cache.summary!.data
	const { data } = await api.get<AnalyticsSummary>('/datasets/stats/summary')
	cache.summary = { data, at: Date.now() }
	return data
}

export const invalidateCache = () => {
	delete cache.datasets
	delete cache.summary
}

export const getDatasetRows = async (
	id: string,
	params: { search?: string; page?: number; limit?: number }
) => {
	const { data } = await api.get<RowsResponse>(`/datasets/${id}/rows`, {
		params
	})
	return data
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
