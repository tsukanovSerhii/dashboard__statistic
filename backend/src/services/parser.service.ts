import fs from 'node:fs'
import Papa from 'papaparse'
import pkg from 'xlsx'

// xlsx is a CommonJS package — destructure from the default export for ESM
const { readFile, utils } = pkg

// a parsed row is just a map of column name -> value
export type Row = Record<string, unknown>

export type FileType = 'csv' | 'xlsx' | 'json'

// pick the file type from the original filename extension
export const detectFileType = (filename: string): FileType => {
	const ext = filename.toLowerCase().split('.').pop()
	if (ext === 'csv') return 'csv'
	if (ext === 'xlsx') return 'xlsx'
	if (ext === 'json') return 'json'
	throw new Error('Unsupported file type')
}

const parseCsv = (filePath: string): Row[] => {
	const content = fs.readFileSync(filePath, 'utf-8')
	const result = Papa.parse<Row>(content, {
		header: true, // first row = column names
		skipEmptyLines: true,
		dynamicTyping: true // auto-convert numbers/booleans
	})
	return result.data
}

const parseXlsx = (filePath: string): Row[] => {
	const workbook = readFile(filePath)
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
	return utils.sheet_to_json<Row>(firstSheet)
}

const parseJson = (filePath: string): Row[] => {
	const content = fs.readFileSync(filePath, 'utf-8')
	const data = JSON.parse(content)
	// expect an array of objects
	if (!Array.isArray(data)) {
		throw new Error('JSON must be an array of objects')
	}
	return data
}

// parse any supported file into rows
export const parseFile = (filePath: string, fileType: FileType): Row[] => {
	if (fileType === 'csv') return parseCsv(filePath)
	if (fileType === 'xlsx') return parseXlsx(filePath)
	return parseJson(filePath)
}
