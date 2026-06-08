import type { Row } from './parser.service.js'

export type ColumnDataType = 'number' | 'string' | 'date' | 'boolean'

export type ColumnStat = {
	name: string
	dataType: ColumnDataType
	nullCount: number
	uniqueCount: number
}

const isNull = (v: unknown) => v === null || v === undefined || v === ''

const detectType = (value: unknown): ColumnDataType => {
	if (typeof value === 'number') return 'number'
	if (typeof value === 'boolean') return 'boolean'
	if (typeof value === 'string') {
		if (!Number.isNaN(Date.parse(value)) && /\d{4}|\d{1,2}[/.-]/.test(value)) {
			return 'date'
		}
	}
	return 'string'
}

export const analyzeRows = (rows: Row[]): ColumnStat[] => {
	if (rows.length === 0) return []

	const columnNames = Object.keys(rows[0])

	return columnNames.map(name => {
		const values = rows.map(r => r[name])

		const nullCount = values.filter(isNull).length
		const nonNull = values.filter(v => !isNull(v))
		const uniqueCount = new Set(nonNull).size

		const dataType = nonNull.length > 0 ? detectType(nonNull[0]) : 'string'

		return { name, dataType, nullCount, uniqueCount }
	})
}
