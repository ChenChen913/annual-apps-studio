import { Fragment, type CSSProperties } from 'react'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

export function NewspaperTemplate({ doc, categories }: TemplateProps) {
  const style = {
    '--ink': doc.color,
    '--icon': `${doc.iconSize}px`,
    '--cols': doc.columns,
    '--title': `${doc.titleSize}px`,
    '--cat': `${doc.catSize}px`,
    '--name': `${doc.nameSize}px`,
  } as CSSProperties

  return (
    <div className="tpl-newspaper" style={style}>
      <div className="np-paper">
        <header className="np-head">
          <div className="np-meta-top">
            <span>THE ANNUAL SOFTWARE TIMES</span>
            <span>SPECIAL EDITION · 2026</span>
            <span>PRICE ¥0</span>
          </div>
          <h1 className="np-title">{doc.title || '未命名海报'}</h1>
          <div className="np-meta-bottom">
            <span>VOL. XXVI</span>
            <span>THE TOOLS I ACTUALLY USED</span>
            <span>{doc.categories.reduce((total, category) => total + category.apps.length, 0)} ENTRIES</span>
          </div>
        </header>

        <div className="np-lead">
          <span className="np-lead-label">LEAD STORY</span>
          <p>
            这一年，真正留在桌面上的软件不多。它们有的负责效率，有的负责记录，有的只是让我在深夜放松一会儿。
          </p>
          <span className="np-lead-by">BY ME · DEC 2026</span>
        </div>

        <div className="np-body">
          {categories.map((category, index) => (
            <Fragment key={category.id}>
              <section className="np-cat">
                <div className="np-cat-head">
                  <span>{category.name || '未命名分类'}</span>
                  <i />
                  <em>SECTION {String(index + 1).padStart(2, '0')}</em>
                </div>
                <div className="np-apps">
                  {category.apps.map((app) => (
                    <div className="np-app" key={app.id}>
                      <AppIconView src={app.src} name={app.name} size={doc.iconSize} />
                      {doc.names && (
                        <AppCaption
                          app={app}
                          className="np-name"
                          showMeta={doc.showMeta}
                          showNote
                          noteClassName="np-note"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
              {index === 1 && (
                <blockquote className="np-quote">
                  真正留下来的软件，是那些你不需要想起、却一直在用的。
                  <span>EDITOR'S NOTE</span>
                </blockquote>
              )}
            </Fragment>
          ))}
        </div>

        <footer className="np-foot">
          <span>ANNUAL SOFTWARE TIMES · 2026</span>
          <span>PRINTED LOCALLY · NO CLOUD REQUIRED</span>
        </footer>
      </div>
    </div>
  )
}
