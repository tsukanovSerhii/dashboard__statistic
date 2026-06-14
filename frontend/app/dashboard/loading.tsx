import { DatasetListSkeleton } from '@/components/dataset/DatasetListSkeleton'
import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* header */}
			<div className="flex items-end justify-between">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-4 w-56" />
				</div>
				<Skeleton className="h-11 w-64 rounded-xl" />
			</div>

			{/* upload zone */}
			<Skeleton className="h-16 w-full rounded-2xl" />

			{/* filters */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-5 w-24" />
				<div className="flex gap-2">
					<Skeleton className="h-9 w-44 rounded-xl" />
					<Skeleton className="h-9 w-32 rounded-xl" />
					<Skeleton className="h-9 w-28 rounded-xl" />
				</div>
			</div>

			{/* grid cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex flex-col gap-4 rounded-2xl border border-light-gray/15 bg-surface p-5">
						<div className="flex items-start justify-between">
							<Skeleton className="h-11 w-11 rounded-xl" />
							<Skeleton className="h-5 w-12 rounded-md" />
						</div>
						<div className="flex flex-col gap-1.5">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/3" />
						</div>
						<div className="grid grid-cols-3 gap-2 rounded-xl bg-background px-3 py-2.5">
							{[1, 2, 3].map(j => (
								<div key={j} className="flex flex-col items-center gap-1">
									<Skeleton className="h-5 w-10" />
									<Skeleton className="h-3 w-6" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
