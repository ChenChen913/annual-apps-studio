import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { uid } from '../lib/id'
import { idbStorage } from '../lib/storage'

export type SavedIcon = {
  id: string
  label: string
  src: string
  category: string
  /** 来源说明，例如「仪表盘图标库」「在线搜索 · simple-icons」 */
  source: string
  license: string
  addedAt: number
}

type IconLibraryStore = {
  saved: SavedIcon[]
  favorites: string[]
  recents: string[]
  /** 保存到「我的图标库」，同一张图重复保存会复用已有条目 */
  saveIcon: (icon: Omit<SavedIcon, 'id' | 'addedAt'>) => string
  removeIcon: (id: string) => void
  renameIcon: (id: string, label: string) => void
  toggleFavorite: (id: string) => void
  touchRecent: (id: string) => void
}

const RECENT_LIMIT = 12

export const useIconLibraryStore = create<IconLibraryStore>()(
  persist(
    (set, get) => ({
      saved: [],
      favorites: [],
      recents: [],

      saveIcon: (icon) => {
        const existing = get().saved.find((item) => item.src === icon.src)
        if (existing) {
          if (icon.label && existing.label !== icon.label) {
            set((state) => ({
              saved: state.saved.map((item) =>
                item.id === existing.id ? { ...item, label: icon.label } : item,
              ),
            }))
          }
          return existing.id
        }
        const id = uid('user-icon')
        set((state) => ({
          saved: [{ ...icon, id, addedAt: Date.now() }, ...state.saved].slice(0, 200),
        }))
        return id
      },

      removeIcon: (id) =>
        set((state) => ({
          saved: state.saved.filter((item) => item.id !== id),
          favorites: state.favorites.filter((item) => item !== id),
          recents: state.recents.filter((item) => item !== id),
        })),

      renameIcon: (id, label) =>
        set((state) => ({
          saved: state.saved.map((item) => (item.id === id ? { ...item, label } : item)),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((item) => item !== id)
            : [id, ...state.favorites].slice(0, 60),
        })),

      touchRecent: (id) =>
        set((state) => ({
          recents: [id, ...state.recents.filter((item) => item !== id)].slice(0, RECENT_LIMIT),
        })),
    }),
    {
      name: 'annual-apps-studio-icon-library',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ saved: state.saved, favorites: state.favorites, recents: state.recents }),
    },
  ),
)
