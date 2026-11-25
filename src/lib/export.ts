import { domToJpeg, domToPng, domToWebp } from 'modern-screenshot'
import type { ExportFormat } from '../types'

type ExportOptions = {
  scale: number
  title: string
  templateName: string
  width: number
  height: number
  format: ExportFormat
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '-').slice(0, 60)
}

export async function exportPoster(node: HTMLElement, options: ExportOptions) {
  await document.fonts.ready
  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map(async (image) => {
      try {
        await image.decode()
      } catch {
        // 背景或图标解码失败时仍然尝试导出，避免整个流程卡死。
      }
    }),
  )

  const common = {
    width: options.width,
    height: options.height,
    scale: options.scale,
    backgroundColor: '#081014',
    timeout: 30000,
  }

  let dataUrl: string
  if (options.format === 'jpg') {
    dataUrl = await domToJpeg(node, { ...common, quality: 0.94 })
  } else if (options.format === 'webp') {
    dataUrl = await domToWebp(node, { ...common, quality: 0.94 })
  } else {
    dataUrl = await domToPng(node, common)
  }

  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const extension = options.format === 'jpg' ? 'jpg' : options.format
  link.download = `${safeFileName(options.title || '我的年度软件')}-${options.templateName}-${date}.${extension}`
  link.href = dataUrl
  link.click()
}
