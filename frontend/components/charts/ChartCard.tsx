type ChartCardProps = {
	title: string
	children: React.ReactNode
	className?: string
}

export const ChartCard = ({ title, children, className }: ChartCardProps) => (
	<div
		className={`rounded-xl border border-light-gray/20 bg-surface p-5 ${className ?? ''}`}
	>
		<h2 className="mb-4 text-sm font-medium text-light-gray">{title}</h2>
		{children}
	</div>
)
