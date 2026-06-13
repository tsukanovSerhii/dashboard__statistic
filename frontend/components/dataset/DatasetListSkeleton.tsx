import { Skeleton } from '@/components/ui/Skeleton'

// skeleton placeholder mimicking a dataset list row
const Row = () => (
	<div className="flex items-center gap-4 rounded-xl border border-light-gray/20 bg-surface p-4">
		<Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
		<div className="flex flex-1 flex-col gap-2">
			<Skeleton className="h-4 w-40" />
			<Skeleton className="h-3 w-24" />
		</div>
		<div className="hidden gap-6 sm:flex">
			<Skeleton className="h-8 w-10" />
			<Skeleton className="h-8 w-10" />
			<Skeleton className="h-8 w-12" />
		</div>
	</div>
)

export const DatasetListSkeleton = ({ rows = 4 }: { rows?: number }) => (
	<div className="flex flex-col gap-3">
		{Array.from({ length: rows }).map((_, i) => (
			<Row key={i} />
		))}
	</div>
)
