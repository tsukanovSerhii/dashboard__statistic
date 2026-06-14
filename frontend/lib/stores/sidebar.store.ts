import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarStore = {
	collapsed: boolean
	toggle: () => void
}

export const useSidebarStore = create<SidebarStore>()(
	persist(
		set => ({
			collapsed: false,
			toggle: () => set(state => ({ collapsed: !state.collapsed }))
		}),
		{ name: 'sidebar' } // localStorage key
	)
)
