'use client'

import { FILE_TYPE_COLOR } from '@/lib/constants'
import type { Dataset, FileType } from '@/types'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartCard } from './ChartCard'

const TYPES: FileType[] = ['csv', 'xlsx', 'json']

export const DatasetsByTypePie = ({ datasets }: { datasets: Dataset[] }) => {
	const data = TYPES.map(type => ({
		name: type.toUpperCase(),
		type,
		value: datasets.filter(d => d.fileType === type).length
	})).filter(d => d.value > 0) // hide empty slices

	return (
		<ChartCard title="Files by type">
			<ResponsiveContainer
				width="100%"
				height={280}
			>
				<PieChart>
					<Pie
						data={data}
						dataKey="value"
						nameKey="name"
						innerRadius={60}
						outerRadius={100}
						paddingAngle={2}
					>
						{data.map(d => (
							<Cell
								key={d.type}
								fill={FILE_TYPE_COLOR[d.type]}
							/>
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							borderRadius: 8,
							border: '1px solid var(--color-border, #e2e8f0)',
							fontSize: 12
						}}
					/>
				</PieChart>
			</ResponsiveContainer>

			{/* legend */}
			<div className="mt-3 flex flex-wrap justify-center gap-4">
				{data.map(d => (
					<div
						key={d.type}
						className="flex items-center gap-1.5 text-xs text-light-gray"
					>
						<span
							className="h-2.5 w-2.5 rounded-full"
							style={{ backgroundColor: FILE_TYPE_COLOR[d.type] }}
						/>
						{d.name} · {d.value}
					</div>
				))}
			</div>
		</ChartCard>
	)
}
