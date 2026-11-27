import { BACKGROUND_MAP } from '../data/backgrounds'
import { getCanvas, getLayoutBounds, type RatioId } from '../data/ratios'
import { getTemplate } from '../data/templates'
import { createDefaultDoc } from '../data/defaultProject'
import { uid } from './id'
import type { AppItem, Category, ExportFormat, PosterDoc, ProjectFile, TemplateId } from '../types'

const TEMPLATE_IDS: TemplateId[] = [
  'elegant',
  'index',
  'pixel',
  'cute',
  'magazine',
  'minimal',
  'cyber',
  'journal',
  'brutalist',
  'terminal',
  'y2k',
  'film',
  'newspaper',
]

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function text(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function hexColor(value: unknown, fallback: string) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}

function sanitizeApp(input: unknown): AppItem | null {
  if (!input || typeof input !== 'object') return null
  const app = input as Record<string, unknown>
  const name = text(app.name, '').slice(0, 30)
  const libraryId = typeof app.libraryId === 'string' ? app.libraryId : null
  const iconSrc = typeof app.iconSrc === 'string' && app.iconSrc.startsWith('data:image/') ? app.iconSrc : null
  const tags = Array.isArray(app.tags)
    ? app.tags
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => tag.trim().slice(0, 12))
        .filter(Boolean)
        .slice(0, 3)
    : []
  const rating = clampNumber(app.rating, 0, 0, 5)
  if (!name && !libraryId && !iconSrc) return null
  return {
    id: typeof app.id === 'string' && app.id ? app.id : uid('app'),
    name: name || '未命名',
    libraryId,
    iconSrc,
    note: text(app.note, '').slice(0, 90),
    rating: Math.round(rating),
    tags,
  }
}

function sanitizeCategory(input: unknown): Category | null {
  if (!input || typeof input !== 'object') return null
  const category = input as Record<string, unknown>
  const apps = Array.isArray(category.apps)
    ? category.apps.map(sanitizeApp).filter((app): app is AppItem => app !== null)
    : []
  return {
    id: typeof category.id === 'string' && category.id ? category.id : uid('cat'),
    name: text(category.name, '未命名分类').slice(0, 20),
    apps,
  }
}

/**
 * 把任意来源的数据（本地缓存、草稿、导入文件）整理成合法的海报文档。
 *
 * 排版参数的上下限按当前画幅推导（见 getLayoutBounds），而不是用一套固定数值，
 * 否则竖版画幅的默认 gapY / startY 会在刷新或导入后被压回 16:9 的范围。
 * v2 项目文件缺少背景位置等字段，这里补默认值，旧数据不会丢。
 */
