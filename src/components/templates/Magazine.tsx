import type { CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function MagazineTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${Math.round(doc.iconSize * 0.72)}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-mag" style={style}>
      <div className="mag-frame">
        <div className="mag-top">
          <span>VOL. 2026</span>
          <span className="mag-top-mid">THE ANNUAL APPS ISSUE</span>
          <span>NO. 01</span>
        </div>

        <div className="mag-hero">
          <div className="mag-lead">
            <h1 className="mag-title">{doc.title || '未命名海报'}</h1>
            <p className="mag-sub">THE TOOLS THAT SHAPED MY YEAR</p>
            <div className="mag-rule" />
            <p className="mag-intro">
              今年被这些软件反复打开。它们不全是效率工具，但都真实地参与了我的 2026。
            </p>

            <div className="mag-index-list">
              <span className="mag-list-label">IN THIS ISSUE</span>
              {categories.map((category, index) => (
                <div className="mag-list-row" key={category.id}>
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  <b>{category.name || '未命名分类'}</b>
                  <span>{category.apps.length}</span>
                </div>
              ))}
            </div>

            <div className="mag-stats">
              <b>2026</b>
              <span>
                {doc.categories.reduce((total, category) => total + category.apps.length, 0)} APPS
                <br />
                {doc.categories.length} CATEGORIES
              </span>
            </div>
          </div>

          <div className="mag-body">
            {categories.map((category, index) => (
              <section className="mag-cat" key={category.id}>
                <header className="mag-cat-head">
                  <span className="mag-index">{String(index + 1).padStart(2, '0')}</span>
                  <h2>{category.name || '未命名分类'}</h2>
                  <i />
                </header>
                <div className="mag-apps">
                  {category.apps.map((app) => (
                    <div className="mag-app" key={app.id}>
                      <AppIconView
                        className="mag-icon"
                        src={app.src}
                        name={app.name}
                        size={Math.round(doc.iconSize * 0.72)}
                      />
                      {doc.names && (
                        <AppCaption
                          app={app}
                          className="mag-name"
                          showMeta={doc.showMeta}
                          showNote
                          noteClassName="mag-note"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="mag-foot">
          <span>ANNUAL SOFTWARE REVIEW</span>
          <span>2026 · ALL RIGHTS RESERVED</span>
        </div>
      </div>
      <div className="mag-side">2026</div>
    </div>
  )
}
