export type RatioId = '16:9' | '4:5' | '3:4' | '1:1' | '9:16' | '2:3'

export type CanvasRatio = {
  id: RatioId
  name: string
  width: number
  height: number
  hint: string
}

export const RATIOS: CanvasRatio[] = [
  { id: '16:9', name: '横版', width: 1600, height: 900, hint: '16:9 · 分享横图' },
  { id: '4:5', name: '竖版', width: 1600, height: 2000, hint: '4:5 · 小红书 / Instagram' },
  { id: '3:4', name: '竖版', width: 1200, height: 1600, hint: '3:4 · 社交竖图' },
  { id: '1:1', name: '方形', width: 1600, height: 1600, hint: '1:1 · 方图 / 头像' },
  { id: '9:16', name: '长图', width: 1080, height: 1920, hint: '9:16 · 手机故事 / 壁纸' },
  { id: '2:3', name: '长竖', width: 1200, height: 1800, hint: '2:3 · 印刷 / 长图' },
]

export const RATIO_MAP = new Map(RATIOS.map((ratio) => [ratio.id, ratio]))

export function getCanvas(ratio: RatioId) {
  return RATIO_MAP.get(ratio) ?? RATIOS[0]
}

export function ratioClass(ratio: RatioId) {
  return `ratio-${ratio.replace(':', 'x')}`
}

export type LayoutBounds = {
  columns: [number, number]
  iconSize: [number, number]
  gapX: [number, number]
  gapY: [number, number]
  startX: [number, number]
  startY: [number, number]
  titleSize: [number, number]
  catSize: [number, number]
  nameSize: [number, number]
}

/**
 * 画幅对应的参数取值范围。
 *
 * 历史版本的 sanitizeDoc 对所有画幅使用同一组固定上下限（gapY ≤ 240、startY ≤ 330），
 * 而 4:5 / 3:4 / 1:1 / 9:16 / 2:3 的默认排版本来就会超出这个范围，
 * 导致刷新、恢复草稿或导入项目后竖版布局被强制压回 16:9 的参数。
 * 这里改为按画布尺寸推导上限：既能拦住明显的非法值，也不会覆盖正常排版。
 */
export function getLayoutBounds(ratio: RatioId): LayoutBounds {
  const { width, height } = getCanvas(ratio)
  const side = Math.min(width, height)
  return {
    columns: [3, 8],
    iconSize: [32, Math.round(side * 0.32)],
    gapX: [72, Math.round(width * 1.2)],
    gapY: [64, Math.round(height * 1.4)],
    startX: [0, Math.round(width * 0.92)],
    startY: [0, Math.round(height * 0.92)],
    titleSize: [24, Math.round(width * 0.22)],
    catSize: [10, Math.round(side * 0.16)],
    nameSize: [6, Math.round(side * 0.08)],
  }
}

/** 每种画幅适合的图标列数：竖图少一列，横图多一列 */
export const RATIO_COLUMNS: Record<RatioId, number> = {
  '16:9': 6,
  '4:5': 5,
  '3:4': 4,
  '1:1': 5,
  '9:16': 4,
  '2:3': 4,
}

/** 画幅的排版基准：左右留白、标题区高度、底部留白（设计像素） */
export const RATIO_FRAME: Record<RatioId, { padX: number; titleY: number; titleBlock: number; bottom: number }> = {
  '16:9': { padX: 72, titleY: 134, titleBlock: 118, bottom: 76 },
  '4:5': { padX: 88, titleY: 190, titleBlock: 150, bottom: 96 },
  '3:4': { padX: 72, titleY: 160, titleBlock: 132, bottom: 84 },
  '1:1': { padX: 80, titleY: 160, titleBlock: 140, bottom: 92 },
  '9:16': { padX: 56, titleY: 150, titleBlock: 132, bottom: 84 },
  '2:3': { padX: 72, titleY: 176, titleBlock: 142, bottom: 90 },
}

/** 画幅推荐的内容行数，用于模板切换时的初始排版 */
export const RATIO_ROWS: Record<RatioId, number> = {
  '16:9': 4,
  '4:5': 6,
  '3:4': 5,
  '1:1': 5,
  '9:16': 7,
  '2:3': 6,
}
