import { z } from 'zod'

// validate env vars at startup so we fail fast if something is missing
const schema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(16),
	JWT_REFRESH_SECRET: z.string().min(16),
	PORT: z.coerce.number().default(4000),
	CORS_ORIGIN: z.string().default('http://localhost:3000'),
})

export const env = schema.parse(process.env)
