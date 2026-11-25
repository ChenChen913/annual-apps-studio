import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function JournalTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${doc.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-journal" style={style}>
      <div className="jr-paper" />
      <span className="jr-tape jr-tape-top" />
      <span className="jr-tape jr-tape-side" />

      <header className="jr-head">
        <span className="jr-kicker">MY YEARLY FAVORITES · 2026</span>
        <h1 className="jr-title">{doc.title || '未命名海报'}</h1>
        <span className="jr-sub">CUT &amp; PASTE · KEEP THE GOOD ONES</span>
      </header>

      <div className="jr-cats">
        {categories.map((category, index) => (
          <section className="jr-cat" key={category.id}>
            <div className="jr-cat-head">
              <span className="jr-index">{String(index + 1).padStart(2, '0')}</span>
              <h2>{category.name || '未命名分类'}</h2>
              <i className="jr-tape-strip" />
            </div>
            <div className="jr-apps">
              {category.apps.map((app, appIndex) => (
                <div
                  className="jr-app"
                  key={app.id}
                  style={{ transform: `rotate(${(appIndex % 3) - 1}deg)` }}
                >
                  <div className="jr-photo">
                    <AppIconView src={app.src} name={app.name} size={doc.iconSize} />
                  </div>
                  {doc.names && (
                    <AppCaption
                      app={app}
                      className="jr-name"
                      showMeta={doc.showMeta}
                      showNote
                      noteClassName="jr-note"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="jr-foot">
        <span>JOURNAL / 2026</span>
        <span>{doc.categories.reduce((total, category) => total + category.apps.length, 0)} LITTLE THINGS I LOVED</span>
      </div>
    </div>
  )
}
