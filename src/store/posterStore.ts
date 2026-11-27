import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { BACKGROUND_MAP } from '../data/backgrounds'
import { createDefaultDoc } from '../data/defaultProject'
import { createAiIndexDoc } from '../data/aiIndex'
import { resolveTemplateLayout } from '../data/templates'
import { getCanvas, type RatioId } from '../data/ratios'
import { isDarkColor } from '../lib/color'
import { uid } from '../lib/id'
import { sanitizeDoc } from '../lib/project'
import { idbStorage } from '../lib/storage'
import type { AppItem, Category, ExportFormat, PosterDoc, TemplateId } from '../types'

const HISTORY_LIMIT = 50
const MERGE_WINDOW = 700

type AppIconPatch = { libraryId: string | null; iconSrc: string | null }

type PosterStore = {
  doc: PosterDoc
  past: PosterDoc[]
  future: PosterDoc[]
  lastKey: string | null
  lastAt: number
  setField: <K extends keyof PosterDoc>(key: K, value: PosterDoc[K], historyKey?: string) => void
  setBackground: (id: string) => void
  applyCustomBackground: (dataUrl: string) => void
  useCustomBackground: () => void
  renameCategory: (id: string, name: string) => void
  addCategory: () => void
  removeCategory: (id: string) => void
  moveCategory: (id: string, direction: -1 | 1) => void
  addApp: (categoryId: string, app: { name: string } & AppIconPatch) => void
  renameApp: (categoryId: string, appId: string, name: string) => void
  removeApp: (categoryId: string, appId: string) => void
  setAppIcon: (categoryId: string, appId: string, icon: AppIconPatch) => void
  updateAppMeta: (
    categoryId: string,
    appId: string,
    patch: Partial<Pick<AppItem, 'note' | 'rating' | 'tags'>>,
    historyKey?: string,
  ) => void
  moveApp: (categoryId: string, appId: string, direction: -1 | 1) => void
  moveAppTo: (categoryId: string, appId: string, targetCategoryId: string, targetIndex: number) => void
  moveAppToCategory: (categoryId: string, appId: string, targetCategoryId: string) => void
  applyTemplate: (id: TemplateId) => void
  /** 载入 59 条 AI 创作者 / 信息源示例，并切换到「名录」模板 */
  loadAiIndex: () => void
  /** 载入空白名录，分类与条目由用户自行添加 */
  loadBlankIndex: () => void
  setRatio: (ratio: RatioId) => void
  /** 按当前软件数量重新计算编号/行距/图标大小，解决内容过多时的溢出 */
  fitCurrent: () => void
  resetBgAdjustments: () => void
  applyExportPreset: (ratio: RatioId, scale: 1 | 2 | 3, format: ExportFormat) => void
  undo: () => void
  redo: () => void
  importDoc: (doc: PosterDoc) => void
  resetAll: () => void
}

function withHistory(
  state: Pick<PosterStore, 'doc' | 'past' | 'future' | 'lastKey' | 'lastAt'>,
  next: PosterDoc,
  key: string | null,
): Partial<PosterStore> {
  if (next === state.doc) return {}
  const now = Date.now()
  const merge = key !== null && key === state.lastKey && now - state.lastAt < MERGE_WINDOW
  return {
    doc: next,
    past: merge ? state.past : [...state.past, state.doc].slice(-HISTORY_LIMIT),
    future: [],
    lastKey: key,
    lastAt: now,
  }
}

function mapCategory(doc: PosterDoc, id: string, update: (category: Category) => Category): PosterDoc {
  return {
    ...doc,
    categories: doc.categories.map((category) => (category.id === id ? update(category) : category)),
  }
}

