import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function CyberTemplate({ doc, categories, fit }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${fit.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-cyber" style={style}>
      <div className="cy-grid" />
      <div className="cy-scan" />
      <span className="cy-corner cy-corner-tl" />
      <span className="cy-corner cy-corner-tr" />
      <span className="cy-corner cy-corner-bl" />
      <span className="cy-corner cy-corner-br" />

      <header className="cy-head">
        <div className="cy-kicker">
          <i />
          SYS.2026 // APP.ARCHIVE
        </div>
        <h1 className="cy-title" data-text={doc.title || '未命名海报'}>
          {doc.title || '未命名海报'}
        </h1>
      </header>

      <div className="cy-cats">
        {categories.map((category, index) => (
          <section className="cy-cat" key={category.id}>
            <div className="cy-cat-head">
              <span className="cy-index">[0{index + 1}]</span>
              <b>{category.name || '未命名分类'}</b>
              <span className="cy-line" />
              <span className="cy-status">ONLINE</span>
            </div>
            <div className="cy-apps">
              {category.apps.map((app) => (
                <div className="cy-app" key={app.id}>
                  <div className="cy-icon-wrap">
                    <AppIconView src={app.src} name={app.name} size={fit.iconSize} />
                  </div>
                  {doc.names && <AppCaption app={app} className="cy-name" showMeta={doc.showMeta} />}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="cy-foot">
        <span>LAT 31.2304 / LON 121.4737</span>
        <span>EOF</span>
      </div>
    </div>
  )
}
