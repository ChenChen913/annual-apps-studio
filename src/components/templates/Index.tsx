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
  const gridTop = Math.round(310 * sy)
  const footerY = Math.round(canvas.height - 80 * sy)
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

      <h1
        className="idx2-title"
        style={{
          left: padX,
          top: Math.round(98 * sy),
          fontSize: titleSize,
          color: doc.color,
          textShadow: strongShade,
        }}
      >
        {doc.title || '未命名海报'}
      </h1>

      <div
        className="idx2-rule"
        style={{ left: padX, right: padX, top: Math.round(246 * sy) }}
      />

      <div
        className="idx2-total"
        style={{
          right: padX,
          top: Math.round(58 * sy),
          fontSize: Math.round(Math.min(150 * sy, canvas.width * 0.1)),
          color: doc.color,
          textShadow: strongShade,
        }}
      >
        {String(total).padStart(2, '0')}
      </div>

      {rows.map(({ category, top }) => {
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
              <span className="idx2-cat-name" style={{ fontSize: catFont, textShadow: shade }}>
                <i style={{ background: categoryColor }} />
                {category.name || '未命名分类'}
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
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
