import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function FilmTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${doc.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-film" style={style}>
      <span className="film-bar film-bar-top" />
      <span className="film-bar film-bar-bottom" />

      <header className="film-head">
        <span className="film-kicker">A YEAR IN APPS · 2026</span>
        <h1 className="film-title">{doc.title || '未命名海报'}</h1>
        <span className="film-tagline">THE SOFTWARE THAT STAYED</span>
      </header>

      <div className="film-body">
        {categories.map((category, index) => (
          <section className="film-cat" key={category.id}>
            <div className="film-cat-head">
              <span>PART {String(index + 1).padStart(2, '0')}</span>
              <h2>{category.name || '未命名分类'}</h2>
              <i />
            </div>
            <div className="film-apps">
              {category.apps.map((app) => (
                <div className="film-app" key={app.id}>
                  <AppIconView src={app.src} name={app.name} size={doc.iconSize} />
                  {doc.names && (
                    <AppCaption
                      app={app}
                      className="film-name"
                      showMeta={doc.showMeta}
                      showNote
                      noteClassName="film-note"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="film-credits">
        <span>STARRING: {doc.categories.reduce((total, category) => total + category.apps.length, 0)} APPS</span>
        <span>DIRECTED BY YOU</span>
        <span>2026 · ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  )
}
