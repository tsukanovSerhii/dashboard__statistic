import { QueryProvider } from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'DataLens — analytics dashboard',
	description:
		'Upload CSV, XLSX or JSON files and explore their analytics.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Runs before paint — prevents white flash when dark theme is stored */}
				<script
					dangerouslySetInnerHTML={{
						__html: `try{const t=JSON.parse(localStorage.getItem('theme')||'{}');if(t.state?.theme==='dark')document.documentElement.classList.add('dark')}catch{}`
					}}
				/>
			</head>
			<body>
				<QueryProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</QueryProvider>
				<ToastProvider />
			</body>
		</html>
	)
}
