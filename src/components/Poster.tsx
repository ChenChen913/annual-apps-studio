import { forwardRef } from 'react'
import { getIconSrc } from '../data/icons'
import { getCanvas, ratioClass } from '../data/ratios'
import type { CategoryView, PosterDoc } from '../types'
import { PosterBackground } from './PosterBackground'
import { CuteTemplate } from './templates/Cute'
import { CyberTemplate } from './templates/Cyber'
import { ElegantTemplate } from './templates/Elegant'
import { MagazineTemplate } from './templates/Magazine'
import { MinimalTemplate } from './templates/Minimal'
import { PixelTemplate } from './templates/Pixel'
import type { TemplateProps } from './templates/shared'
import { BrutalistTemplate } from './templates/Brutalist'
import { FilmTemplate } from './templates/Film'
import { JournalTemplate } from './templates/Journal'
import { NewspaperTemplate } from './templates/Newspaper'
import { TerminalTemplate } from './templates/Terminal'
import { Y2KTemplate } from './templates/Y2K'

type PosterProps = {
  doc: PosterDoc
}

function buildCategories(doc: PosterDoc): CategoryView[] {
  return doc.categories.map((category) => ({
    id: category.id,
    name: category.name,
    apps: category.apps.map((app) => ({
      id: app.id,
      name: app.name,
      src: getIconSrc(app),
      note: app.note,
      rating: app.rating,
      tags: app.tags,
    })),
  }))
}

export const Poster = forwardRef<HTMLDivElement, PosterProps>(function Poster({ doc }, ref) {
  const props: TemplateProps = { doc, categories: buildCategories(doc) }
  const canvas = getCanvas(doc.ratio)

  return (
    <div
      ref={ref}
      className={`poster tpl-${doc.templateId} shape-${doc.iconShape} ${ratioClass(doc.ratio)}`}
      style={{ width: canvas.width, height: canvas.height }}
      data-template={doc.templateId}
      data-ratio={doc.ratio}
    >
      <PosterBackground doc={doc} />
      <div
        className="poster-dim"
        style={{ backgroundColor: `rgba(6,10,12,${doc.dim / 100})` }}
      />

      {doc.templateId === 'elegant' && <ElegantTemplate {...props} />}
      {doc.templateId === 'pixel' && <PixelTemplate {...props} />}
      {doc.templateId === 'cute' && <CuteTemplate {...props} />}
      {doc.templateId === 'magazine' && <MagazineTemplate {...props} />}
      {doc.templateId === 'minimal' && <MinimalTemplate {...props} />}
      {doc.templateId === 'cyber' && <CyberTemplate {...props} />}
      {doc.templateId === 'journal' && <JournalTemplate {...props} />}
      {doc.templateId === 'brutalist' && <BrutalistTemplate {...props} />}
      {doc.templateId === 'terminal' && <TerminalTemplate {...props} />}
      {doc.templateId === 'y2k' && <Y2KTemplate {...props} />}
      {doc.templateId === 'film' && <FilmTemplate {...props} />}
      {doc.templateId === 'newspaper' && <NewspaperTemplate {...props} />}
    </div>
  )
})
