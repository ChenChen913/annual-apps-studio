import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { BACKGROUNDS } from '../src/data/backgrounds'
import { ICON_LIBRARY } from '../src/data/icons'
import { createDefaultCategories, createDefaultDoc } from '../src/data/defaultProject'
import { AI_INDEX_CATEGORIES, AI_INDEX_TOTAL, createAiIndexDoc } from '../src/data/aiIndex'
import { CREATOR_ICON_MAP } from '../src/data/creatorIcons'
import { getLayoutBounds, RATIOS, getCanvas } from '../src/data/ratios'
import { getTemplate, resolveTemplateLayout, TEMPLATES } from '../src/data/templates'
import { sanitizeDoc } from '../src/lib/project'
import { computeFit } from '../src/lib/layout'
import type { PosterDoc, RatioId, TemplateId } from '../src/types'

const RATIO_IDS = RATIOS.map((ratio) => ratio.id)
const TEMPLATE_IDS = TEMPLATES.map((template) => template.id) as TemplateId[]

function docFromTemplate(templateId: TemplateId, ratio: RatioId): PosterDoc {
  const base = createDefaultDoc()
  const layout = resolveTemplateLayout(templateId, ratio, createDefaultCategories())
  return {
    ...base,
    templateId,
    ratio,
    categories: createDefaultCategories(),
    ...layout,
  }
}

describe('画幅排版参数校验', () => {
  it('所有画幅 × 模板的默认排版参数经过 sanitizeDoc 后保持不变', () => {
    for (const ratio of RATIO_IDS) {
      for (const templateId of TEMPLATE_IDS) {
        const doc = docFromTemplate(templateId, ratio)
        const clean = sanitizeDoc(doc)
        const fields = ['columns', 'iconSize', 'gapX', 'gapY', 'startX', 'startY', 'titleSize', 'catSize', 'nameSize'] as const
        const changed = fields.filter((field) => clean[field] !== doc[field])
        expect({ ratio, templateId, changed }).toEqual({ ratio, templateId, changed: [] })
      }
    }
  })

  it('竖版画幅的高 gapY / 高 startY 不再被压回 16:9 的范围', () => {
    const doc = docFromTemplate('elegant', '9:16')
    const clean = sanitizeDoc({ ...doc, gapY: 900, startY: 900 })
    const bounds = getLayoutBounds('9:16')
    expect(clean.gapY).toBe(900)
    expect(clean.startY).toBe(900)
    if (bounds.gapY[1] < 900) throw new Error('9:16 的 gapY 上限应大于 900')
  })

  it('越界参数仍然会被限制在画幅范围内', () => {
    for (const ratio of RATIO_IDS) {
      const bounds = getLayoutBounds(ratio)
      const doc = docFromTemplate('pixel', ratio)
      const clean = sanitizeDoc({
        ...doc,
        gapY: bounds.gapY[1] + 500,
        startY: bounds.startY[1] + 500,
        iconSize: bounds.iconSize[1] + 100,
        columns: 99,
      })
      expect(clean.gapY).toBeLessThanOrEqual(bounds.gapY[1])
      expect(clean.startY).toBeLessThanOrEqual(bounds.startY[1])
      expect(clean.iconSize).toBeLessThanOrEqual(bounds.iconSize[1])
      expect(clean.columns).toBeLessThanOrEqual(bounds.columns[1])
    }
  })

  it('布局参数上限与画布尺寸成正比', () => {
    for (const ratio of RATIO_IDS) {
      const canvas = getCanvas(ratio)
      const bounds = getLayoutBounds(ratio)
      expect(bounds.gapY[1]).toBeGreaterThanOrEqual(Math.round(canvas.height * 1.2))
      expect(bounds.startY[1]).toBeGreaterThan(Math.round(canvas.height * 0.8))
    }
  })

  it('computeFit 不会把内容算成溢出画布', () => {
    const overflowing: string[] = []
    for (const ratio of RATIO_IDS) {
      for (const templateId of TEMPLATE_IDS) {
        const doc = docFromTemplate(templateId, ratio)
        const clean = sanitizeDoc(doc)
        const fit = computeFit(clean)
        if (fit.overflow) overflowing.push(`${templateId}-${ratio}`)
      }
    }
    expect(overflowing).toEqual([])
  })
})

