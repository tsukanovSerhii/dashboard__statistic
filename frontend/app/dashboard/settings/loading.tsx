import { Skeleton } from '@/components/ui/Skeleton'

const CardSkeleton = () => (
	<div className="rounded-2xl border border-light-gray/20 bg-surface p-6">
		<div className="mb-4 flex flex-col gap-1.5">
			<Skeleton className="h-5 w-36" />
			<Skeleton className="h-3 w-52" />
		</div>
		<div className="flex flex-col gap-3">
			<Skeleton className="h-10 w-full rounded-xl" />
			<Skeleton className="h-10 w-full rounded-xl" />
		</div>
	</div>
)

export default function SettingsLoading() {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-8 w-28" />
				<Skeleton className="h-4 w-56" />
			</div>
			<CardSkeleton />
			<CardSkeleton />
			<Skeleton className="h-32 w-full rounded-xl" />
		</div>
	)
}
