type SettingsCardProps = {
	title: string
	description?: string
	children: React.ReactNode
}

export const SettingsCard = ({
	title,
	description,
	children
}: SettingsCardProps) => (
	<div className="rounded-xl border border-light-gray/20 bg-surface p-6">
		<h2 className="text-lg font-semibold">{title}</h2>
		{description && (
			<p className="mt-1 text-sm text-light-gray">{description}</p>
		)}
		<div className="mt-5">{children}</div>
	</div>
)