export const usePosterStore = create<PosterStore>()(
  persist(
    (set) => ({
      doc: createDefaultDoc(),
      past: [],
      future: [],
      lastKey: null,
      lastAt: 0,

      setField: (key, value, historyKey) =>
        set((state) => {
          if (state.doc[key] === value) return {}
          return withHistory(state, { ...state.doc, [key]: value }, historyKey ?? String(key))
        }),

      setBackground: (id) =>
        set((state) => {
          const background = BACKGROUND_MAP.get(id)
          const paperTemplate =
            state.doc.templateId === 'cute' ||
            state.doc.templateId === 'magazine' ||
            state.doc.templateId === 'minimal' ||
            state.doc.templateId === 'journal' ||
            state.doc.templateId === 'brutalist' ||
            state.doc.templateId === 'newspaper' ||
            state.doc.templateId === 'index' ||
            state.doc.templateId === 'terminal'
          let color = state.doc.color
          let dim = state.doc.dim
          if (background) {
            if (!paperTemplate) {
              if (background.light && !isDarkColor(color)) color = '#232a25'
              if (!background.light && isDarkColor(color)) color = '#ffffff'
            }
            if (background.light) dim = Math.min(dim, 12)
          }
          return withHistory(state, { ...state.doc, bg: id, color, dim }, 'bg')
        }),

      useCustomBackground: () => set((state) => withHistory(state, { ...state.doc, bg: 'custom' }, 'bg')),

      applyCustomBackground: (dataUrl) =>
        set((state) => withHistory(state, { ...state.doc, customBg: dataUrl, bg: 'custom' }, 'custom-bg')),

      renameCategory: (id, name) =>
        set((state) =>
          withHistory(state, mapCategory(state.doc, id, (category) => ({ ...category, name })), `cat-${id}`),
        ),

      addCategory: () =>
        set((state) =>
          withHistory(
            state,
            {
              ...state.doc,
              categories: [...state.doc.categories, { id: uid('cat'), name: '新分类', apps: [] }],
            },
            'add-category',
          ),
        ),

      removeCategory: (id) =>
        set((state) => {
          if (state.doc.categories.length <= 1) return {}
          return withHistory(
            state,
            { ...state.doc, categories: state.doc.categories.filter((category) => category.id !== id) },
            'remove-category',
          )
        }),

      moveCategory: (id, direction) =>
        set((state) => {
          const index = state.doc.categories.findIndex((category) => category.id === id)
          const target = index + direction
          if (index < 0 || target < 0 || target >= state.doc.categories.length) return {}
          const categories = [...state.doc.categories]
          ;[categories[index], categories[target]] = [categories[target], categories[index]]
          return withHistory(state, { ...state.doc, categories }, 'move-category')
        }),

      addApp: (categoryId, app) =>
        set((state) =>
          withHistory(
            state,
            mapCategory(state.doc, categoryId, (category) => ({
              ...category,
              apps: [
                ...category.apps,
                {
                  id: uid('app'),
                  name: app.name.trim() || '未命名',
                  libraryId: app.libraryId,
                  iconSrc: app.iconSrc,
                  note: '',
                  rating: 0,
                  tags: [],
                },
              ],
            })),
            'add-app',
          ),
        ),

      renameApp: (categoryId, appId, name) =>
        set((state) =>
          withHistory(
            state,
            mapCategory(state.doc, categoryId, (category) => ({
              ...category,
              apps: category.apps.map((app) => (app.id === appId ? { ...app, name } : app)),
            })),
            `app-${appId}`,
          ),
        ),

      removeApp: (categoryId, appId) =>
        set((state) =>
          withHistory(
            state,
            mapCategory(state.doc, categoryId, (category) => ({
              ...category,
              apps: category.apps.filter((app) => app.id !== appId),
            })),
            'remove-app',
          ),
        ),

      setAppIcon: (categoryId, appId, icon) =>
        set((state) =>
          withHistory(
            state,
            mapCategory(state.doc, categoryId, (category) => ({
              ...category,
              apps: category.apps.map((app) =>
                app.id === appId ? { ...app, libraryId: icon.libraryId, iconSrc: icon.iconSrc } : app,
              ),
            })),
            'set-icon',
          ),
        ),

      moveApp: (categoryId, appId, direction) =>
        set((state) =>
          withHistory(
            state,
            mapCategory(state.doc, categoryId, (category) => {
              const index = category.apps.findIndex((app) => app.id === appId)
              const target = index + direction
              if (index < 0 || target < 0 || target >= category.apps.length) return category
              const apps = [...category.apps]
              ;[apps[index], apps[target]] = [apps[target], apps[index]]
              return { ...category, apps }
            }),
            'move-app',
          ),
        ),

      updateAppMeta: (categoryId, appId, patch, historyKey) =>
        set((state) =>
          withHistory(
            state,
            mapCategory(state.doc, categoryId, (category) => ({
              ...category,
              apps: category.apps.map((app) => (app.id === appId ? { ...app, ...patch } : app)),
            })),
            historyKey ?? `meta-${appId}`,
          ),
        ),

      moveAppTo: (categoryId, appId, targetCategoryId, targetIndex) =>
        set((state) => {
          const source = state.doc.categories.find((category) => category.id === categoryId)
          const app = source?.apps.find((item) => item.id === appId)
          if (!source || !app) return {}
          if (!state.doc.categories.some((category) => category.id === targetCategoryId)) return {}
          if (categoryId === targetCategoryId) {
            const sourceIndex = source.apps.findIndex((item) => item.id === appId)
            if (sourceIndex === targetIndex) return {}
            const same = [...source.apps]
            same.splice(sourceIndex, 1)
            const insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
            same.splice(Math.min(insertIndex, same.length), 0, app)
            return withHistory(
              state,
              mapCategory(state.doc, categoryId, (category) => ({ ...category, apps: same })),
              'move-app-drag',
            )
          }
          const categories = state.doc.categories.map((category) => {
            if (category.id === categoryId) {
              return { ...category, apps: category.apps.filter((item) => item.id !== appId) }
            }
            if (category.id === targetCategoryId) {
              const apps = [...category.apps]
              const index = Math.max(0, Math.min(targetIndex, apps.length))
              apps.splice(index, 0, app)
              return { ...category, apps }
            }
            return category
          })
          return withHistory(state, { ...state.doc, categories }, 'move-app-drag')
        }),

      moveAppToCategory: (categoryId, appId, targetCategoryId) =>
        set((state) => {
          if (categoryId === targetCategoryId) return {}
          const source = state.doc.categories.find((category) => category.id === categoryId)
          const app = source?.apps.find((item) => item.id === appId)
          if (!app) return {}
          return withHistory(
            state,
            {
              ...state.doc,
              categories: state.doc.categories.map((category) => {
                if (category.id === categoryId) {
                  return { ...category, apps: category.apps.filter((item) => item.id !== appId) }
                }
                if (category.id === targetCategoryId) {
                  return { ...category, apps: [...category.apps, app] }
                }
                return category
              }),
            },
            'move-app-category',
          )
        }),

      applyTemplate: (id) =>
        set((state) => {
          const layout = resolveTemplateLayout(id, state.doc.ratio, state.doc.categories)
          return withHistory(state, { ...state.doc, templateId: id, ...layout }, 'template')
        }),

      loadAiIndex: () => set((state) => withHistory(state, createAiIndexDoc(), 'load-ai-index')),

      loadBlankIndex: () =>
        set((state) => {
          const doc = createAiIndexDoc()
          return withHistory(
            state,
            {
              ...doc,
              title: '我的名录',
              categories: [{ id: uid('cat'), name: '新分类', apps: [] }],
            },
            'load-blank-index',
          )
        }),

      setRatio: (ratio) =>
        set((state) => {
          getCanvas(ratio)
          const layout = resolveTemplateLayout(state.doc.templateId, ratio, state.doc.categories)
          return withHistory(state, { ...state.doc, ratio, ...layout }, 'ratio')
        }),

      fitCurrent: () =>
        set((state) => {
          const layout = resolveTemplateLayout(state.doc.templateId, state.doc.ratio, state.doc.categories)
          return withHistory(state, { ...state.doc, ...layout }, 'fit')
        }),

      resetBgAdjustments: () =>
        set((state) =>
          withHistory(
            state,
            {
              ...state.doc,
              bgZoom: 100,
              bgX: 50,
              bgY: 50,
              bgBlur: 0,
              bgOpacity: 100,
              bgTintOpacity: 0,
            },
            'bg-reset',
          ),
        ),

      applyExportPreset: (ratio, scale, format) =>
        set((state) => {
          const layout = resolveTemplateLayout(state.doc.templateId, ratio, state.doc.categories)
          return withHistory(
            state,
            { ...state.doc, ratio, ...layout, exportScale: scale, exportFormat: format },
            'preset',
          )
        }),

      undo: () =>
        set((state) => {
          if (!state.past.length) return {}
          const previous = state.past[state.past.length - 1]
          return {
            doc: previous,
            past: state.past.slice(0, -1),
            future: [state.doc, ...state.future].slice(0, HISTORY_LIMIT),
            lastKey: null,
            lastAt: 0,
          }
        }),

      redo: () =>
        set((state) => {
          if (!state.future.length) return {}
          const [next, ...rest] = state.future
          return {
            doc: next,
            past: [...state.past, state.doc].slice(-HISTORY_LIMIT),
            future: rest,
            lastKey: null,
            lastAt: 0,
          }
        }),

      importDoc: (doc) => {
        // 草稿、项目文件、旧版本数据都可能缺字段，统一过一遍校验再落地
        let next = doc
        try {
          next = sanitizeDoc(doc)
        } catch {
          next = doc
        }
        set({ doc: next, past: [], future: [], lastKey: null, lastAt: 0 })
      },

      resetAll: () => set({ doc: createDefaultDoc(), past: [], future: [], lastKey: null, lastAt: 0 }),
    }),
    {
      name: 'annual-apps-studio-v2',
      version: 3,
      migrate: (persisted) => {
        const state = persisted as { doc?: Partial<PosterDoc> }
        if (state?.doc) {
          state.doc.ratio = getCanvas((state.doc.ratio as RatioId) ?? '16:9').id
          state.doc.exportFormat =
            state.doc.exportFormat === 'jpg' || state.doc.exportFormat === 'webp'
              ? state.doc.exportFormat
              : 'png'
        }
        return state
      },
      storage: createJSONStorage(() => idbStorage),
      merge: (persisted, current) => {
        try {
          const doc = sanitizeDoc((persisted as { doc?: unknown })?.doc)
          return { ...current, doc }
        } catch {
          return current
        }
      },
      partialize: (state) => ({ doc: state.doc }),
    },
  ),
)
