type ChartCardProps = {
	title: string
	subtitle?: string
	children: React.ReactNode
	className?: string
	action?: React.ReactNode
}

export const ChartCard = ({ title, subtitle, children, className, action }: ChartCardProps) => (
	<div className={`rounded-2xl border border-light-gray/20 bg-surface p-5 ${className ?? ''}`}>
		{(title || action) && (
			<div className="mb-4 flex items-start justify-between gap-3">
				<div>
					{title && <h2 className="text-sm font-semibold text-title">{title}</h2>}
					{subtitle && <p className="mt-0.5 text-xs text-light-gray">{subtitle}</p>}
				</div>
				{action}
			</div>
		)}
		{children}
	</div>
)
