import type { RatioId } from './ratios'
import { getCanvas, RATIO_COLUMNS, RATIO_FRAME } from './ratios'
import { computeFit, countRows } from '../lib/layout'
import type { Category, PosterDoc, TemplateId } from '../types'

export type TemplateDefaults = {
  columns: number
  color: string
  dim: number
  shadow: boolean
  titleSize: number
  catSize: number
  nameSize: number
  iconSize: number
  gapX: number
  gapY: number
  startX: number
  startY: number
}

export type TemplateDefinition = {
  id: TemplateId
  name: string
  english: string
  description: string
  tags: string[]
  recommendBg: string
  recommendBgName: string
  defaults: TemplateDefaults
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'elegant',
    name: '雅致',
    english: 'ELEGANT',
    description: '克制、编辑感、安静的纸张气质，霞鹜文楷标题。',
    tags: ['默认', '夜灯'],
    recommendBg: 'forest',
    recommendBgName: '林间夜灯',
    defaults: {
      columns: 6,
      color: '#ffffff',
      dim: 34,
      shadow: true,
      titleSize: 78,
      catSize: 31,
      nameSize: 16,
      iconSize: 100,
      gapX: 232,
      gapY: 160,
      startX: 248,
      startY: 210,
    },
  },
  {
    id: 'index',
    name: '名录',
    english: 'INDEX',
    description: '图片背景的索引式大海报，左侧分类标签 + 八列头像网格；分类、条目、信息站网址都可增删改。',
    tags: ['AI', '名录', '可编辑'],
    recommendBg: 'photo-forestfog-tall',
    recommendBgName: '雾锁林间',
    defaults: {
      columns: 8,
      color: '#ffffff',
      dim: 30,
      shadow: true,
      titleSize: 82,
      catSize: 32,
      nameSize: 16,
      iconSize: 88,
      gapX: 176,
      gapY: 166,
      startX: 88,
      startY: 310,
    },
  },
  {
    id: 'pixel',
    name: '像素',
    english: 'PIXEL',
    description: '8-bit 游戏机界面，HUD 分类条、扫描线和硬朗描边。',
    tags: ['复古', '游戏'],
    recommendBg: 'midnight',
    recommendBgName: '午夜蓝',
    defaults: {
      columns: 6,
      color: '#eaf6ff',
      dim: 20,
      shadow: false,
      titleSize: 64,
      catSize: 22,
      nameSize: 14,
      iconSize: 84,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'cute',
    name: '可爱',
    english: 'CUTE',
    description: '奶油色贴纸卡片、圆角与轻微旋转，轻松的手账感。',
    tags: ['贴纸', '手账'],
    recommendBg: 'blush',
    recommendBgName: '浅粉',
    defaults: {
      columns: 5,
      color: '#4c3b45',
      dim: 0,
      shadow: false,
      titleSize: 68,
      catSize: 22,
      nameSize: 14,
      iconSize: 74,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'magazine',
    name: '杂志',
    english: 'MAGAZINE',
    description: '封面专题排版，衬线大标题、期号与细分割线。',
    tags: ['封面', '编辑'],
    recommendBg: 'coast',
    recommendBgName: '海岸',
    defaults: {
      columns: 5,
      color: '#232a25',
      dim: 20,
      shadow: false,
      titleSize: 96,
      catSize: 20,
      nameSize: 14,
      iconSize: 96,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'minimal',
    name: '极简',
    english: 'MINIMAL',
    description: '大量留白、细线与小字号，把注意力全部留给图标。',
    tags: ['白', '秩序'],
    recommendBg: 'paper',
    recommendBgName: '米白纸',
    defaults: {
      columns: 5,
      color: '#232a25',
      dim: 0,
      shadow: false,
      titleSize: 62,
      catSize: 17,
      nameSize: 13,
      iconSize: 92,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'cyber',
    name: '赛博',
    english: 'CYBER',
    description: '深色终端、霓虹描边、网格与 HUD 角标。',
    tags: ['终端', '霓虹'],
    recommendBg: 'night',
    recommendBgName: '城市夜眺',
    defaults: {
      columns: 5,
      color: '#c9fff3',
      dim: 38,
      shadow: false,
      titleSize: 60,
      catSize: 20,
      nameSize: 14,
      iconSize: 78,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'journal',
    name: '手账',
    english: 'JOURNAL',
    description: '米色纸、胶带标题与拍立得卡片，像一页贴好的手账。',
    tags: ['纸张', '贴纸'],
    recommendBg: 'paper',
    recommendBgName: '米白纸',
    defaults: {
      columns: 5,
      color: '#4a3b33',
      dim: 0,
      shadow: true,
      titleSize: 72,
      catSize: 23,
      nameSize: 14,
      iconSize: 84,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'brutalist',
    name: '新粗野',
    english: 'BRUTAL',
    description: '粗黑边、硬阴影、荧光色块，态度直接的海报。',
    tags: ['高饱和', '潮流'],
    recommendBg: 'blush',
    recommendBgName: '浅粉',
    defaults: {
      columns: 5,
      color: '#17150f',
      dim: 0,
      shadow: false,
      titleSize: 78,
      catSize: 22,
      nameSize: 14,
      iconSize: 80,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'terminal',
    name: '终端',
    english: 'TERMINAL',
    description: '黑底绿字的命令行清单，带光标、路径和 ASCII 框。',
    tags: ['开发者', 'CLI'],
    recommendBg: 'ink',
    recommendBgName: '墨黑',
    defaults: {
      columns: 5,
      color: '#9dffbf',
      dim: 45,
      shadow: false,
      titleSize: 54,
      catSize: 19,
      nameSize: 15,
      iconSize: 52,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'y2k',
    name: 'Y2K',
    english: 'Y2K',
    description: '铬合金渐变、气泡字与闪光贴纸，千禧年未来感。',
    tags: ['千禧', '金属'],
    recommendBg: 'mesh',
    recommendBgName: '渐变',
    defaults: {
      columns: 5,
      color: '#f6f9ff',
      dim: 26,
      shadow: true,
      titleSize: 76,
      catSize: 24,
      nameSize: 14,
      iconSize: 68,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'film',
    name: '电影',
    english: 'FILM',
    description: '宽银幕黑边、主创名单式排版，像一张年度电影海报。',
    tags: ['银幕', '大片'],
    recommendBg: 'night',
    recommendBgName: '城市夜眺',
    defaults: {
      columns: 5,
      color: '#f3ecd9',
      dim: 46,
      shadow: false,
      titleSize: 78,
      catSize: 18,
      nameSize: 12,
      iconSize: 72,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
  {
    id: 'newspaper',
    name: '报纸',
    english: 'PRESS',
    description: '新闻纸、报头与分栏，把年度软件做成一份特刊。',
    tags: ['纸张', '分栏'],
    recommendBg: 'paper',
    recommendBgName: '米白纸',
    defaults: {
      columns: 5,
      color: '#241f1a',
      dim: 6,
      shadow: false,
      titleSize: 96,
      catSize: 20,
      nameSize: 13,
      iconSize: 70,
      gapX: 232,
      gapY: 164,
      startX: 248,
      startY: 254,
    },
  },
]

export const TEMPLATE_MAP = new Map(TEMPLATES.map((template) => [template.id, template]))

export function getTemplate(id: TemplateId): TemplateDefinition {
  return TEMPLATE_MAP.get(id) ?? TEMPLATES[0]
}

/**
 * 模板切换或画幅切换时，套用当前画幅下的默认排版。
 *
 * 旧实现只给「雅致」写了逐画幅坐标，其余模板无论什么画幅都用 16:9 的固定参数，
 * 竖版会出现标题下方留白过大、内容被裁切。这里统一按画布尺寸与当前内容行数推导。
 */
export function resolveTemplateLayout(
  id: TemplateId,
  ratio: RatioId,
  categories?: Category[],
): TemplateDefaults {
  const template = getTemplate(id)
  const canvas = getCanvas(ratio)
  const frame = RATIO_FRAME[ratio]
  const scale = Math.min(1.06, Math.max(0.72, canvas.width / 1600))

  const columns = id === 'index'
    ? ({ '16:9': 8, '4:5': 8, '3:4': 6, '1:1': 7, '9:16': 5, '2:3': 5 } as Record<RatioId, number>)[ratio]
    : Math.min(8, Math.max(3, RATIO_COLUMNS[ratio]))
  const titleSize = Math.round(template.defaults.titleSize * scale)
  const catSize = Math.max(12, Math.round(template.defaults.catSize * scale))
  const nameSize = Math.max(9, Math.round(template.defaults.nameSize * scale))
  const cellW = (canvas.width - frame.padX * 2) / columns
  const iconSize = Math.min(
    Math.round(template.defaults.iconSize * scale),
    Math.round(cellW * 0.78),
  )
  const startX = id === 'index'
    ? frame.padX
    : Math.round(frame.padX + Math.max(0, cellW * 0.12))
  const startY = id === 'index'
    ? ({ '16:9': 230, '4:5': 310, '3:4': 280, '1:1': 280, '9:16': 250, '2:3': 300 } as Record<RatioId, number>)[ratio]
    : Math.round(frame.titleY + titleSize * 1.05 + 26)
  const gapX = Math.round(cellW)

  const totalApps = categories?.reduce((total, category) => total + category.apps.length, 0) ?? 0
  const rows = categories
    ? id === 'index'
      ? Math.max(1, Math.ceil(totalApps / columns))
      : countRows(categories, columns)
    : 0
  const available = canvas.height - startY - frame.bottom
  const perRow = rows ? available / rows : 160
  const gapY = Math.round(
    Math.max(iconSize + nameSize * 2 + 30, Math.min(perRow, iconSize + nameSize * 2 + 168)),
  )

  const base: TemplateDefaults = {
    ...template.defaults,
    columns,
    titleSize,
    catSize,
    nameSize,
    iconSize,
    gapX,
    gapY,
    startX,
    startY,
  }

  if (!categories) return base

  const candidate = {
    ...createLayoutDoc(base, ratio, id),
    categories,
  } as PosterDoc
  const fit = computeFit(candidate as PosterDoc)
  return {
    ...base,
    iconSize: fit.iconSize,
    gapY: fit.gapY,
    startY: id === 'elegant' ? fit.startY : base.startY,
  }
}

function createLayoutDoc(layout: TemplateDefaults, ratio: RatioId, templateId: TemplateId): PosterDoc {
  return {
    schemaVersion: 3,
    ...layout,
    title: '',
    templateId,
    ratio,
    exportFormat: 'png',
    bg: 'forest',
    customBg: null,
    bgZoom: 100,
    bgX: 50,
    bgY: 50,
    bgBlur: 0,
    bgOpacity: 100,
    bgTint: '#0b1220',
    bgTintOpacity: 0,
    names: true,
    showMeta: false,
    iconShape: 'squircle',
    exportScale: 2,
    categories: [],
  }
}