export function sanitizeDoc(input: unknown): PosterDoc {
  if (!input || typeof input !== 'object') throw new Error('项目文件内容为空或格式不正确')
  let raw = input as Record<string, unknown>
  if (raw.kind === 'annual-apps-project' && raw.doc && typeof raw.doc === 'object') {
    raw = raw.doc as Record<string, unknown>
  } else if (raw.doc && typeof raw.doc === 'object' && !Array.isArray(raw.categories)) {
    raw = raw.doc as Record<string, unknown>
  }

  if (!Array.isArray(raw.categories)) throw new Error('项目文件缺少分类数据')

  const categories = raw.categories
    .map(sanitizeCategory)
    .filter((category): category is Category => category !== null)

  if (!categories.length) throw new Error('项目文件里没有可用的分类')

  const defaults = createDefaultDoc()
  const templateId = TEMPLATE_IDS.includes(raw.templateId as TemplateId)
    ? (raw.templateId as TemplateId)
    : 'elegant'
  const template = getTemplate(templateId)
  const fallback = template.defaults

  const color = hexColor(raw.color, fallback.color)
  const ratio = getCanvas(typeof raw.ratio === 'string' ? (raw.ratio as never) : '16:9').id
  const exportFormat: ExportFormat =
    raw.exportFormat === 'jpg' || raw.exportFormat === 'webp' ? raw.exportFormat : 'png'
  const bounds = getLayoutBounds(ratio)
  const bgId = typeof raw.bg === 'string' ? raw.bg : defaults.bg
  const bg = bgId === 'custom' || BACKGROUND_MAP.has(bgId) ? bgId : defaults.bg

  return {
    schemaVersion: 3,
    title: text(raw.title, defaults.title).slice(0, 60),
    templateId,
    ratio,
    exportFormat,
    bg,
    customBg: typeof raw.customBg === 'string' && raw.customBg.startsWith('data:image/') ? raw.customBg : null,
    dim: clampNumber(raw.dim, fallback.dim, 0, 65),
    bgZoom: clampNumber(raw.bgZoom, 100, 100, 220),
    bgX: clampNumber(raw.bgX, 50, 0, 100),
    bgY: clampNumber(raw.bgY, 50, 0, 100),
    bgBlur: clampNumber(raw.bgBlur, 0, 0, 32),
    bgOpacity: clampNumber(raw.bgOpacity, 100, 0, 100),
    bgTint: hexColor(raw.bgTint, defaults.bgTint),
    bgTintOpacity: clampNumber(raw.bgTintOpacity, 0, 0, 100),
    color,
    names: typeof raw.names === 'boolean' ? raw.names : true,
    shadow: typeof raw.shadow === 'boolean' ? raw.shadow : fallback.shadow,
    showMeta: typeof raw.showMeta === 'boolean' ? raw.showMeta : false,
    iconShape: raw.iconShape === 'circle' ? 'circle' : 'squircle',
    columns: Math.round(
      clampNumber(raw.columns, fallback.columns, bounds.columns[0], bounds.columns[1]),
    ),
    iconSize: Math.round(
      clampNumber(raw.iconSize, fallback.iconSize, bounds.iconSize[0], bounds.iconSize[1]),
    ),
    gapX: Math.round(clampNumber(raw.gapX, fallback.gapX, bounds.gapX[0], bounds.gapX[1])),
    gapY: Math.round(clampNumber(raw.gapY, fallback.gapY, bounds.gapY[0], bounds.gapY[1])),
    startX: Math.round(clampNumber(raw.startX, fallback.startX, bounds.startX[0], bounds.startX[1])),
    startY: Math.round(clampNumber(raw.startY, fallback.startY, bounds.startY[0], bounds.startY[1])),
    titleSize: Math.round(
      clampNumber(raw.titleSize, fallback.titleSize, bounds.titleSize[0], bounds.titleSize[1]),
    ),
    catSize: Math.round(clampNumber(raw.catSize, fallback.catSize, bounds.catSize[0], bounds.catSize[1])),
    nameSize: Math.round(
      clampNumber(raw.nameSize, fallback.nameSize, bounds.nameSize[0], bounds.nameSize[1]),
    ),
    exportScale: raw.exportScale === 1 || raw.exportScale === 3 ? raw.exportScale : 2,
    categories,
  }
}

export function createProjectFile(doc: PosterDoc): ProjectFile {
  return {
    kind: 'annual-apps-project',
    schemaVersion: 3,
    savedAt: new Date().toISOString(),
    doc,
  }
}

export function projectFileName(doc: PosterDoc) {
  const safe = (doc.title || '我的年度软件').replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '-').slice(0, 40)
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  return `${safe}-${date}.yearapps`
}

export function downloadProjectFile(doc: PosterDoc) {
  const blob = new Blob([JSON.stringify(createProjectFile(doc), null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = projectFileName(doc)
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function readProjectFile(file: File): Promise<PosterDoc> {
  const content = await file.text()
  let data: unknown
  try {
    data = JSON.parse(content)
  } catch {
    throw new Error('文件不是有效的 JSON，可能已损坏')
  }
  return sanitizeDoc(data)
}

/** 旧版本草稿（v2）也能载入：补齐新增的背景参数并做同样的范围校验 */
export function migrateDoc(input: unknown): PosterDoc | null {
  try {
    return sanitizeDoc(input)
  } catch {
    return null
  }
}

export function ratioOf(doc: PosterDoc): RatioId {
  return doc.ratio
}
