type StatCardProps = {
	label: string
	value: string | number
}

export const StatCard = ({ label, value }: StatCardProps) => (
	<div className="flex flex-col gap-1 rounded-xl border border-light-gray/20 bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
		<span className="text-xs text-light-gray">{label}</span>
		<span className="text-2xl font-semibold text-gray">{value}</span>
	</div>
)
