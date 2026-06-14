import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core'

// users
export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
})

// datasets
export const datasets = pgTable('datasets', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	filename: text('filename').notNull(),
	fileType: text('file_type').notNull(),
	sizeBytes: integer('size_bytes').notNull(),
	rowCount: integer('row_count').notNull(),
	columnCount: integer('column_count').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
})

// column stats
export const columnStats = pgTable('column_stats', {
	id: uuid('id').defaultRandom().primaryKey(),
	datasetId: uuid('dataset_id')
		.notNull()
		.references(() => datasets.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	dataType: text('data_type').notNull(),
	nullCount: integer('null_count').notNull(),
	uniqueCount: integer('unique_count').notNull()
})

// refresh tokens — stored so we can revoke them on logout
export const refreshTokens = pgTable(
	'refresh_tokens',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		token: text('token').notNull().unique(),
		revoked: boolean('revoked').notNull().default(false),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	table => [index('refresh_tokens_user_id_idx').on(table.userId)]
)

// raw table rows (each row stored as JSON so columns can vary per file)
export const datasetRows = pgTable(
	'dataset_rows',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		datasetId: uuid('dataset_id')
			.notNull()
			.references(() => datasets.id, { onDelete: 'cascade' }),
		rowIndex: integer('row_index').notNull(),
		data: jsonb('data').notNull()
	},
	table => [index('dataset_rows_dataset_id_idx').on(table.datasetId)]
)
