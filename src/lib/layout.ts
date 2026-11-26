import { getCanvas, RATIO_FRAME } from '../data/ratios'
import type { Category, PosterDoc, TemplateId } from '../types'

export type LayoutFit = {
  columns: number
  rows: number
  iconSize: number
  titleSize: number
  catSize: number
  nameSize: number
  /** 模板切换时的推荐行距（仅绝对定位模板使用） */
  gapY: number
  /** 模板切换时的推荐首行 Y（仅绝对定位模板使用） */
  startY: number
  /** 内容在当前画幅下是否仍然装不下 */
  overflow: boolean
  /** 是否因为内容过多而自动缩小了图标 */
  shrunk: boolean
}

export function countRows(categories: Category[], columns: number): number {
  const safeColumns = Math.max(1, columns)
  return categories.reduce(
    (total, category) => total + Math.max(1, Math.ceil(category.apps.length / safeColumns)),
    0,
  )
}

/**
 * 流程式模板（内容自上而下排列）的固定占位：
 * top 为标题区高度，bottom 为页脚与边距，均以设计像素计，和 CSS 中的内边距保持同一量级。
 */
const FLOW_CHROME: Record<TemplateId, { top: number; bottom: number; labelGap: number }> = {
  elegant: { top: 0, bottom: 0, labelGap: 0 },
  pixel: { top: 208, bottom: 58, labelGap: 8 },
  cute: { top: 210, bottom: 90, labelGap: 10 },
  magazine: { top: 150, bottom: 100, labelGap: 8 },
  minimal: { top: 190, bottom: 96, labelGap: 10 },
  cyber: { top: 214, bottom: 76, labelGap: 10 },
  journal: { top: 224, bottom: 96, labelGap: 12 },
  brutalist: { top: 196, bottom: 92, labelGap: 10 },
  terminal: { top: 214, bottom: 82, labelGap: 8 },
  y2k: { top: 226, bottom: 92, labelGap: 10 },
  film: { top: 218, bottom: 100, labelGap: 10 },
  newspaper: { top: 300, bottom: 96, labelGap: 8 },
}

const MIN_ICON = 42

export function computeFit(doc: PosterDoc): LayoutFit {
  const canvas = getCanvas(doc.ratio)
  const columns = doc.columns
  const rows = countRows(doc.categories, columns)
  const frame = RATIO_FRAME[doc.ratio]
  const chrome = FLOW_CHROME[doc.templateId] ?? FLOW_CHROME.elegant

  if (doc.templateId === 'elegant') {
    const available = Math.max(120, canvas.height - doc.startY - frame.bottom)
    const rowCount = Math.max(rows, 1)
    const perRow = available / rowCount
    // 先按行高反推图标大小，再让每行正好占满可用高度，避免底部越界或中段挤在一起
    const iconSize = Math.max(
      MIN_ICON,
      Math.min(doc.iconSize, Math.round(perRow - doc.nameSize * 2 - 30)),
    )
    const gapY = Math.max(80, Math.min(480, Math.round(perRow)))
    const used = gapY * rowCount
    return {
      columns,
      rows,
      iconSize,
      titleSize: doc.titleSize,
      catSize: doc.catSize,
      nameSize: doc.nameSize,
      gapY,
      startY: Math.round(doc.startY + Math.max(0, (available - used) / 2)),
      overflow: perRow < iconSize + doc.nameSize * 2 + 10,
      shrunk: iconSize < doc.iconSize,
    }
  }

  const available = Math.max(120, canvas.height - chrome.top - chrome.bottom)
  const label = doc.names ? doc.nameSize + chrome.labelGap : 0
  const perRow = available / Math.max(rows, 1)
  const room = perRow - label - 14
  // 只对已经验证过「放大后仍能装下」的留白模板做 9:16 放大；
  // pixel / film / brutalist 等绝对定位模板保持原尺寸，避免底部分类被裁切。
  const PORTRAIT_BOOST: Partial<Record<TemplateId, number>> = {
    cute: 1.6,
    journal: 1.6,
    magazine: 1.6,
    newspaper: 1.5,
    minimal: 1.6,
    pixel: 1.8,
    cyber: 1.8,
  }
  const portraitBoost = doc.ratio === '9:16' ? (PORTRAIT_BOOST[doc.templateId] ?? 1) : 1
  const columnCap = Math.round((canvas.width / Math.max(columns, 1)) * 0.68)
  const preferred = Math.min(Math.round(doc.iconSize * portraitBoost), columnCap)
  const iconSize = Math.max(MIN_ICON, Math.min(preferred, Math.round(room)))
  const needHeight = rows * (iconSize + label + 14)
  return {
    columns,
    rows,
    iconSize,
    titleSize: doc.titleSize,
    catSize: doc.catSize,
    nameSize: doc.nameSize,
    gapY: Math.round(perRow),
    startY: chrome.top,
    overflow: needHeight > available + 12,
    shrunk: iconSize < doc.iconSize,
  }
}

export function titleRoom(doc: PosterDoc): number {
  const frame = RATIO_FRAME[doc.ratio]
  return frame.titleY + doc.titleSize * 1.06 + frame.titleBlock * 0.55
}
