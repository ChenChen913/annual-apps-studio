import { create } from 'zustand'

type UiStore = {
  toast: string | null
  showToast: (message: string) => void
}

let timer: number | undefined

export const useUiStore = create<UiStore>()((set) => ({
  toast: null,
  showToast: (message) => {
    set({ toast: message })
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => set({ toast: null }), 2600)
  },
}))
