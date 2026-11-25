import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function PixelTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${doc.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-pixel" style={style}>
      <div className="px-scan" />
      <header className="px-head">
        <div className="px-kicker">
          <span className="px-block" />
          ANNUAL APP ARCHIVE // 2026
        </div>
        <h1 className="px-title">{doc.title || '未命名海报'}</h1>
      </header>

      <div className="px-cats">
        {categories.map((category, index) => (
          <section className="px-cat" key={category.id}>
            <div className="px-catbar">
              <span className="px-index">{String(index + 1).padStart(2, '0')}</span>
              <b>{category.name || '未命名分类'}</b>
              <span className="px-bar">
                <i />
              </span>
            </div>
            <div className="px-apps">
              {category.apps.map((app) => (
                <div className="px-app" key={app.id}>
                  <AppIconView
                    className="px-icon"
                    src={app.src}
                    name={app.name}
                    size={doc.iconSize}
                    style={doc.shadow ? { filter: 'drop-shadow(4px 4px 0 rgba(0, 0, 0, .55))' } : undefined}
                  />
                  {doc.names && <AppCaption app={app} className="px-name" showMeta={doc.showMeta} />}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="px-foot">
        <span>INSERT COIN</span>
        <span className="px-cursor">_</span>
        <span>PRESS START</span>
      </div>
    </div>
  )
}
