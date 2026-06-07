'use client'

import { Dropdown } from '@/components/ui/Dropdown'
import { UploadZone } from '@/components/UploadZone'
import { datasets, formatBytes, formatDate } from '@/lib/mock'
import { cn } from '@/lib/utils'
import { FileType } from '@/types'
import { ChevronRight, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// badge colors for each file type
const typeBadge: Record<FileType, string> = {
	csv: 'bg-secondary/15 text-secondary',
	xlsx: 'bg-primary/15 text-primary',
	json: 'bg-warning/15 text-warning'
}

export default function DashboardPage() {
	const [filter, setFilter] = useState<FileType | 'all'>('all')

	const filteredDatasets =
		filter === 'all' ? datasets : datasets.filter(d => d.fileType === filter)

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">My datasets</h1>
				<p className="mt-1 text-sm text-light-gray">
					Upload a file to view column analytics
				</p>
			</div>

			<UploadZone />

			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-light-gray">
					Files · {filteredDatasets.length}
				</h2>
				<div className="w-48">
					<Dropdown
						options={['all', 'csv', 'xlsx', 'json']}
						value={filter}
						onChange={v => setFilter(v as FileType | 'all')}
						placeholder="Filter by type"
					/>
				</div>
			</div>

			{filteredDatasets.length === 0 ? (
				<div className="rounded-xl border border-dashed border-light-gray/30 p-10 text-center text-sm text-light-gray">
					No files of this type
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{filteredDatasets.map(d => (
						<Link
							key={d.id}
							href={`/dashboard/${d.id}`}
							className="group flex items-center gap-4 rounded-xl border border-light-gray/20 bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
						>
							{/* icon */}
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background">
								<FileSpreadsheet
									size={22}
									className="text-light-gray"
								/>
							</div>

							{/* name + type */}
							<div className="flex min-w-0 flex-1 flex-col">
								<div className="flex items-center gap-2">
									<span className="truncate font-medium text-gray">
										{d.filename}
									</span>
									<span
										className={cn(
											'rounded px-1.5 py-0.5 text-xs font-medium uppercase',
											typeBadge[d.fileType]
										)}
									>
										{d.fileType}
									</span>
								</div>
								<span className="mt-0.5 text-xs text-light-gray">
									{formatDate(d.createdAt)}
								</span>
							</div>

							{/* metadata */}
							<div className="hidden shrink-0 gap-6 text-right sm:flex">
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray">
										{d.rowCount.toLocaleString('en-US')}
									</span>
									<span className="text-xs text-light-gray">rows</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray">
										{d.columnCount}
									</span>
									<span className="text-xs text-light-gray">columns</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray">
										{formatBytes(d.sizeBytes)}
									</span>
									<span className="text-xs text-light-gray">size</span>
								</div>
							</div>

							<ChevronRight
								size={20}
								className="shrink-0 text-light-gray transition-transform group-hover:translate-x-0.5"
							/>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
