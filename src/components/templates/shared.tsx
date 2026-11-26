import type { CSSProperties } from 'react'
import type { LayoutFit } from '../../lib/layout'
import type { PosterDoc, CategoryView } from '../../types'

export type TemplateProps = {
  doc: PosterDoc
  categories: CategoryView[]
  /** 按画幅与内容行数推导出的实际尺寸，防止软件很多时内容溢出画布 */
  fit: LayoutFit
}

type AppIconViewProps = {
  src: string | null
  name: string
  size: number
  className?: string
  style?: CSSProperties
}

export function AppIconView({ src, name, size, className, style }: AppIconViewProps) {
  if (src) {
    return (
      <img
        className={className}
        src={src}
        alt=""
        draggable={false}
        style={{ width: size, height: size, ...style }}
      />
    )
  }
  return (
    <span
      className={`tile-fallback ${className ?? ''}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34), ...style }}
    >
      {(name || '?').slice(0, 1)}
    </span>
  )
}

type AppMeta = {
  name: string
  note: string
  rating: number
  tags: string[]
}

export function AppCaption({
  app,
  className,
  showMeta,
  showNote,
  noteClassName,
}: {
  app: AppMeta
  className?: string
  showMeta: boolean
  showNote?: boolean
  noteClassName?: string
}) {
  return (
    <>
      <span className={className}>
        <span className="cap-name">{app.name}</span>
        {showMeta && app.rating > 0 && <span className="cap-rating">★{app.rating}</span>}
        {showMeta && app.tags.length > 0 && <span className="cap-tag">#{app.tags[0]}</span>}
      </span>
      {showMeta && showNote && app.note && (
        <span className={`cap-note ${noteClassName ?? ''}`}>{app.note}</span>
      )}
    </>
  )
}
