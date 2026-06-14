'use client'

import { useThemeStore } from '@/lib/stores/theme.store'
import { Toaster } from 'sonner'

// theme-aware toast container
export const ToastProvider = () => {
	const theme = useThemeStore(state => state.theme)

	return (
		<Toaster
			theme={theme}
			position="top-right"
			richColors
			closeButton
			duration={3000}
		/>
	)
}
