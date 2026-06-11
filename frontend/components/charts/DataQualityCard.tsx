'use client'

import { ChartCard } from './ChartCard'

type Props = {
	totalRows: number
	totalColumns: number
	totalNulls: number
}

// data completeness: how many cells are filled vs missing
export const DataQualityCard = ({
	totalRows,
	totalColumns,
	totalNulls
}: Props) => {
	const totalCells = totalRows * totalColumns
	const filledPct =
		totalCells > 0
			? Math.round(((totalCells - totalNulls) / totalCells) * 100)
			: 100

	return (
		<ChartCard title="Data quality">
			<div className="flex flex-col gap-4 py-2">
				<div className="flex items-baseline justify-between">
					<span className="text-3xl font-semibold text-gray">
						{filledPct}%
					</span>
					<span className="text-sm text-light-gray">filled</span>
				</div>

				<div className="h-3 overflow-hidden rounded-full bg-background">
					<div
						className="h-full rounded-full bg-secondary transition-all"
						style={{ width: `${filledPct}%` }}
					/>
				</div>

				<div className="flex justify-between text-xs text-light-gray">
					<span>
						{(totalCells - totalNulls).toLocaleString('en-US')} filled
					</span>
					<span>{totalNulls.toLocaleString('en-US')} missing</span>
				</div>
			</div>
		</ChartCard>
	)
}
