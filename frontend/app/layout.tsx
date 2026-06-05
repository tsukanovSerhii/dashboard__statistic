import { ThemeProvider } from '@/components/ThemeProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Dashboard',
	description:
		'This is a dashboard template built with Next.js and Tailwind CSS. It includes a sidebar, header, and main content area. The sidebar contains navigation links, while the header includes a search bar and user profile dropdown. The main content area is where you can display your dashboard widgets and data visualizations.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="uk">
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
