export const FloatingShapes = ({ className = '' }: { className?: string }) => (
	<svg
		className={`pointer-events-none select-none ${className}`}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 500 400"
		fill="none"
	>
		{/* large faint ring */}
		<circle cx="420" cy="80" r="90" stroke="currentColor" strokeWidth="1" opacity="0.12" />
		<circle cx="420" cy="80" r="60" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />

		{/* small ring bottom-left */}
		<circle cx="60" cy="340" r="50" stroke="currentColor" strokeWidth="1" opacity="0.1" />

		{/* diamond top-left */}
		<rect x="30" y="30" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.18" transform="rotate(45 44 44)" />

		{/* small dots scattered */}
		<circle cx="200" cy="20" r="3" fill="currentColor" opacity="0.15" />
		<circle cx="350" cy="190" r="2" fill="currentColor" opacity="0.12" />
		<circle cx="100" cy="200" r="2.5" fill="currentColor" opacity="0.1" />
		<circle cx="460" cy="300" r="4" fill="currentColor" opacity="0.08" />

		{/* triangle */}
		<path d="M 240 360 L 260 325 L 280 360 Z" stroke="currentColor" strokeWidth="1" opacity="0.14" />
	</svg>
)
