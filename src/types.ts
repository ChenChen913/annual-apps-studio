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

/**
 * 海报文档。schemaVersion 3 在 v2 基础上加入了背景位置 / 缩放 / 模糊 / 透明度 / 叠色，
 * 迁移逻辑见 lib/project.ts 的 sanitizeDoc（旧版本缺少的字段会取默认值）。
 */
export type PosterDoc = {
  schemaVersion: 3
  title: string
  templateId: TemplateId
  ratio: RatioId
  exportFormat: ExportFormat
  bg: string
  customBg: string | null
  dim: number
  /** 背景缩放，100 = 铺满 */
  bgZoom: number
  /** 背景水平位置，0-100（%），50 居中 */
  bgX: number
  /** 背景垂直位置，0-100（%），50 居中 */
  bgY: number
  /** 背景模糊，设计像素 */
  bgBlur: number
  /** 背景不透明度，0-100 */
  bgOpacity: number
  /** 叠色，十六进制 */
  bgTint: string
  /** 叠色强度，0-100 */
  bgTintOpacity: number
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
  schemaVersion: 3
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
