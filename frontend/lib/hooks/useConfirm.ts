'use client'

import { useState, useCallback } from 'react'

type ConfirmOptions = {
	title: string
	description?: string
	confirmLabel?: string
	variant?: 'danger' | 'warning'
}

type ConfirmState = ConfirmOptions & { resolve: (v: boolean) => void }

export const useConfirm = () => {
	const [state, setState] = useState<ConfirmState | null>(null)

	const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> =>
		new Promise(resolve => setState({ ...opts, resolve }))
	, [])

	const handleConfirm = () => {
		state?.resolve(true)
		setState(null)
	}

	const handleCancel = () => {
		state?.resolve(false)
		setState(null)
	}

	return { confirm, state, handleConfirm, handleCancel }
}
