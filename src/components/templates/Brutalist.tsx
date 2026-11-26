import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function BrutalistTemplate({ doc, categories, fit }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${fit.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-brutalist" style={style}>
      <div className="br-frame">
        <span className="br-block br-block-a" />

        <header className="br-head">
          <span className="br-stamp">ANNUAL 2026 / NO FILTER</span>
          <h1 className="br-title">{doc.title || '未命名海报'}</h1>
          <p className="br-sub">MY SOFTWARE. MY RULES.</p>
        </header>

        <div className="br-cats">
          {categories.map((category, index) => (
            <section className="br-cat" key={category.id}>
              <div className="br-cat-head">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{category.name || '未命名分类'}</h2>
                <i />
              </div>
              <div className="br-apps">
                {category.apps.map((app) => (
                  <div className="br-app" key={app.id}>
                    <div className="br-icon">
                      <AppIconView src={app.src} name={app.name} size={fit.iconSize} />
                    </div>
                    {doc.names && <AppCaption app={app} className="br-name" showMeta={doc.showMeta} />}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="br-foot">
          <span>{doc.categories.reduce((total, category) => total + category.apps.length, 0)} APPS</span>
          <span>DESIGNED IN 2026</span>
        </div>
      </div>
    </div>
  )
}
