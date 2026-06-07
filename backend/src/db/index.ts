import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { env } from '../config/env.js'
import * as schema from './schema.js'

const pool = new pg.Pool({ connectionString: env.DATABASE_URL })

// single db instance used across the app
export const db = drizzle(pool, { schema })
