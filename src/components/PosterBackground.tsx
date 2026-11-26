import { getBackground } from '../data/backgrounds'
import { getCanvas } from '../data/ratios'
import type { PosterDoc } from '../types'

/**
 * 背景层。
 *
 * 缩放 / 位移 / 模糊 / 透明度 / 叠色全部用 CSS 表达，导出时由 modern-screenshot
 * 直接栅格化同一棵 DOM，因此预览与导出结果一致，不需要第二套图片处理逻辑。
 *
 * 位移的做法：把背景盒比画布放大 OVERSIZE，再用 translate 在多余的部分里平移，
 * 这样水平、垂直两个方向都能真正「移动」背景，而不是只换 object-position。
 */
const OVERSIZE = 0.18

export function PosterBackground({ doc }: { doc: PosterDoc }) {
  const background = getBackground(doc.bg)
  const custom = doc.bg === 'custom' && doc.customBg ? doc.customBg : null
  const image = custom ?? (background.kind === 'image' ? background.src ?? null : null)
  const paper = background.light ? '#f2eee4' : '#0a0e12'
  const canvas = getCanvas(doc.ratio)

  const zoom = doc.bgZoom / 100
  const blur = doc.bgBlur
  const bleed = Math.ceil(blur * 2.4)
  const overX = Math.round(canvas.width * OVERSIZE) + bleed
  const overY = Math.round(canvas.height * OVERSIZE) + bleed
  const shiftX = Math.round(((50 - doc.bgX) / 50) * (canvas.width * OVERSIZE))
  const shiftY = Math.round(((50 - doc.bgY) / 50) * (canvas.height * OVERSIZE))
  const transform = `translate(${shiftX}px, ${shiftY}px) scale(${zoom})`
  // 用显式像素尺寸撑满放大后的背景盒，避免 replaced element 在 auto 宽度下不拉伸
  const box = {
    left: -overX,
    top: -overY,
    width: canvas.width + overX * 2,
    height: canvas.height + overY * 2,
  }

  return (
    <div className="poster-bg-stack">
      <div className="poster-bg-clip" style={{ opacity: doc.bgOpacity / 100 }}>
        {image ? (
          <img
            className="poster-bg-img"
            src={image}
            alt=""
            draggable={false}
            style={{
              ...box,
              transform,
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }}
          />
        ) : (
          <div
            className="poster-bg poster-bg-css"
            style={{
              ...box,
              backgroundColor: background.base,
              backgroundImage: background.css,
              backgroundSize: 'cover',
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
              transform,
            }}
          />
        )}
      </div>
      {doc.bgTintOpacity > 0 && (
        <div
          className="poster-bg-tint"
          style={{ backgroundColor: doc.bgTint, opacity: doc.bgTintOpacity / 100 }}
        />
      )}
      {doc.bgOpacity < 100 && <div className="poster-bg-wash" style={{ backgroundColor: paper }} />}
    </div>
  )
}
