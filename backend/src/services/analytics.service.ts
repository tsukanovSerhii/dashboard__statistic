import type { Row } from './parser.service.js'

export type ColumnDataType = 'number' | 'string' | 'date' | 'boolean'

export type ColumnStat = {
	name: string
	dataType: ColumnDataType
	nullCount: number
	uniqueCount: number
}

// is a value considered "missing"?
const isNull = (v: unknown) => v === null || v === undefined || v === ''

// guess a column's type from its first non-null value
const detectType = (value: unknown): ColumnDataType => {
	if (typeof value === 'number') return 'number'
	if (typeof value === 'boolean') return 'boolean'
	if (typeof value === 'string') {
		// looks like a date?
		if (!Number.isNaN(Date.parse(value)) && /\d{4}|\d{1,2}[/.-]/.test(value)) {
			return 'date'
		}
	}
	return 'string'
}

// compute stats for every column in the parsed rows
export const analyzeRows = (rows: Row[]): ColumnStat[] => {
	if (rows.length === 0) return []

	// column names come from the keys of the first row
	const columnNames = Object.keys(rows[0])

	return columnNames.map(name => {
		const values = rows.map(r => r[name])

		const nullCount = values.filter(isNull).length
		const nonNull = values.filter(v => !isNull(v))
		const uniqueCount = new Set(nonNull).size

		// detect type from the first non-null value
		const dataType =
			nonNull.length > 0 ? detectType(nonNull[0]) : 'string'

		return { name, dataType, nullCount, uniqueCount }
	})
}
