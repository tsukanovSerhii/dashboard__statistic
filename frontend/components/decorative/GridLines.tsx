export const GridLines = ({ className = '' }: { className?: string }) => (
	<svg
		className={`pointer-events-none select-none ${className}`}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
	>
		<defs>
			<pattern id="grid-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
				<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid-lines)" />
	</svg>
)