describe('数据兼容性', () => {
  it('旧版（v2）草稿缺少背景参数时补齐默认值', () => {
    const doc = docFromTemplate('elegant', '16:9')
    const legacy: Record<string, unknown> = { ...doc }
    delete legacy.schemaVersion
    delete legacy.bgZoom
    delete legacy.bgX
    delete legacy.bgY
    delete legacy.bgBlur
    delete legacy.bgOpacity
    delete legacy.bgTint
    delete legacy.bgTintOpacity
    const clean = sanitizeDoc(legacy)
    expect(clean.schemaVersion).toBe(3)
    expect(clean.bgZoom).toBe(100)
    expect(clean.bgX).toBe(50)
    expect(clean.bgY).toBe(50)
    expect(clean.bgBlur).toBe(0)
    expect(clean.bgOpacity).toBe(100)
    expect(clean.bgTintOpacity).toBe(0)
  })

  it('保留用户已保存的背景调整参数', () => {
    const doc = docFromTemplate('elegant', '4:5')
    const clean = sanitizeDoc({ ...doc, bgZoom: 165, bgX: 12, bgY: 88, bgBlur: 9, bgOpacity: 72, bgTintOpacity: 34 })
    expect([clean.bgZoom, clean.bgX, clean.bgY, clean.bgBlur, clean.bgOpacity, clean.bgTintOpacity]).toEqual([
      165, 12, 88, 9, 72, 34,
    ])
  })

  it('未知的背景、模板、颜色与格式回落到安全值', () => {
    const doc = docFromTemplate('elegant', '16:9')
    const clean = sanitizeDoc({
      ...doc,
      bg: 'not-exist-bg',
      templateId: 'unknown-template',
      color: 'red',
      exportFormat: 'gif',
      iconShape: 'triangle',
    })
    expect(clean.bg).not.toBe('not-exist-bg')
    expect(clean.templateId).toBe('elegant')
    expect(clean.color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(clean.exportFormat).toBe('png')
    expect(clean.iconShape).toBe('squircle')
  })

  it('项目文件包一层 doc 也能读取，缺失字段不会丢分类', () => {
    const doc = docFromTemplate('magazine', '9:16')
    const wrapped = { kind: 'annual-apps-project', schemaVersion: 2, doc }
    const clean = sanitizeDoc(wrapped)
    expect(clean.ratio).toBe('9:16')
    expect(clean.templateId).toBe('magazine')
    expect(clean.categories).toHaveLength(doc.categories.length)
    expect(clean.categories[0].apps).toHaveLength(doc.categories[0].apps.length)
  })

  it('数据损坏时抛出可读错误', () => {
    expect(() => sanitizeDoc(null)).toThrow('项目文件内容为空')
    expect(() => sanitizeDoc({ doc: {} })).toThrow()
    expect(() => sanitizeDoc({ categories: [] })).toThrow('没有可用的分类')
  })

  it('自定义图标与自定义背景（data URL）会被保留', () => {
    const doc = docFromTemplate('elegant', '16:9')
    const dataUrl = 'data:image/png;base64,iVBORw0KGgo='
    const clean = sanitizeDoc({
      ...doc,
      bg: 'custom',
      customBg: dataUrl,
      categories: [
        { id: 'c1', name: '测试', apps: [{ id: 'a1', name: 'App', libraryId: null, iconSrc: dataUrl, note: '', rating: 0, tags: [] }] },
      ],
    })
    expect(clean.bg).toBe('custom')
    expect(clean.customBg).toBe(dataUrl)
    expect(clean.categories[0].apps[0].iconSrc).toBe(dataUrl)
  })
})

describe('内置素材引用', () => {
  const publicDir = resolve(process.cwd(), 'public')
  const exists = (src?: string) => !!src && existsSync(resolve(publicDir, src.replace(/^\//, '')))

  it('每张图片背景与缩略图都在本地存在', () => {
    for (const background of BACKGROUNDS.filter((item) => item.kind === 'image')) {
      expect(exists(background.src), `${background.id} 缺少主图`).toBe(true)
      if (background.thumb) {
        expect(exists(background.thumb), `${background.id} 缺少缩略图`).toBe(true)
      }
    }
  })

  it('每个内置图标文件都在本地存在', () => {
    for (const icon of ICON_LIBRARY) {
      expect(exists(icon.src), `${icon.id} 缺少图标文件`).toBe(true)
    }
  })

  it('素材数量达到升级目标', () => {
    expect(BACKGROUNDS.length).toBeGreaterThanOrEqual(60)
    expect(ICON_LIBRARY.length).toBeGreaterThanOrEqual(100)
  })
})

describe('模板与图标数据', () => {
  it('13 套模板都有完整的默认排版参数', () => {
    expect(TEMPLATES).toHaveLength(13)
    for (const template of TEMPLATES) {
      expect(getTemplate(template.id).defaults.iconSize).toBeGreaterThan(0)
    }
  })

  it('每套模板在每种画幅下都给出可用的列数与字号', () => {
    for (const ratio of RATIO_IDS) {
      for (const templateId of TEMPLATE_IDS) {
        const layout = resolveTemplateLayout(templateId, ratio, createDefaultCategories())
        expect(layout.columns).toBeGreaterThanOrEqual(3)
        expect(layout.iconSize).toBeGreaterThan(28)
        expect(layout.gapY).toBeGreaterThan(layout.iconSize)
      }
    }
  })

  it('AI 名录模板与示例数据完整', () => {
    expect(AI_INDEX_TOTAL).toBe(48)
    expect(AI_INDEX_CATEGORIES.map((category) => category.apps.length)).toEqual([3, 3, 4, 31, 7])

    const doc = createAiIndexDoc()
    expect(doc.templateId).toBe('index')
    expect(doc.ratio).toBe('4:5')
    expect(doc.columns).toBe(7)
    expect(doc.categories.reduce((total, category) => total + category.apps.length, 0)).toBe(48)
    expect(new Set(doc.categories.flatMap((category) => category.apps.map((app) => app.name))).size).toBe(48)

    const layout = resolveTemplateLayout('index', '4:5', doc.categories)
    expect(layout.columns).toBe(7)
    expect(layout.startY).toBe(310)

    const fit = computeFit(doc)
    expect(fit.rows).toBe(7)
    expect(fit.overflow).toBe(false)

    const clean = sanitizeDoc(doc)
    expect(clean.templateId).toBe('index')
    expect(clean.columns).toBe(7)
    expect(clean.categories).toHaveLength(5)
    expect(clean.categories.flatMap((category) => category.apps)).toHaveLength(48)

    const sites = clean.categories.find((category) => category.id === 'ai-sites')
    expect(sites?.apps).toHaveLength(7)
    expect(sites?.apps.every((app) => app.note && app.note.includes('.'))).toBe(true)
  })

  it('名录模板的 48 个头像 / 站点图标文件都在本地存在', () => {
    const publicDir = resolve(process.cwd(), 'public')
    const iconPaths = Object.values(CREATOR_ICON_MAP)
    expect(iconPaths).toHaveLength(48)
    for (const src of iconPaths) {
      expect(existsSync(resolve(publicDir, src.replace(/^\//, ''))), `${src} 缺少文件`).toBe(true)
    }
  })
})
