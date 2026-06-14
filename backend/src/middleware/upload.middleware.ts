import multer from 'multer'
import crypto from 'node:crypto'
import path from 'node:path'

const storage = multer.diskStorage({
	destination: 'uploads/',
	filename: (_req, file, cb) => {
		const unique = `${Date.now()}-${crypto.randomUUID()}`
		cb(null, `${unique}${path.extname(file.originalname)}`)
	}
})

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.json']

// Both extension and MIME type must match — prevents disguised file uploads
const ALLOWED_MIMES: Record<string, string> = {
	'.csv':  'text/csv',
	'.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'.json': 'application/json',
}

// Browsers may send generic MIME for CSV/JSON — accept these as fallbacks
const FALLBACK_MIMES = new Set([
	'text/plain',
	'application/octet-stream',
	'application/x-csv',
	'text/x-csv',
	'text/comma-separated-values',
])

export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase()

		if (!ALLOWED_EXTENSIONS.includes(ext)) {
			return cb(new Error('Only CSV, XLSX or JSON files are allowed'))
		}

		const expectedMime = ALLOWED_MIMES[ext]
		const actualMime = file.mimetype.split(';')[0].trim().toLowerCase()

		if (actualMime !== expectedMime && !FALLBACK_MIMES.has(actualMime)) {
			return cb(new Error(`File content does not match extension .${ext.slice(1)}`))
		}

		cb(null, true)
	}
})
