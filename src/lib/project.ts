import { getTemplate } from '../data/templates'
import { createDefaultDoc } from '../data/defaultProject'
import { getCanvas } from '../data/ratios'
import { uid } from './id'
import type { AppItem, Category, ExportFormat, PosterDoc, ProjectFile, TemplateId } from '../types'

const TEMPLATE_IDS: TemplateId[] = [
  'elegant',
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

  const color = typeof raw.color === 'string' && /^#[0-9a-f]{6}$/i.test(raw.color) ? raw.color : fallback.color
  const ratio = getCanvas(typeof raw.ratio === 'string' ? (raw.ratio as never) : '16:9').id
  const exportFormat: ExportFormat =
    raw.exportFormat === 'jpg' || raw.exportFormat === 'webp' ? raw.exportFormat : 'png'

  return {
    schemaVersion: 2,
    title: text(raw.title, defaults.title).slice(0, 60),
    templateId,
    ratio,
    exportFormat,
    bg: text(raw.bg, defaults.bg),
    customBg: typeof raw.customBg === 'string' && raw.customBg.startsWith('data:image/') ? raw.customBg : null,
    dim: clampNumber(raw.dim, fallback.dim, 0, 65),
    color,
    names: typeof raw.names === 'boolean' ? raw.names : true,
    shadow: typeof raw.shadow === 'boolean' ? raw.shadow : fallback.shadow,
    showMeta: typeof raw.showMeta === 'boolean' ? raw.showMeta : false,
    iconShape: raw.iconShape === 'circle' ? 'circle' : 'squircle',
    columns: clampNumber(raw.columns, fallback.columns, 3, 6),
    iconSize: clampNumber(raw.iconSize, fallback.iconSize, 72, 140),
    gapX: clampNumber(raw.gapX, fallback.gapX, 140, 270),
    gapY: clampNumber(raw.gapY, fallback.gapY, 130, 240),
    startX: clampNumber(raw.startX, fallback.startX, 180, 380),
    startY: clampNumber(raw.startY, fallback.startY, 200, 330),
    titleSize: clampNumber(raw.titleSize, fallback.titleSize, 54, 110),
    catSize: clampNumber(raw.catSize, fallback.catSize, 20, 44),
    nameSize: clampNumber(raw.nameSize, fallback.nameSize, 10, 26),
    exportScale: raw.exportScale === 1 || raw.exportScale === 3 ? raw.exportScale : 2,
    categories,
  }
}

export function createProjectFile(doc: PosterDoc): ProjectFile {
  return {
    kind: 'annual-apps-project',
    schemaVersion: 2,
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
