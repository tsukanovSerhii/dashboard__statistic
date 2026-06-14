import { Skeleton } from '@/components/ui/Skeleton'

const GridCard = () => (
	<div className="flex flex-col gap-4 rounded-2xl border border-light-gray/15 bg-surface p-5">
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
		<div className="flex justify-end">
			<Skeleton className="h-6 w-14 rounded-lg" />
		</div>
	</div>
)

export const DatasetListSkeleton = ({ count = 6 }: { count?: number }) => (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{Array.from({ length: count }).map((_, i) => (
			<GridCard key={i} />
		))}
	</div>
)
