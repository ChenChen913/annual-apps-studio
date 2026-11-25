import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function TerminalTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${Math.min(doc.iconSize, 56)}px`,
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
                    <AppIconView src={app.src} name={app.name} size={Math.min(doc.iconSize, 56)} />
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
