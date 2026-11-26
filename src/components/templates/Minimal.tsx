import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function MinimalTemplate({ doc, categories, fit }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${Math.round(fit.iconSize * 0.8)}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-min" style={style}>
      <div className="min-sheet">
        <header className="min-head">
          <h1 className="min-title">{doc.title || '未命名海报'}</h1>
          <span className="min-sub">年度软件 / 2026</span>
        </header>

        <div className="min-cats">
          {categories.map((category, index) => (
            <section className="min-cat" key={category.id}>
              <div className="min-label">
                <i>{String(index + 1).padStart(2, '0')}</i>
                {category.name || '未命名分类'}
              </div>
              <div className="min-apps">
                {category.apps.map((app) => (
                  <div className="min-app" key={app.id}>
                    <AppIconView
                      className="min-icon"
                      src={app.src}
                      name={app.name}
                      size={Math.round(fit.iconSize * 0.8)}
                      style={doc.shadow ? { filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.16))' } : undefined}
                    />
                    {doc.names && (
                      <AppCaption
                        app={app}
                        className="min-name"
                        showMeta={doc.showMeta}
                        showNote
                        noteClassName="min-note"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="min-foot">
          <span>{doc.categories.reduce((total, category) => total + category.apps.length, 0)} APPS</span>
          <span>{doc.categories.length} CATEGORIES</span>
        </footer>
      </div>
    </div>
  )
}
