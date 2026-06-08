'use client'

import { useThemeStore } from '@/lib/stores/theme.store'
import { useEffect } from 'react'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const theme = useThemeStore(state => state.theme)

	// add/remove .dark class on <html> whenever the theme changes
	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}, [theme])

	return <>{children}</>
}
