'use client'

import { useThemeStore } from '@/lib/useThemeStore'
import { useEffect } from 'react'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const theme = useThemeStore(state => state.theme)

	// додає/прибирає клас .dark на <html> щоразу, коли тема змінюється
	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}, [theme])

	return <>{children}</>
}
