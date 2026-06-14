const COLS = 5
const ROWS = 8

export const TableSkeleton = () => (
	<div className="overflow-hidden rounded-xl border border-light-gray/20">
		<table className="w-full text-sm">
			<thead className="bg-background">
				<tr>
					{Array.from({ length: COLS }).map((_, i) => (
						<th key={i} className="px-4 py-3">
							<div className="h-3 w-20 animate-pulse rounded bg-light-gray/20" />
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{Array.from({ length: ROWS }).map((_, ri) => (
					<tr key={ri} className="border-t border-light-gray/10">
						{Array.from({ length: COLS }).map((_, ci) => (
							<td key={ci} className="px-4 py-2.5">
								<div
									className="h-3 animate-pulse rounded bg-light-gray/15"
									style={{ width: `${55 + ((ri * 3 + ci * 7) % 5) * 10}%` }}
								/>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>
)
