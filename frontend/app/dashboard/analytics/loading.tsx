import { Skeleton } from '@/components/ui/Skeleton'

const ChartSkeleton = () => (
	<div className="rounded-2xl border border-light-gray/20 bg-surface p-5">
		<div className="mb-4 flex flex-col gap-1.5">
			<Skeleton className="h-4 w-32" />
			<Skeleton className="h-3 w-48" />
		</div>
		<Skeleton className="h-64 w-full rounded-xl" />
	</div>
)

export default function AnalyticsLoading() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-4 w-56" />
			</div>

			{/* stat cards */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="relative overflow-hidden rounded-2xl border border-light-gray/20 bg-surface p-5">
						<div className="absolute left-0 top-0 h-full w-1 animate-pulse rounded-l-2xl bg-light-gray/20" />
						<div className="pl-2 flex flex-col gap-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-8 w-28" />
						</div>
					</div>
				))}
			</div>

			{/* charts row 1 */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<ChartSkeleton />
				<div className="lg:col-span-2"><ChartSkeleton /></div>
			</div>

			{/* charts row 2 */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2"><ChartSkeleton /></div>
				<ChartSkeleton />
			</div>
		</div>
	)
}
