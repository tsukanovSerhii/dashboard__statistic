'use client'

import { getAnalyticsSummary } from '@/lib/api/datasets'
import { useQuery } from '@tanstack/react-query'

export const ANALYTICS_KEY = ['analytics-summary'] as const

export const useAnalytics = () =>
	useQuery({
		queryKey: ANALYTICS_KEY,
		queryFn: () => getAnalyticsSummary(true),
	})
