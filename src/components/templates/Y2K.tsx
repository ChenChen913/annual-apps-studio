import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function Y2KTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${doc.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-y2k" style={style}>
      <div className="y2k-glow" />
      <span className="y2k-star y2k-star-a">✦</span>
      <span className="y2k-star y2k-star-b">✦</span>
      <span className="y2k-star y2k-star-c">✦</span>

      <header className="y2k-head">
        <span className="y2k-kicker">★ MY 2026 FAVORITES ★</span>
        <h1 className="y2k-title">{doc.title || '未命名海报'}</h1>
        <span className="y2k-sub">SOFTWARE · MEMORIES · INTERNET</span>
      </header>

      <div className="y2k-cats">
        {categories.map((category, index) => (
          <section className="y2k-cat" key={category.id}>
            <div className="y2k-cat-head">
              <span>0{index + 1}</span>
              {category.name || '未命名分类'}
              <i />
            </div>
            <div className="y2k-apps">
              {category.apps.map((app) => (
                <div className="y2k-app" key={app.id}>
                  <div className="y2k-bubble" style={{ boxShadow: doc.shadow ? '0 10px 24px rgba(80, 120, 255, .35)' : undefined }}>
                    <AppIconView src={app.src} name={app.name} size={doc.iconSize} />
                  </div>
                  {doc.names && <AppCaption app={app} className="y2k-name" showMeta={doc.showMeta} />}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="y2k-foot">
        <span>EST. 2026</span>
        <span>WWW.MY-APPS.COM</span>
        <span>BEST VIEWED 1024×768</span>
      </div>
    </div>
  )
}
