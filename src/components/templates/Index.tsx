import type { CSSProperties } from 'react'
import { getCanvas } from '../../data/ratios'
import { AI_INDEX_LEGEND } from '../../data/aiIndex'
import { AppIconView, type TemplateProps } from './shared'

const FALLBACK_CATEGORY_COLOR = '#786d5f'

export function IndexTemplate({ doc, categories, fit }: TemplateProps) {
  const canvas = getCanvas(doc.ratio)
  const total = categories.reduce((sum, category) => sum + category.apps.length, 0)
  const siteCount = categories
    .filter((category) => category.id.endsWith('sites'))
    .reduce((sum, category) => sum + category.apps.length, 0)
  const creatorCount = total - siteCount
  const columns = Math.max(1, doc.columns)
  const rows = Math.max(1, Math.ceil(total / columns))
  const colorById = new Map(AI_INDEX_LEGEND.map((item) => [`ai-${item.id}`, item.color]))
  const entries = categories.flatMap((category) =>
    category.apps.map((app) => ({
      ...app,
      categoryName: category.name,
      categoryColor: colorById.get(category.id) ?? FALLBACK_CATEGORY_COLOR,
      isSite: category.id.endsWith('sites'),
    })),
  )
  const availableHeight = canvas.height - doc.startY - 112
  const rowHeight = Math.max(150, Math.min(fit.gapY, Math.floor(availableHeight / rows)))
  const gridWidth = canvas.width - doc.startX * 2
  const style = {
    '--ink': doc.color,
    '--icon': `${fit.iconSize}px`,
    '--cols': columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-index" style={style}>
      <div className="idx-wash" aria-hidden />
      <div className="idx-frame" aria-hidden />
      <span className="idx-spine" aria-hidden>
        AI · INDEX · 2026
      </span>

      <header className="idx-head" style={{ left: doc.startX, right: doc.startX }}>
        <div className="idx-kicker">
          <span>
            <i className="idx-kicker-dot" />
            AI INDEX / 2026
          </span>
          <span>VOL. 01 · AN INDEPENDENT LIST</span>
        </div>

        <div className="idx-title-row">
          <h1 className="idx-title">{doc.title || 'AI 创作者与信息源'}</h1>
          <div className="idx-total">
            <strong>{total}</strong>
            <span>ENTRIES</span>
          </div>
        </div>

        <div className="idx-sub">
          <span>{total} 个值得长期关注的创作者、媒体与信息站</span>
          <em>{creatorCount} 位创作者 / {siteCount} 个信息站</em>
        </div>

        <div className="idx-legend">
          {AI_INDEX_LEGEND.map((item) => (
            <span key={item.id}>
              <i style={{ background: item.color }} />
              {item.name}
            </span>
          ))}
        </div>
      </header>

      <div
        className="idx-grid"
        style={{
          left: doc.startX,
          top: doc.startY,
          width: gridWidth,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: `${rowHeight}px`,
        }}
      >
        {entries.map((app, index) => (
          <div
            className="idx-item"
            key={app.id}
            style={{ '--cat': app.categoryColor } as CSSProperties}
          >
            <div className="idx-item-top">
              <span className="idx-number">{String(index + 1).padStart(2, '0')}</span>
              <i className="idx-cat-dot" aria-label={app.categoryName} />
            </div>

            <div className={`idx-avatar ${app.isSite ? 'is-site' : ''}`}>
              <AppIconView src={app.src} name={app.name} size={fit.iconSize} />
            </div>

            {doc.names && (
              <div className="idx-name" title={app.name}>
                {app.name}
              </div>
            )}
            {doc.showMeta && app.note && <div className="idx-note">{app.note}</div>}
          </div>
        ))}
      </div>

      <footer className="idx-foot" style={{ left: doc.startX, right: doc.startX }}>
        <span>AI INDEX / 2026</span>
        <span>{creatorCount} CREATORS · {siteCount} SOURCES</span>
        <span>整理于 2026.11 · 排名不分先后</span>
      </footer>
    </div>
  )
}
