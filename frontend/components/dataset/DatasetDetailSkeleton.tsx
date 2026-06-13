import { Skeleton } from '@/components/ui/Skeleton'

// skeleton placeholder for the dataset detail page
export const DatasetDetailSkeleton = () => (
	<div className="flex flex-col gap-6">
		{/* back link */}
		<Skeleton className="h-4 w-24" />

		{/* header */}
		<Skeleton className="h-8 w-64" />

		{/* stat cards */}
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="flex flex-col gap-2 rounded-xl border border-light-gray/20 bg-surface p-4"
				>
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-7 w-20" />
				</div>
			))}
		</div>

		{/* table */}
		<div className="overflow-hidden rounded-xl border border-light-gray/20">
			<div className="flex flex-col gap-3 p-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-5 w-full"
					/>
				))}
			</div>
		</div>
	</div>
)
