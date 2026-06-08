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

const allowed = ['.csv', '.xlsx', '.json']

export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase()
		if (allowed.includes(ext)) {
			cb(null, true)
		} else {
			cb(new Error('Only CSV, XLSX or JSON files are allowed'))
		}
	}
})
