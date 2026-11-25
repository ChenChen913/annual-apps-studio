import { getBackground } from '../data/backgrounds'
import type { PosterDoc } from '../types'

export function PosterBackground({ doc }: { doc: PosterDoc }) {
  if (doc.bg === 'custom' && doc.customBg) {
    return <img className="poster-bg" src={doc.customBg} alt="" draggable={false} />
  }

  const background = getBackground(doc.bg)
  if (background.kind === 'image' && background.src) {
    return <img className="poster-bg" src={background.src} alt="" draggable={false} />
  }

  return (
    <div
      className="poster-bg poster-bg-css"
      style={{
        backgroundColor: background.base,
        backgroundImage: background.css,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}
