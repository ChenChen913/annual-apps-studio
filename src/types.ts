import type { RatioId } from './data/ratios'

export type TemplateId =
  | 'elegant'
  | 'pixel'
  | 'cute'
  | 'magazine'
  | 'minimal'
  | 'cyber'
  | 'journal'
  | 'brutalist'
  | 'terminal'
  | 'y2k'
  | 'film'
  | 'newspaper'

export type ExportFormat = 'png' | 'jpg' | 'webp'

export type AppItem = {
  id: string
  name: string
  /** 内置图标库的 id；上传图标时为 null */
  libraryId: string | null
  /** 上传处理后的图片 data URL；使用内置图标时为 null */
  iconSrc: string | null
  note: string
  rating: number
  tags: string[]
}

export type Category = {
  id: string
  name: string
  apps: AppItem[]
}

export type PosterDoc = {
  schemaVersion: 2
  title: string
  templateId: TemplateId
  ratio: RatioId
  exportFormat: ExportFormat
  bg: string
  customBg: string | null
  dim: number
  color: string
  names: boolean
  shadow: boolean
  showMeta: boolean
  iconShape: 'squircle' | 'circle'
  columns: number
  iconSize: number
  gapX: number
  gapY: number
  startX: number
  startY: number
  titleSize: number
  catSize: number
  nameSize: number
  exportScale: 1 | 2 | 3
  categories: Category[]
}

export type ProjectFile = {
  kind: 'annual-apps-project'
  schemaVersion: 2
  savedAt: string
  doc: PosterDoc
}

export type CategoryView = {
  id: string
  name: string
  apps: {
    id: string
    name: string
    src: string | null
    note: string
    rating: number
    tags: string[]
  }[]
}
