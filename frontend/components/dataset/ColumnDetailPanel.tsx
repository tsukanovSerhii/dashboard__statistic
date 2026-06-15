'use client'

import { COLUMN_TYPE_BADGE } from '@/lib/constants'
import { useColumnDistribution } from '@/lib/hooks/useColumnDistribution'
import { cn } from '@/lib/utils'
import { Column } from '@/types'
import { Loader2, X } from 'lucide-react'
import { useEffect } from 'react'

type ColumnDetailPanelProps = {
	datasetId: string
	column: Column
	rowCount: number
	onClose: () => void
}

export const ColumnDetailPanel = ({
	datasetId,
	column,
	rowCount,
	onClose
}: ColumnDetailPanelProps) => {
	const { data: dist, isLoading } = useColumnDistribution(
		datasetId,
		column.name
	)

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [onClose])

	const fillRate = Math.round(((rowCount - column.nullCount) / rowCount) * 100)
	const maxCount = dist?.topValues[0]?.count ?? 1

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-40 animate-fade-in"
				onClick={onClose}
			/>

			{/* Panel */}
			<div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-light-gray/20 bg-surface shadow-2xl animate-slide-right">
				{/* Header */}
				<div className="flex items-start justify-between gap-3 border-b border-light-gray/15 px-5 py-4">
					<div className="min-w-0">
						<p className="truncate text-base font-semibold text-title">
							{column.name}
						</p>
						<span
							className={cn(
								'mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium',
								COLUMN_TYPE_BADGE[column.dataType]
							)}
						>
							{column.dataType}
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-light-gray transition-colors hover:bg-light-gray/10 hover:text-title"
					>
						<X size={15} />
					</button>
				</div>

				{/* Stats row */}
				<div className="grid grid-cols-3 gap-px border-b border-light-gray/15 bg-light-gray/10">
					{[
						{ label: 'Fill rate', value: `${fillRate}%` },
						{ label: 'Nulls', value: column.nullCount.toLocaleString('en-US') },
						{
							label: 'Unique',
							value: column.uniqueCount.toLocaleString('en-US')
						}
					].map(s => (
						<div
							key={s.label}
							className="flex flex-col gap-0.5 bg-surface px-4 py-3"
						>
							<p className="text-xs text-light-gray">{s.label}</p>
							<p className="text-base font-bold text-title">{s.value}</p>
						</div>
					))}
				</div>

				{/* Fill rate bar */}
				<div className="px-5 py-3 border-b border-light-gray/10">
					<div className="flex items-center justify-between mb-1.5">
						<p className="text-xs text-light-gray">Data completeness</p>
						<p className="text-xs font-medium text-title">{fillRate}%</p>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-background">
						<div
							className={cn(
								'h-full rounded-full transition-all',
								fillRate >= 90
									? 'bg-secondary'
									: fillRate >= 60
										? 'bg-warning'
										: 'bg-error'
							)}
							style={{ width: `${fillRate}%` }}
						/>
					</div>
				</div>

				{/* Top values */}
				<div className="flex-1 overflow-y-auto px-5 py-4">
					<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-light-gray">
						Top values{' '}
						{dist &&
							`(${dist.sampledRows.toLocaleString('en-US')} rows sampled)`}
					</p>

					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2
								size={20}
								className="animate-spin text-primary"
							/>
						</div>
					) : !dist || dist.topValues.length === 0 ? (
						<p className="py-8 text-center text-sm text-light-gray">
							No values found
						</p>
					) : (
						<div className="flex flex-col gap-2">
							{dist.topValues.map(({ value, count }) => {
								const pct = Math.round((count / maxCount) * 100)
								const share =
									dist.sampledRows > 0
										? ((count / dist.sampledRows) * 100).toFixed(1)
										: '0'
								return (
									<div
										key={value}
										className="group flex flex-col gap-1"
									>
										<div className="flex items-center justify-between gap-2">
											<span
												className="truncate text-xs font-medium text-title max-w-[60%]"
												title={value}
											>
												{value}
											</span>
											<span className="shrink-0 text-xs text-light-gray">
												{count.toLocaleString('en-US')}{' '}
												<span className="text-light-gray/60">({share}%)</span>
											</span>
										</div>
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
											<div
												className="h-full rounded-full bg-primary/60 transition-all group-hover:bg-primary"
												style={{ width: `${pct}%` }}
											/>
										</div>
									</div>
								)
							})}

							{dist.nullCount > 0 && (
								<div className="mt-1 flex items-center justify-between rounded-lg bg-background px-3 py-2">
									<span className="text-xs text-light-gray italic">
										null / empty
									</span>
									<span className="text-xs text-light-gray">
										{dist.nullCount.toLocaleString('en-US')}
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
