import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { detectFileType, parseFile } from './parser.service.js'

// write a temp file and return its path
const tmpFiles: string[] = []
const writeTmp = (name: string, content: string) => {
	const p = path.join(os.tmpdir(), `test-${Date.now()}-${name}`)
	fs.writeFileSync(p, content)
	tmpFiles.push(p)
	return p
}

afterAll(() => {
	tmpFiles.forEach(p => fs.existsSync(p) && fs.unlinkSync(p))
})

describe('detectFileType', () => {
	it('detects csv, xlsx and json', () => {
		expect(detectFileType('data.csv')).toBe('csv')
		expect(detectFileType('data.xlsx')).toBe('xlsx')
		expect(detectFileType('data.json')).toBe('json')
	})

	it('is case-insensitive', () => {
		expect(detectFileType('DATA.CSV')).toBe('csv')
	})

	it('throws on unsupported types', () => {
		expect(() => detectFileType('data.txt')).toThrow('Unsupported file type')
	})
})

describe('parseFile - CSV', () => {
	it('parses rows with typed values', () => {
		const p = writeTmp('a.csv', 'name,age\nAlice,30\nBob,25\n')
		const rows = parseFile(p, 'csv')
		expect(rows).toHaveLength(2)
		expect(rows[0]).toEqual({ name: 'Alice', age: 30 })
	})

	it('returns no rows for a headers-only file', () => {
		const p = writeTmp('h.csv', 'name,age\n')
		expect(parseFile(p, 'csv')).toHaveLength(0)
	})
})

describe('parseFile - JSON', () => {
	it('parses an array of objects', () => {
		const p = writeTmp('a.json', '[{"x":1},{"x":2}]')
		expect(parseFile(p, 'json')).toHaveLength(2)
	})

	it('throws a friendly error on malformed JSON', () => {
		const p = writeTmp('bad.json', '{not valid')
		expect(() => parseFile(p, 'json')).toThrow('Invalid JSON file')
	})

	it('throws when JSON is not an array', () => {
		const p = writeTmp('obj.json', '{"x":1}')
		expect(() => parseFile(p, 'json')).toThrow(
			'JSON must be an array of objects'
		)
	})
})
