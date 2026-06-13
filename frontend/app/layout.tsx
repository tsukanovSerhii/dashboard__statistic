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
		<html lang="en">
			<body>
				<ThemeProvider>{children}</ThemeProvider>
				<ToastProvider />
			</body>
		</html>
	)
}
