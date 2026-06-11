import type { Column, FileType } from '@/types'

type DataType = Column['dataType']

// Tailwind badge classes (bg + text) for UI badges
export const FILE_TYPE_BADGE: Record<FileType, string> = {
	csv: 'bg-secondary/15 text-secondary',
	xlsx: 'bg-primary/15 text-primary',
	json: 'bg-warning/15 text-warning'
}

export const COLUMN_TYPE_BADGE: Record<DataType, string> = {
	number: 'bg-primary/15 text-primary',
	string: 'bg-secondary/15 text-secondary',
	date: 'bg-warning/15 text-warning',
	boolean: 'bg-light-gray/20 text-light-gray'
}

// CSS variable colors for charts (work with dark mode)
export const FILE_TYPE_COLOR: Record<FileType, string> = {
	csv: 'var(--color-secondary)',
	xlsx: 'var(--color-primary)',
	json: 'var(--color-warning)'
}

export const COLUMN_TYPE_COLOR: Record<DataType, string> = {
	number: 'var(--color-primary)',
	string: 'var(--color-secondary)',
	date: 'var(--color-warning)',
	boolean: 'var(--color-light-gray)'
}
