'use client'

import type { Dataset } from '@/types'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { ChartCard } from './ChartCard'

export const RowsByDatasetBar = ({ datasets }: { datasets: Dataset[] }) => {
	const data = datasets.map(d => ({
		name: d.filename,
		rows: d.rowCount
	}))

	return (
		<ChartCard title="Rows by dataset">
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
						dataKey="name"
						tick={{ fontSize: 12, fill: 'var(--color-light-gray)' }}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						tick={{ fontSize: 12, fill: 'var(--color-light-gray)' }}
						tickLine={false}
						axisLine={false}
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
						dataKey="rows"
						fill="var(--color-primary)"
						radius={[6, 6, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	)
}
