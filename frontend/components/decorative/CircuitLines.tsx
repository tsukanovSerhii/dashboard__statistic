export const CircuitLines = ({ className = '' }: { className?: string }) => (
	<svg
		className={`pointer-events-none select-none ${className}`}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 400 300"
		fill="none"
	>
		<g stroke="currentColor" strokeWidth="1" opacity="0.35">
			{/* horizontal lines */}
			<line x1="0" y1="60" x2="120" y2="60" />
			<line x1="160" y1="60" x2="240" y2="60" />
			<line x1="280" y1="60" x2="400" y2="60" />
			<line x1="0" y1="150" x2="80" y2="150" />
			<line x1="140" y1="150" x2="260" y2="150" />
			<line x1="320" y1="150" x2="400" y2="150" />
			<line x1="0" y1="240" x2="160" y2="240" />
			<line x1="200" y1="240" x2="400" y2="240" />
			{/* vertical connectors */}
			<line x1="120" y1="60" x2="120" y2="150" />
			<line x1="260" y1="60" x2="260" y2="150" />
			<line x1="80" y1="150" x2="80" y2="240" />
			<line x1="320" y1="150" x2="320" y2="240" />
			<line x1="160" y1="60" x2="160" y2="240" />
		</g>
		{/* nodes */}
		<g fill="currentColor" opacity="0.5">
			<circle cx="120" cy="60" r="3" />
			<circle cx="160" cy="60" r="3" />
			<circle cx="260" cy="60" r="3" />
			<circle cx="80" cy="150" r="3" />
			<circle cx="140" cy="150" r="3" />
			<circle cx="260" cy="150" r="3" />
			<circle cx="320" cy="150" r="3" />
			<circle cx="160" cy="240" r="3" />
			<circle cx="200" cy="240" r="3" />
			<circle cx="320" cy="240" r="3" />
		</g>
	</svg>
)
