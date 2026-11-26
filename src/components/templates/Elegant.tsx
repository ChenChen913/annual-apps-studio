import { getCanvas } from '../../data/ratios'
import { isDarkColor } from '../../lib/color'
import { AppCaption, AppIconView, type TemplateProps } from './shared'

const TITLE_LAYOUT = {
  '16:9': { x: 72, y: 134 },
  '4:5': { x: 72, y: 200 },
  '3:4': { x: 72, y: 180 },
  '1:1': { x: 72, y: 170 },
  '9:16': { x: 56, y: 170 },
  '2:3': { x: 72, y: 200 },
}

export function ElegantTemplate({ doc, categories, fit }: TemplateProps) {
  const canvas = getCanvas(doc.ratio)
  const titleLayout = TITLE_LAYOUT[doc.ratio] ?? TITLE_LAYOUT['16:9']
  const padX = doc.ratio === '9:16' ? 56 : 72
  const darkText = isDarkColor(doc.color)
  const shade = darkText ? 'rgba(255,255,255,.34)' : 'rgba(0,0,0,.46)'
  const titleShadow = `0 6px 26px ${shade}, 0 2px 6px ${shade}`
  const categoryShadow = `0 3px 16px ${shade}`
  const labelShadow = `0 2px 10px ${shade}`
  const iconShadow = 'drop-shadow(0 10px 16px rgba(0,0,0,.35))'
  const labelChars = categories.reduce(
    (longest, category) => Math.max(longest, (category.name || '未命名分类').length),
    1,
  )
  // 分类标签独占左侧一栏，图标不能再压到标签上
  const labelRoom = Math.round(labelChars * doc.catSize * 1.02) + 20
  const startX = Math.max(doc.startX, padX + labelRoom)
  const contentWidth = canvas.width - startX - padX
  const cell = Math.max(fit.iconSize + 18, Math.min(300, contentWidth / doc.columns))

  // 每个分类的起始 Y 由前面所有分类的行数累加得出，避免在渲染中修改可变游标
  const categoryTop = (index: number) =>
    fit.startY +
    categories
      .slice(0, index)
      .reduce((sum, category) => sum + Math.max(1, Math.ceil(category.apps.length / doc.columns)) * fit.gapY, 0)

  return (
    <>
      <div
        className="poster-left-gradient"
        style={
          darkText
            ? {
                background:
                  'linear-gradient(90deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,.12) 55%, rgba(255,255,255,0) 100%)',
              }
            : undefined
        }
      />
      <div
        className="poster-bottom-gradient"
        style={
          darkText
            ? { background: 'linear-gradient(180deg, rgba(255,255,255,0) 72%, rgba(255,255,255,.24) 100%)' }
            : undefined
        }
      />

      <h1
        className="poster-title"
        style={{
          left: titleLayout.x,
          top: titleLayout.y,
          fontSize: doc.titleSize,
          color: doc.color,
          textShadow: titleShadow,
        }}
      >
        {doc.title || '未命名海报'}
      </h1>

      {categories.map((category, catIndex) => {
        const top = categoryTop(catIndex)
        return (
          <div key={category.id}>
            <div
              className="poster-category"
              style={{
                left: padX,
                top: top - 13,
                fontSize: doc.catSize,
                color: doc.color,
                textShadow: categoryShadow,
              }}
            >
              {category.name || `分类 ${catIndex + 1}`}
            </div>

            {category.apps.map((app, index) => {
              const x = startX + (index % doc.columns) * cell
              const y = top + Math.floor(index / doc.columns) * fit.gapY - fit.iconSize / 2
              return (
                <div key={app.id}>
                  <AppIconView
                    className="poster-icon"
                    src={app.src}
                    name={app.name}
                    size={fit.iconSize}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      filter: doc.shadow ? iconShadow : undefined,
                    }}
                  />
                  {doc.names && (
                    <div
                      className="poster-label"
                      style={{
                        left: x + fit.iconSize / 2,
                        top: y + fit.iconSize + 12,
                        fontSize: doc.nameSize,
                        color: doc.color,
                        textShadow: labelShadow,
                      }}
                    >
                      <AppCaption app={app} showMeta={doc.showMeta} />
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
