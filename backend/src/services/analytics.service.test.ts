import { describe, expect, it } from 'vitest'
import { analyzeRows } from './analytics.service.js'

describe('analyzeRows', () => {
	it('returns an empty array for no rows', () => {
		expect(analyzeRows([])).toEqual([])
	})

	it('detects column names from the first row', () => {
		const stats = analyzeRows([{ name: 'Alice', age: 30 }])
		expect(stats.map(s => s.name)).toEqual(['name', 'age'])
	})

	it('detects data types', () => {
		const stats = analyzeRows([
			{ amount: 100, label: 'x', active: true, when: '2025-01-15' }
		])
		const byName = Object.fromEntries(stats.map(s => [s.name, s.dataType]))
		expect(byName.amount).toBe('number')
		expect(byName.label).toBe('string')
		expect(byName.active).toBe('boolean')
		expect(byName.when).toBe('date')
	})

	it('counts null / empty values', () => {
		const stats = analyzeRows([
			{ price: 10 },
			{ price: null },
			{ price: '' },
			{ price: 20 }
		])
		expect(stats[0].nullCount).toBe(2)
	})

	it('counts unique non-null values', () => {
		const stats = analyzeRows([
			{ region: 'EU' },
			{ region: 'EU' },
			{ region: 'US' },
			{ region: null }
		])
		expect(stats[0].uniqueCount).toBe(2) // EU, US (null excluded)
	})

	it('falls back to string type when a column is all null', () => {
		const stats = analyzeRows([{ note: null }, { note: '' }])
		expect(stats[0].dataType).toBe('string')
		expect(stats[0].nullCount).toBe(2)
	})
})
