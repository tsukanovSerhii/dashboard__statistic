// OpenAPI 3.0 specification for the Analytics API.
// Served as interactive docs via swagger-ui-express at /api/docs.

export const openapiSpec = {
	openapi: '3.0.3',
	info: {
		title: 'Analytics API',
		version: '1.0.0',
		description:
			'API for uploading tabular files (CSV, XLSX, JSON), analyzing their columns, and browsing their content. Authentication is required for all dataset routes.'
	},
	servers: [{ url: 'http://localhost:4000/api', description: 'Local server' }],
	tags: [
		{ name: 'Auth', description: 'Registration, login and account settings' },
		{ name: 'Datasets', description: 'Upload, list, inspect and delete datasets' }
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		},
		schemas: {
			Error: {
				type: 'object',
				properties: { error: { type: 'string', example: 'Something went wrong' } }
			},
			AuthUser: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					email: { type: 'string', format: 'email' },
					createdAt: { type: 'string', format: 'date-time' }
				}
			},
			AuthResponse: {
				type: 'object',
				properties: {
					token: { type: 'string', description: 'JWT, valid for 7 days' },
					user: { $ref: '#/components/schemas/AuthUser' }
				}
			},
			Column: {
				type: 'object',
				properties: {
					name: { type: 'string', example: 'amount' },
					dataType: {
						type: 'string',
						enum: ['number', 'string', 'date', 'boolean']
					},
					nullCount: { type: 'integer', example: 2 },
					uniqueCount: { type: 'integer', example: 880 }
				}
			},
			Dataset: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					userId: { type: 'string', format: 'uuid' },
					filename: { type: 'string', example: 'sales.csv' },
					fileType: { type: 'string', enum: ['csv', 'xlsx', 'json'] },
					sizeBytes: { type: 'integer', example: 18432 },
					rowCount: { type: 'integer', example: 1240 },
					columnCount: { type: 'integer', example: 7 },
					createdAt: { type: 'string', format: 'date-time' }
				}
			},
			DatasetWithColumns: {
				allOf: [
					{ $ref: '#/components/schemas/Dataset' },
					{
						type: 'object',
						properties: {
							columns: {
								type: 'array',
								items: { $ref: '#/components/schemas/Column' }
							}
						}
					}
				]
			},
			RowsResponse: {
				type: 'object',
				properties: {
					rows: {
						type: 'array',
						items: { type: 'object', additionalProperties: true }
					},
					total: { type: 'integer', example: 500 },
					page: { type: 'integer', example: 1 },
					limit: { type: 'integer', example: 25 },
					totalPages: { type: 'integer', example: 20 }
				}
			},
			AnalyticsSummary: {
				type: 'object',
				properties: {
					totals: {
						type: 'object',
						properties: {
							datasetCount: { type: 'integer' },
							totalRows: { type: 'integer' },
							totalColumns: { type: 'integer' },
							totalSize: { type: 'string', description: 'bytes (bigint)' }
						}
					},
					byType: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								fileType: { type: 'string' },
								count: { type: 'integer' }
							}
						}
					},
					columnsByType: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								dataType: { type: 'string' },
								count: { type: 'integer' }
							}
						}
					},
					quality: {
						type: 'object',
						properties: {
							totalNulls: { type: 'integer' },
							totalColumnsCounted: { type: 'integer' }
						}
					}
				}
			}
		}
	},
	paths: {
		'/auth/register': {
			post: {
				tags: ['Auth'],
				summary: 'Register a new user',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['email', 'password'],
								properties: {
									email: { type: 'string', format: 'email' },
									password: { type: 'string', minLength: 6 }
								}
							}
						}
					}
				},
				responses: {
					'201': {
						description: 'User created',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuthResponse' }
							}
						}
					},
					'400': {
						description: 'Email already in use',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' }
							}
						}
					}
				}
			}
		},
		'/auth/login': {
			post: {
				tags: ['Auth'],
				summary: 'Log in',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['email', 'password'],
								properties: {
									email: { type: 'string', format: 'email' },
									password: { type: 'string' }
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Authenticated',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuthResponse' }
							}
						}
					},
					'400': {
						description: 'Invalid credentials',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' }
							}
						}
					}
				}
			}
		},
		'/auth/me': {
			get: {
				tags: ['Auth'],
				summary: 'Get the current user',
				security: [{ bearerAuth: [] }],
				responses: {
					'200': {
						description: 'Current user',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										user: { $ref: '#/components/schemas/AuthUser' }
									}
								}
							}
						}
					},
					'401': { description: 'Not authenticated' }
				}
			}
		},
		'/auth/password': {
			patch: {
				tags: ['Auth'],
				summary: 'Change password',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['currentPassword', 'newPassword'],
								properties: {
									currentPassword: { type: 'string' },
									newPassword: { type: 'string', minLength: 6 }
								}
							}
						}
					}
				},
				responses: {
					'200': { description: 'Password updated' },
					'400': {
						description: 'Current password incorrect or invalid input',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' }
							}
						}
					}
				}
			}
		},
		'/auth/account': {
			delete: {
				tags: ['Auth'],
				summary: 'Delete the current account and all its data',
				security: [{ bearerAuth: [] }],
				responses: {
					'204': { description: 'Account deleted' },
					'401': { description: 'Not authenticated' }
				}
			}
		},
		'/datasets': {
			get: {
				tags: ['Datasets'],
				summary: "List the user's datasets",
				security: [{ bearerAuth: [] }],
				responses: {
					'200': {
						description: 'Array of datasets',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										datasets: {
											type: 'array',
											items: { $ref: '#/components/schemas/Dataset' }
										}
									}
								}
							}
						}
					}
				}
			}
		},
		'/datasets/upload': {
			post: {
				tags: ['Datasets'],
				summary: 'Upload and analyze a file',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									file: {
										type: 'string',
										format: 'binary',
										description: 'CSV, XLSX or JSON, up to 10 MB'
									}
								}
							}
						}
					}
				},
				responses: {
					'201': {
						description: 'Dataset created',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										dataset: { $ref: '#/components/schemas/Dataset' }
									}
								}
							}
						}
					},
					'400': {
						description: 'No file or unsupported type',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/Error' }
							}
						}
					}
				}
			}
		},
		'/datasets/stats/summary': {
			get: {
				tags: ['Datasets'],
				summary: 'Aggregated analytics across all datasets',
				security: [{ bearerAuth: [] }],
				responses: {
					'200': {
						description: 'Summary',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AnalyticsSummary' }
							}
						}
					}
				}
			}
		},
		'/datasets/{id}': {
			get: {
				tags: ['Datasets'],
				summary: 'Get a dataset with column stats',
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					'200': {
						description: 'Dataset with columns',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										dataset: {
											$ref: '#/components/schemas/DatasetWithColumns'
										}
									}
								}
							}
						}
					},
					'404': { description: 'Not found' }
				}
			},
			delete: {
				tags: ['Datasets'],
				summary: 'Delete a dataset',
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					'204': { description: 'Deleted' },
					'404': { description: 'Not found' }
				}
			}
		},
		'/datasets/{id}/rows': {
			get: {
				tags: ['Datasets'],
				summary: 'Browse dataset rows with search and pagination',
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' }
					},
					{
						name: 'search',
						in: 'query',
						schema: { type: 'string' },
						description: 'Full-text search across all columns'
					},
					{
						name: 'page',
						in: 'query',
						schema: { type: 'integer', default: 1 }
					},
					{
						name: 'limit',
						in: 'query',
						schema: { type: 'integer', default: 50, maximum: 200 }
					}
				],
				responses: {
					'200': {
						description: 'Paginated rows',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RowsResponse' }
							}
						}
					},
					'404': { description: 'Not found' }
				}
			}
		}
	}
} as const
