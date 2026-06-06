import type { Dataset } from '@/types'

export const datasets: Dataset[] = [
	{
		id: '1',
		filename: 'sales_2025.csv',
		fileType: 'csv',
		sizeBytes: 184320,
		rowCount: 1240,
		columnCount: 3,
		createdAt: '2026-06-01T10:00:00Z',
		columns: [
			{ name: 'order_id', type: 'string', nullCount: 0, uniqueCount: 1240 },
			{ name: 'amount', type: 'number', nullCount: 12, uniqueCount: 880 },
			{ name: 'region', type: 'string', nullCount: 0, uniqueCount: 4 }
		]
	},
	{
		id: '2',
		filename: 'users_export.xlsx',
		fileType: 'xlsx',
		sizeBytes: 92160,
		rowCount: 540,
		columnCount: 5,
		createdAt: '2026-05-28T14:30:00Z',
		columns: [
			{ name: 'user_id', type: 'string', nullCount: 0, uniqueCount: 540 },
			{ name: 'email', type: 'string', nullCount: 3, uniqueCount: 537 },
			{ name: 'age', type: 'number', nullCount: 21, uniqueCount: 54 },
			{ name: 'is_active', type: 'boolean', nullCount: 0, uniqueCount: 2 },
			{ name: 'signup_date', type: 'date', nullCount: 5, uniqueCount: 410 }
		]
	},
	{
		id: '3',
		filename: 'events.json',
		fileType: 'json',
		sizeBytes: 512000,
		rowCount: 8900,
		columnCount: 3,
		createdAt: '2026-05-20T08:15:00Z',
		columns: [
			{ name: 'event', type: 'string', nullCount: 0, uniqueCount: 18 },
			{ name: 'value', type: 'number', nullCount: 140, uniqueCount: 2300 },
			{ name: 'timestamp', type: 'date', nullCount: 0, uniqueCount: 8900 }
		]
	},
	{
		id: '4',
		filename: 'products.csv',
		fileType: 'csv',
		sizeBytes: 256000,
		rowCount: 320,
		columnCount: 4,
		createdAt: '2026-05-15T16:45:00Z',
		columns: [
			{ name: 'sku', type: 'string', nullCount: 0, uniqueCount: 320 },
			{ name: 'price', type: 'number', nullCount: 0, uniqueCount: 215 },
			{ name: 'in_stock', type: 'boolean', nullCount: 0, uniqueCount: 2 },
			{ name: 'category', type: 'string', nullCount: 8, uniqueCount: 12 }
		]
	}
]

// find a dataset by id (for the details page)
export const getDataset = (id: string) => datasets.find(d => d.id === id)

// 184320 → "180 KB"
export const formatBytes = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// '2026-06-01T10:00:00Z' → "Jun 1, 2026"
export const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})
