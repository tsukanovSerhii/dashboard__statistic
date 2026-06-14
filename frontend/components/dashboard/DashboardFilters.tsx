import { Dropdown } from '@/components/ui/Dropdown'
import { FileType } from '@/types'
import { Search } from 'lucide-react'

type SortOption = 'newest' | 'oldest' | 'name' | 'size' | 'rows'

type DashboardFiltersProps = {
	count: number
	totalCols: number
	search: string
	onSearch: (v: string) => void
	sort: SortOption
	onSort: (v: SortOption) => void
	filter: FileType | 'all'
	onFilter: (v: FileType | 'all') => void
}

const FILE_TYPES = ['all', 'csv', 'xlsx', 'json']
const SORT_OPTIONS = ['newest', 'oldest', 'name', 'size', 'rows']

export const DashboardFilters = ({
	count,
	totalCols,
	search,
	onSearch,
	sort,
	onSort,
	filter,
	onFilter,
}: DashboardFiltersProps) => (
	<div className="flex flex-wrap items-center justify-between gap-3">
		<h2 className="text-sm font-semibold text-light-gray">
			All files
			<span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
				{count}
			</span>
			{totalCols > 0 && (
				<span className="ml-2 text-xs text-light-gray/60">· {totalCols} columns total</span>
			)}
		</h2>

		<div className="flex flex-wrap items-center gap-2">
			<div className="relative">
				<Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray" />
				<input
					type="text"
					placeholder="Search files…"
					value={search}
					onChange={e => onSearch(e.target.value)}
					className="h-9 w-44 rounded-xl border border-light-gray/20 bg-surface pl-8 pr-3 text-xs text-title placeholder:text-light-gray focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
				/>
			</div>
			<div className="w-32">
				<Dropdown options={SORT_OPTIONS} value={sort} onChange={v => onSort(v as SortOption)} placeholder="Sort by" />
			</div>
			<div className="w-28">
				<Dropdown options={FILE_TYPES} value={filter} onChange={v => onFilter(v as FileType | 'all')} placeholder="Filter" />
			</div>
		</div>
	</div>
)
