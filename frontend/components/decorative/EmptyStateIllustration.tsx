export const EmptyStateIllustration = ({ className = '' }: { className?: string }) => (
	<svg
		className={`pointer-events-none select-none ${className}`}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 240 180"
		fill="none"
	>
		{/* table frame */}
		<rect x="20" y="30" width="200" height="120" rx="10" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
		{/* header row */}
		<rect x="20" y="30" width="200" height="28" rx="10" fill="currentColor" opacity="0.08" />
		<rect x="20" y="50" width="200" height="8" rx="4" fill="currentColor" opacity="0" />

		{/* header dividers */}
		<line x1="86" y1="30" x2="86" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.12" />
		<line x1="152" y1="30" x2="152" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.12" />

		{/* row dividers */}
		<line x1="20" y1="70" x2="220" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.1" />
		<line x1="20" y1="95" x2="220" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.1" />
		<line x1="20" y1="120" x2="220" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.1" />

		{/* header text placeholders */}
		<rect x="34" y="40" width="36" height="8" rx="3" fill="currentColor" opacity="0.25" />
		<rect x="100" y="40" width="36" height="8" rx="3" fill="currentColor" opacity="0.25" />
		<rect x="166" y="40" width="36" height="8" rx="3" fill="currentColor" opacity="0.25" />

		{/* data cell placeholders — faded / "missing" */}
		{[78, 103, 128].map((y, ri) => (
			[34, 100, 166].map((x, ci) => (
				<rect
					key={`${ri}-${ci}`}
					x={x} y={y - 4} width={ci === 1 ? 44 : 32} height="7" rx="3"
					fill="currentColor"
					opacity={ri === 1 && ci === 1 ? 0.05 : 0.12}
					strokeDasharray={ri === 1 && ci === 1 ? '3 2' : undefined}
					stroke={ri === 1 && ci === 1 ? 'currentColor' : undefined}
					strokeWidth={ri === 1 && ci === 1 ? 1 : 0}
				/>
			))
		))}

		{/* upload arrow */}
		<circle cx="190" cy="24" r="16" fill="currentColor" opacity="0.1" />
		<path d="M190 30 L190 18 M185 23 L190 18 L195 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
	</svg>
)
