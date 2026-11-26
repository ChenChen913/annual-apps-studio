import { uid } from '../lib/id'
import type { Category, PosterDoc } from '../types'

const DEFAULT_CATEGORIES: { name: string; icons: string[] }[] = [
  {
    name: '效率',
    icons: ['localsend', 'faststone', 'typeless', 'wetype', 'doubao_ime', 'v2rayn'],
  },
  {
    name: 'AI 与开发',
    icons: ['trae', 'workbuddy', 'claude_code', 'hermes', 'deepseek_harness'],
  },
  {
    name: '写作与办公',
    icons: ['notepadpp', 'obsidian', 'typora', 'feishu'],
  },
  {
    name: '其他种类',
    icons: ['chrome', 'edge', 'douyin', 'yuanbao', 'wechat'],
  },
]

const ICON_LABELS: Record<string, string> = {
  localsend: 'LocalSend',
  faststone: 'FastStone',
  typeless: 'Typeless',
  wetype: '微信输入法',
  doubao_ime: '豆包输入法',
  v2rayn: 'v2rayN',
  trae: 'TRAE',
  workbuddy: 'WorkBuddy',
  claude_code: 'Claude Code',
  hermes: 'Hermes',
  deepseek_harness: 'DeepSeek Harness',
  notepadpp: 'Notepad++',
  obsidian: 'Obsidian',
  typora: 'Typora',
  feishu: '飞书',
  chrome: 'Google Chrome',
  edge: 'Microsoft Edge',
  douyin: '抖音',
  yuanbao: '元宝',
  wechat: '微信',
}

export function createDefaultCategories(): Category[] {
  return DEFAULT_CATEGORIES.map((group) => ({
    id: uid('cat'),
    name: group.name,
    apps: group.icons.map((iconId) => ({
      id: uid('app'),
      name: ICON_LABELS[iconId] ?? iconId,
      libraryId: iconId,
      iconSrc: null,
      note: '',
      rating: 0,
      tags: [],
    })),
  }))
}

export function createDefaultDoc(): PosterDoc {
  return {
    schemaVersion: 3,
    title: '2026 年我的年度软件',
    templateId: 'elegant',
    ratio: '16:9',
    exportFormat: 'png',
    bg: 'forest',
    customBg: null,
    dim: 34,
    bgZoom: 100,
    bgX: 50,
    bgY: 50,
    bgBlur: 0,
    bgOpacity: 100,
    bgTint: '#0b1220',
    bgTintOpacity: 0,
    color: '#ffffff',
    names: true,
    shadow: true,
    showMeta: false,
    iconShape: 'squircle',
    columns: 6,
    iconSize: 96,
    gapX: 228,
    gapY: 160,
    startX: 248,
    startY: 210,
    titleSize: 78,
    catSize: 31,
    nameSize: 16,
    exportScale: 2,
    categories: createDefaultCategories(),
  }
}
