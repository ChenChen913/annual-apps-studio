import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { idbStorage } from '../lib/storage'
import { uid } from '../lib/id'
import type { PosterDoc } from '../types'

export type Draft = {
  id: string
  name: string
  savedAt: number
  doc: PosterDoc
}

type DraftsStore = {
  drafts: Draft[]
  saveDraft: (name: string, doc: PosterDoc) => Draft
  removeDraft: (id: string) => void
  removeAllDrafts: () => void
}

const MAX_DRAFTS = 20

function cloneDoc(doc: PosterDoc): PosterDoc {
  return JSON.parse(JSON.stringify(doc)) as PosterDoc
}

export const useDraftsStore = create<DraftsStore>()(
  persist(
    (set, get) => ({
      drafts: [],

      saveDraft: (name, doc) => {
        const trimmed = name.trim() || doc.title.trim() || '未命名草稿'
        const existing = get().drafts.find((draft) => draft.name === trimmed)
        const draft: Draft = {
          id: existing?.id ?? uid('draft'),
          name: trimmed,
          savedAt: Date.now(),
          doc: cloneDoc(doc),
        }
        set((state) => ({
          drafts: [draft, ...state.drafts.filter((item) => item.id !== draft.id)].slice(0, MAX_DRAFTS),
        }))
        return draft
      },

      removeDraft: (id) =>
        set((state) => ({ drafts: state.drafts.filter((draft) => draft.id !== id) })),

      removeAllDrafts: () => set({ drafts: [] }),
    }),
    {
      name: 'annual-apps-drafts-v1',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ drafts: state.drafts }),
    },
  ),
)
