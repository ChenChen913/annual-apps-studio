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

function isSiteCategory(category: { id: string; name: string }) {
  return category.id.endsWith('sites') || /信息站|网站|网址/.test(category.name)
}

export function IndexTemplate({ doc, categories }: TemplateProps) {
  const canvas = getCanvas(doc.ratio)
  const sx = canvas.width / 1600
  const sy = canvas.height / 2000
  const padX = Math.round((doc.ratio === '9:16' ? 56 : 72) * sx)
  const gridTop = Math.round(310 * sy)
  const footerY = Math.round(canvas.height - 80 * sy)
  const columns = Math.max(3, doc.columns)
  const siteColumns = 4
  const catFont = Math.min(doc.catSize, Math.round(canvas.width * 0.022))
  const nameSize = Math.min(doc.nameSize, Math.round(canvas.width * 0.0115))
  const titleSize = Math.min(doc.titleSize, Math.round(canvas.width * 0.062))
  const groupGap = Math.max(10, Math.round(16 * sy))
  const siteIcon = Math.round(Math.min(58 * sx, 64 * sy))
  const siteItemHeight = Math.round(72 * sy)
  const siteRowGap = Math.round(16 * sy)
  const siteNameSize = Math.max(nameSize + 1, Math.round(17 * sx))
  const siteUrlSize = Math.max(13, Math.round(15 * sx))
  const creditFont = Math.max(14, Math.round(nameSize))
  const creditBottom = Math.round(50 * sy)
  const creditReserve = Math.round(88 * sy)
  const nameLineHeight = 1.3
  const nameBlock = Math.round(nameSize * nameLineHeight * 2 + 10)

  const gridCategories = categories.filter((category) => !isSiteCategory(category))
  const siteCategories = categories.filter(isSiteCategory)
  const siteApps = siteCategories.flatMap((category) => category.apps)
  const siteLabel = siteCategories.length === 1 ? siteCategories[0].name : 'AI 信息站'

  const labelChars = categories.reduce(
    (longest, category) => Math.max(longest, (category.name || '未命名分类').length),
    1,
  )
  const labelWidth = Math.max(Math.round(176 * sx), Math.round(labelChars * catFont * 0.92 + 46 * sx))
  const startX = padX + labelWidth
  const contentWidth = canvas.width - startX - padX
  const cell = contentWidth / columns
  const gridRows = gridCategories.reduce(
    (total, category) => total + Math.max(1, Math.ceil(category.apps.length / columns)),
    0,
  )
  const siteRows = siteApps.length ? Math.ceil(siteApps.length / siteColumns) : 0
  const siteBlockHeight = siteRows
    ? siteRows * siteItemHeight + Math.max(0, siteRows - 1) * siteRowGap
    : 0
  const sectionGaps = gridCategories.length * groupGap
  const availableRows =
    footerY -
    gridTop -
    siteBlockHeight -
    sectionGaps -
    creditReserve -
    Math.round(10 * sy)
  const rowGap = Math.min(
    Math.round(doc.gapY * sy),
    Math.max(54, Math.floor(availableRows / Math.max(1, gridRows))),
  )
  const iconSize = Math.round(
    Math.min(
      doc.iconSize * sx,
      cell * 0.56,
      Math.max(44, rowGap - nameBlock - 4),
    ),
  )

  let cursor = gridTop
  const rows = gridCategories.map((category) => {
    const rowCount = Math.max(1, Math.ceil(category.apps.length / columns))
    const top = cursor
    cursor += rowCount * rowGap + groupGap
    return { category, rowCount, top }
  })
  const siteTop = cursor
  const siteCell = contentWidth / siteColumns

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
              return (
                <div
                  key={app.id}
                  className="idx2-item"
                  style={{ left, top: itemTop, width: Math.round(cell) }}
                >
                  <div
                    className="idx2-avatar"
                    style={{
                      width: iconSize,
                      height: iconSize,
                      borderColor: 'rgba(255,255,255,.38)',
                      background: 'rgba(255,255,255,.13)',
                      boxShadow: doc.shadow ? '0 8px 18px rgba(0,0,0,.26)' : undefined,
                    }}
                  >
                    <AppIconView
                      src={app.src}
                      name={app.name}
                      size={iconSize}
                      className="idx2-person-img"
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

      {siteApps.length > 0 && (
        <div>
          <div
            className="idx2-cat"
            style={{
              left: padX,
              top: siteTop + siteIcon / 2,
              width: labelWidth - Math.round(10 * sx),
              color: doc.color,
            }}
          >
            <span className="idx2-cat-name" style={{ fontSize: catFont, textShadow: shade }}>
              <i style={{ background: colorFor(siteCategories[0]?.id ?? 'ai-sites') }} />
              {siteLabel || 'AI 信息站'}
            </span>
          </div>

          {siteApps.map((app, index) => {
            const column = index % siteColumns
            const row = Math.floor(index / siteColumns)
            const left = Math.round(startX + column * siteCell)
            const top = siteTop + row * (siteItemHeight + siteRowGap)
            return (
              <div
                key={app.id}
                className="idx2-site-item"
                style={{ left, top, width: Math.round(siteCell - Math.round(14 * sx)) }}
              >
                <div
                  className="idx2-site-avatar"
                  style={{
                    width: siteIcon,
                    height: siteIcon,
                    boxShadow: doc.shadow ? '0 8px 18px rgba(0,0,0,.26)' : undefined,
                  }}
                >
                  <AppIconView
                    src={app.src}
                    name={app.name}
                    size={siteIcon}
                    className="idx2-site-img"
                  />
                </div>
                <div className="idx2-site-copy">
                  <div
                    className="idx2-site-name"
                    style={{ fontSize: siteNameSize, color: doc.color, textShadow: shade }}
                  >
                    {app.name}
                  </div>
                  {app.note && (
                    <div
                      className="idx2-site-url"
                      style={{ fontSize: siteUrlSize, color: doc.color, textShadow: shade }}
                    >
                      {app.note}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div
        className="idx2-credit"
        style={{
          right: padX,
          bottom: creditBottom,
          fontSize: creditFont,
          color: doc.color,
          textShadow: shade,
        }}
      >
        <span>整理人：王晨</span>
        <span>
          欢迎关注我的公众号 <b>MaoMaoTech</b>
        </span>
      </div>
    </>
  )
}
