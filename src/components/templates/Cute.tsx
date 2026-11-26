import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function CuteTemplate({ doc, categories, fit }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${fit.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-cute" style={style}>
      <div className="cute-sheet">
        <header className="cute-head">
          <span className="cute-kicker">MY FAVORITE APPS</span>
          <h1 className="cute-title">{doc.title || '未命名海报'}</h1>
          <div className="cute-doodle">
            <i />
            <i />
            <i />
          </div>
        </header>

        <div className="cute-cats">
          {categories.map((category, catIndex) => (
            <section className="cute-cat" key={category.id}>
              <div className="cute-cat-name">
                <span>{String(catIndex + 1).padStart(2, '0')}</span>
                {category.name || '未命名分类'}
              </div>
              <div className="cute-apps">
                {category.apps.map((app, index) => (
                  <div className="cute-app" key={app.id}>
                    <div
                      className="cute-icon-ring"
                      style={{
                        transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                        boxShadow: doc.shadow ? '0 10px 18px rgba(122, 84, 96, .18)' : 'none',
                      }}
                    >
                      <AppIconView src={app.src} name={app.name} size={fit.iconSize} />
                    </div>
                    {doc.names && <AppCaption app={app} className="cute-name" showMeta={doc.showMeta} />}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
