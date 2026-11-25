import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { TemplateId } from '../types'

type PrefsStore = {
  favoriteTemplates: TemplateId[]
  toggleFavorite: (id: TemplateId) => void
}

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set) => ({
      favoriteTemplates: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteTemplates: state.favoriteTemplates.includes(id)
            ? state.favoriteTemplates.filter((item) => item !== id)
            : [...state.favoriteTemplates, id],
        })),
    }),
    {
      name: 'annual-apps-prefs-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteTemplates: state.favoriteTemplates }),
    },
  ),
)
