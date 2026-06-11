'use client'

import { COLUMN_TYPE_COLOR } from '@/lib/constants'
import type { Column } from '@/types'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { ChartCard } from './ChartCard'

type Item = { dataType: Column['dataType']; count: number }

export const ColumnTypesBar = ({ data }: { data: Item[] }) => (
	<ChartCard title="Column types">
		<ResponsiveContainer
			width="100%"
			height={280}
		>
			<BarChart
				data={data}
				margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
			>
				<CartesianGrid
					strokeDasharray="3 3"
					stroke="var(--color-light-gray)"
					opacity={0.15}
				/>
				<XAxis
					dataKey="dataType"
					tick={{ fontSize: 12, fill: 'var(--color-light-gray)' }}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tick={{ fontSize: 12, fill: 'var(--color-light-gray)' }}
					tickLine={false}
					axisLine={false}
					allowDecimals={false}
				/>
				<Tooltip
					cursor={{ fill: 'var(--color-primary)', opacity: 0.06 }}
					contentStyle={{
						borderRadius: 8,
						border: '1px solid var(--color-border, #e2e8f0)',
						fontSize: 12
					}}
				/>
				<Bar
					dataKey="count"
					radius={[6, 6, 0, 0]}
				>
					{data.map(d => (
						<Cell
							key={d.dataType}
							fill={COLUMN_TYPE_COLOR[d.dataType]}
						/>
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
)
