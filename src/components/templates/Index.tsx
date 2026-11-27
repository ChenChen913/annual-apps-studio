import { AI_INDEX_LEGEND } from '../../data/aiIndex'
import { getCanvas } from '../../data/ratios'
import { AppIconView, type TemplateProps } from './shared'

const FALLBACK_COLOR = '#D8D2C4'

const shade = '0 2px 10px rgba(0,0,0,.38), 0 1px 3px rgba(0,0,0,.26)'
const strongShade = '0 8px 28px rgba(0,0,0,.44), 0 2px 8px rgba(0,0,0,.28)'

function colorFor(categoryId: string) {
  const match = AI_INDEX_LEGEND.find((item) => `ai-${item.id}` === categoryId)
  return match?.color ?? FALLBACK_COLOR
}

export function IndexTemplate({ doc, categories }: TemplateProps) {
  const canvas = getCanvas(doc.ratio)
  const sx = canvas.width / 1600
  const sy = canvas.height / 2000
  const padX = Math.round((doc.ratio === '9:16' ? 56 : 72) * sx)
  const gridTop = Math.round(348 * sy)
  const footerY = Math.round(canvas.height - 52 * sy)
  const columns = Math.max(3, doc.columns)
  const catFont = Math.min(doc.catSize, Math.round(canvas.width * 0.022))
  const nameSize = Math.min(doc.nameSize, Math.round(canvas.width * 0.011))
  const titleSize = Math.min(doc.titleSize, Math.round(canvas.width * 0.062))
  const groupGap = Math.max(10, Math.round(22 * sy))
  const labelChars = categories.reduce(
    (longest, category) => Math.max(longest, (category.name || '未命名分类').length),
    1,
  )
  const labelWidth = Math.max(Math.round(176 * sx), Math.round(labelChars * catFont * 0.92 + 46 * sx))
  const startX = padX + labelWidth
  const contentWidth = canvas.width - startX - padX
  const cell = contentWidth / columns
  const totalRows = categories.reduce(
    (total, category) => total + Math.max(1, Math.ceil(category.apps.length / columns)),
    0,
  )
  const sectionGaps = Math.max(0, categories.length - 1) * groupGap
  const availableRows = footerY - gridTop - sectionGaps - Math.round(10 * sy)
  const rowGap = Math.min(Math.round(doc.gapY * sy), Math.max(54, Math.floor(availableRows / Math.max(1, totalRows))))
  const iconSize = Math.round(Math.min(doc.iconSize * sx, rowGap * 0.62, cell * 0.56))
  const total = categories.reduce((sum, category) => sum + category.apps.length, 0)
  const siteCount = categories
    .filter((category) => category.id.endsWith('sites'))
    .reduce((sum, category) => sum + category.apps.length, 0)
  const creatorCount = total - siteCount

  let cursor = gridTop
  const rows = categories.map((category) => {
    const rowCount = Math.max(1, Math.ceil(category.apps.length / columns))
    const top = cursor
    cursor += rowCount * rowGap + groupGap
    return { category, rowCount, top }
  })

  return (
    <>
      <div className="idx2-shade" />

      <div
        className="idx2-kicker"
        style={{
          left: padX,
          right: padX,
          top: Math.round(78 * sy),
          fontSize: Math.round(10 * sx),
          color: doc.color,
        }}
      >
        <span className="idx2-kicker-left">
          <i style={{ background: '#D36A2E' }} />
          AI INDEX / 2026
        </span>
        <span className="idx2-kicker-right">VOL. 01</span>
      </div>

      <h1
        className="idx2-title"
        style={{
          left: padX,
          top: Math.round(142 * sy),
          fontSize: titleSize,
          color: doc.color,
          textShadow: strongShade,
        }}
      >
        {doc.title || '未命名海报'}
      </h1>

      <div
        className="idx2-sub"
        style={{
          left: padX,
          top: Math.round(250 * sy),
          fontSize: Math.round(13 * sx),
          color: doc.color,
        }}
      >
        <span>{total} 条名录</span>
        <i />
        <span>{creatorCount} 位创作者 · {siteCount} 个信息站</span>
        <i />
        <span>排名不分先后</span>
      </div>

      <div
        className="idx2-rule"
        style={{ left: padX, right: padX, top: Math.round(296 * sy) }}
      />

      <div
        className="idx2-total"
        style={{
          right: padX,
          top: Math.round(72 * sy),
          fontSize: Math.round(Math.min(142 * sy, canvas.width * 0.095)),
          color: doc.color,
          textShadow: strongShade,
        }}
      >
        {String(total).padStart(2, '0')}
        <span style={{ fontSize: Math.round(9 * sx) }}>ENTRIES</span>
      </div>

      {rows.map(({ category, top }, categoryIndex) => {
        const categoryColor = colorFor(category.id)
        return (
          <div key={category.id}>
            <div
              className="idx2-cat"
              style={{
                left: padX,
                top: top + iconSize / 2,
                width: labelWidth - Math.round(10 * sx),
                color: doc.color,
              }}
            >
              <span className="idx2-cat-no">
                {String(categoryIndex + 1).padStart(2, '0')}
              </span>
              <span className="idx2-cat-main">
                <span className="idx2-cat-name" style={{ fontSize: catFont, textShadow: shade }}>
                  <i style={{ background: categoryColor }} />
                  {category.name || '未命名分类'}
                </span>
                <span className="idx2-cat-count" style={{ color: categoryColor }}>
                  {category.apps.length}
                </span>
              </span>
            </div>

            {category.apps.map((app, index) => {
              const column = index % columns
              const row = Math.floor(index / columns)
              const left = Math.round(startX + column * cell)
              const itemTop = top + row * rowGap
              const site = category.id.endsWith('sites')
              return (
                <div
                  key={app.id}
                  className="idx2-item"
                  style={{
                    left,
                    top: itemTop,
                    width: Math.round(cell),
                  }}
                >
                  <div
                    className={`idx2-avatar${site ? ' is-site' : ''}`}
                    style={{
                      width: iconSize,
                      height: iconSize,
                      borderColor: site ? 'rgba(255,255,255,.72)' : 'rgba(255,255,255,.38)',
                      background: site ? 'rgba(250,247,240,.96)' : 'rgba(255,255,255,.13)',
                      boxShadow: doc.shadow ? '0 8px 18px rgba(0,0,0,.26)' : undefined,
                    }}
                  >
                    <AppIconView
                      src={app.src}
                      name={app.name}
                      size={iconSize}
                      className={site ? 'idx2-site-img' : 'idx2-person-img'}
                    />
                  </div>
                  {doc.names && (
                    <div
                      className="idx2-name"
                      style={{
                        maxWidth: Math.round(cell - 8),
                        fontSize: nameSize,
                        color: doc.color,
                        textShadow: shade,
                      }}
                    >
                      {app.name}
                    </div>
                  )}
                  {doc.showMeta && app.note && (
                    <div
                      className="idx2-note"
                      style={{
                        maxWidth: Math.round(cell - 10),
                        fontSize: Math.max(8, Math.round(nameSize * 0.62)),
                        color: doc.color,
                        textShadow: shade,
                      }}
                    >
                      {app.note}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      <div
        className="idx2-foot"
        style={{
          left: padX,
          right: padX,
          bottom: Math.round(38 * sy),
          fontSize: Math.round(9 * sx),
          color: doc.color,
        }}
      >
        <span>AI INDEX / 2026</span>
        <span>{creatorCount} CREATORS · {siteCount} SOURCES</span>
        <span>整理于 2026.11</span>
      </div>
    </>
  )
}
