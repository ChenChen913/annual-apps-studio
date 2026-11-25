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

export type RatioLayout = {
  columns: number
  iconSize: number
  gapX: number
  gapY: number
  startX: number
  startY: number
  titleSize: number
  catSize: number
  nameSize: number
}
/** 雅致模板在各画幅下的默认坐标，保证内容不挤在顶部 */
export const ELEGANT_RATIO_LAYOUT: Record<RatioId, RatioLayout> = {
  '16:9': {
    columns: 5,
    iconSize: 100,
    gapX: 232,
    gapY: 164,
    startX: 248,
    startY: 254,
    titleSize: 78,
    catSize: 31,
    nameSize: 16,
  },
  '4:5': {
    columns: 5,
    iconSize: 104,
    gapX: 236,
    gapY: 380,
    startX: 240,
    startY: 500,
    titleSize: 88,
    catSize: 32,
    nameSize: 17,
  },
  '3:4': {
    columns: 5,
    iconSize: 92,
    gapX: 190,
    gapY: 290,
    startX: 205,
    startY: 440,
    titleSize: 74,
    catSize: 26,
    nameSize: 15,
  },
  '1:1': {
    columns: 5,
    iconSize: 104,
    gapX: 220,
    gapY: 290,
    startX: 220,
    startY: 430,
    titleSize: 82,
    catSize: 31,
    nameSize: 16,
  },
  '9:16': {
    columns: 5,
    iconSize: 84,
    gapX: 165,
    gapY: 340,
    startX: 186,
    startY: 480,
    titleSize: 66,
    catSize: 26,
    nameSize: 15,
  },
  '2:3': {
    columns: 5,
    iconSize: 94,
    gapX: 190,
    gapY: 330,
    startX: 205,
    startY: 480,
    titleSize: 76,
    catSize: 27,
    nameSize: 15,
  },
}
