export const DataPattern = ({ className = '' }: { className?: string }) => (
	<svg
		className={`pointer-events-none select-none ${className}`}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 600 200"
		fill="none"
	>
		{/* stylised bar chart silhouette */}
		<g opacity="0.12" fill="currentColor">
			<rect x="0"   y="140" width="30" height="60"  rx="4" />
			<rect x="40"  y="100" width="30" height="100" rx="4" />
			<rect x="80"  y="120" width="30" height="80"  rx="4" />
			<rect x="120" y="60"  width="30" height="140" rx="4" />
			<rect x="160" y="90"  width="30" height="110" rx="4" />
			<rect x="200" y="40"  width="30" height="160" rx="4" />
			<rect x="240" y="80"  width="30" height="120" rx="4" />
			<rect x="280" y="110" width="30" height="90"  rx="4" />
			<rect x="320" y="70"  width="30" height="130" rx="4" />
			<rect x="360" y="130" width="30" height="70"  rx="4" />
			<rect x="400" y="50"  width="30" height="150" rx="4" />
			<rect x="440" y="90"  width="30" height="110" rx="4" />
			<rect x="480" y="110" width="30" height="90"  rx="4" />
			<rect x="520" y="60"  width="30" height="140" rx="4" />
			<rect x="560" y="80"  width="30" height="120" rx="4" />
		</g>
		{/* line overlay */}
		<polyline
			points="15,140 55,100 95,120 135,60 175,90 215,40 255,80 295,110 335,70 375,130 415,50 455,90 495,110 535,60 575,80"
			stroke="currentColor"
			strokeWidth="1.5"
			opacity="0.2"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	</svg>
)
