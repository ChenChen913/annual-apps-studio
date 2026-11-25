import type { ExportFormat } from '../types'
import type { RatioId } from './ratios'

export type ExportPreset = {
  id: string
  name: string
  hint: string
  ratio: RatioId
  scale: 1 | 2 | 3
  format: ExportFormat
}

export const EXPORT_PRESETS: ExportPreset[] = [
  { id: 'xhs', name: '小红书', hint: '3:4 · 2× · JPG', ratio: '3:4', scale: 2, format: 'jpg' },
  { id: 'moments', name: '朋友圈', hint: '4:5 · 2× · JPG', ratio: '4:5', scale: 2, format: 'jpg' },
  { id: 'story', name: '手机壁纸', hint: '9:16 · 2× · PNG', ratio: '9:16', scale: 2, format: 'png' },
  { id: 'wide', name: '高清横图', hint: '16:9 · 2× · PNG', ratio: '16:9', scale: 2, format: 'png' },
  { id: 'square', name: '方图', hint: '1:1 · 2× · PNG', ratio: '1:1', scale: 2, format: 'png' },
]
