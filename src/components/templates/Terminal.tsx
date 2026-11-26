import type { CSSProperties } from 'react'
import { getCanvas } from '../../data/ratios'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function TerminalTemplate({ doc, categories, fit }: TemplateProps) {
  const canvas = getCanvas(doc.ratio)
  // 两列分类，按列统计条目行数，据此决定图标大小，避免最后一行压到页脚
  const columnRows = [0, 1].map((column) =>
    categories
      .filter((_, index) => index % 2 === column)
      .reduce((total, category) => total + Math.max(1, category.apps.length), 0),
  )
  const rowUnits = Math.max(1, ...columnRows)
  const chrome = canvas.height > 1200 ? 300 : 262
  const rowHeight = (canvas.height - chrome) / rowUnits
  const iconSize = Math.max(
    24,
    Math.min(Math.round(fit.iconSize), 56, Math.round(rowHeight - doc.nameSize * 1.4 - 8)),
  )

  const style = {
    '--ink': doc.color,
    '--icon': `${iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-terminal" style={style}>
      <div className="tm-screen">
        <div className="tm-bar">
          <i />
          <i />
          <i />
          <span>annual@studio: ~/2026</span>
        </div>

        <header className="tm-head">
          <p className="tm-prompt">
            <b>$</b> ls ~/annual-apps --year=2026
          </p>
          <h1 className="tm-title">{doc.title || '未命名海报'}</h1>
        </header>

        <div className="tm-grid">
          {categories.map((category, index) => (
            <section className="tm-cat" key={category.id}>
              <div className="tm-cat-head">
                <span>[0{index + 1}]</span>
                {category.name || '未命名分类'}
                <i />
              </div>
              <div className="tm-apps">
                {category.apps.map((app) => (
                  <div className="tm-app" key={app.id}>
                    <AppIconView src={app.src} name={app.name} size={iconSize} />
                    <div className="tm-info">
                      {doc.names && (
                        <AppCaption
                          app={app}
                          className="tm-name"
                          showMeta={doc.showMeta}
                          showNote
                          noteClassName="tm-note"
                        />
                      )}
                    </div>
                    <em>OK</em>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="tm-foot">
          <span>$ export MEMORIES=2026</span>
          <span className="tm-cursor">▌</span>
        </div>
      </div>
    </div>
  )
}
