// UI display user (sidebar/topbar) — mock for now
export type User = {
	name: string
	imgSrc: string
}

// authenticated user returned by the backend
export type AuthUser = {
	id: string
	email: string
	createdAt?: string
}

export type FileType = 'csv' | 'xlsx' | 'json'

export type Column = {
	name: string
	dataType: 'number' | 'string' | 'date' | 'boolean'
	nullCount: number // number of missing values
	uniqueCount: number // number of unique values
}

export type Dataset = {
	id: string
	filename: string
	fileType: FileType
	sizeBytes: number
	rowCount: number
	columnCount: number
	createdAt: string // ISO date, e.g. '2026-06-01T10:00:00Z'
	columns?: Column[] // column details (for the [id] page)
}
