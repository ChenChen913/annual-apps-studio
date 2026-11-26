import { ImagePlus, Loader2, RotateCcw, Search, SlidersHorizontal, Upload } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { BACKGROUNDS, BACKGROUND_GROUPS, type BackgroundFamily } from '../../data/backgrounds'
import { processBackgroundFile } from '../../lib/icon'
import { usePosterStore } from '../../store/posterStore'
import { useUiStore } from '../../store/uiStore'
import { RangeField, SectionTitle } from '../ui'

type Filter = '全部' | BackgroundFamily | '深色' | '浅色'

export function BackgroundPanel() {
  const doc = usePosterStore((state) => state.doc)
  const setBackground = usePosterStore((state) => state.setBackground)
  const applyCustomBackground = usePosterStore((state) => state.applyCustomBackground)
  const useCustomBackground = usePosterStore((state) => state.useCustomBackground)
  const resetBgAdjustments = usePosterStore((state) => state.resetBgAdjustments)
  const setField = usePosterStore((state) => state.setField)
  const showToast = useUiStore((state) => state.showToast)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('全部')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const backgrounds = useMemo(() => {
    const value = query.trim().toLowerCase()
    return BACKGROUNDS.filter((background) => {
      const matchFilter =
        filter === '全部' ||
        (filter === '深色' && !background.light) ||
        (filter === '浅色' && background.light) ||
        background.family === filter
      const haystack = `${background.name} ${background.family} ${background.tag ?? ''}`.toLowerCase()
      return matchFilter && (!value || haystack.includes(value))
    })
  }, [query, filter])

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 20 * 1024 * 1024) {
      showToast('背景图片请控制在 20MB 以内')
      return
    }
    setBusy(true)
    try {
      const dataUrl = await processBackgroundFile(file)
      applyCustomBackground(dataUrl)
      showToast('背景已上传并应用')
    } catch (error) {
      console.error(error)
      showToast('背景处理失败，请换一张图片试试')
    } finally {
      setBusy(false)
    }
  }

  const activeBackground = BACKGROUNDS.find((background) => background.id === doc.bg)

  return (
    <>
      <div className="panel-section">
        <SectionTitle icon={<ImagePlus size={13} />}>背景库</SectionTitle>
        <div className="modal-search mb-2">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索背景：雪山、夜景、纸张…"
            aria-label="搜索背景"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['全部', ...BACKGROUND_GROUPS] as Filter[]).map((group) => (
            <button
              key={group}
              className={`chip ${filter === group ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter(group)}
            >
              {group}
            </button>
          ))}
          {(['深色', '浅色'] as Filter[]).map((tone) => (
            <button
              key={tone}
              className={`chip chip-tone ${filter === tone ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter(filter === tone ? '全部' : tone)}
            >
              {tone}
            </button>
          ))}
        </div>

        <div className="bg-grid mt-3">
          {backgrounds.map((background) => {
            const active = doc.bg === background.id
            return (
              <button
                key={background.id}
                className={`bg-card ${active ? 'active' : ''}`}
                type="button"
                onClick={() => setBackground(background.id)}
                title={`${background.family} · ${background.name}`}
              >
                <span className="bg-thumb">
                  {background.kind === 'image' && background.src ? (
                    <img src={background.thumb ?? background.src} alt="" loading="lazy" draggable={false} />
                  ) : (
                    <span
                      className="bg-thumb-css"
                      style={{
                        backgroundImage: background.css,
                        backgroundColor: background.base,
                      }}
                    />
                  )}
                  {background.light && <span className="bg-tone">浅</span>}
                </span>
                <span className="bg-name">{background.name}</span>
                <span className="bg-group">{background.family}</span>
              </button>
            )
          })}
          {doc.customBg && (
            <button
              className={`bg-card ${doc.bg === 'custom' ? 'active' : ''}`}
              type="button"
              onClick={useCustomBackground}
              title="我上传的照片"
            >
              <span className="bg-thumb">
                <img src={doc.customBg} alt="" />
              </span>
              <span className="bg-name">我的照片</span>
              <span className="bg-group">自定义</span>
            </button>
          )}
        </div>

        {!backgrounds.length && <p className="panel-note mt-3">没有匹配的背景，换个关键词试试。</p>}

        {activeBackground?.source && (
          <p className="panel-note mt-3 bg-credit">
            {activeBackground.source.provider} · {activeBackground.source.license} ·{' '}
            {activeBackground.source.artist}
            {activeBackground.source.pageUrl && (
              <>
                {' · '}
                <a href={activeBackground.source.pageUrl} target="_blank" rel="noreferrer">
                  素材页
                </a>
              </>
            )}
          </p>
        )}

        <button
          className="btn mt-3 w-full text-[11.5px]"
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? <Loader2 className="animate-spin" size={13} /> : <Upload size={13} />}
          {busy ? '处理中…' : '上传自己的照片'}
        </button>
        <p className="panel-note mt-2">
          背景共 {BACKGROUNDS.length} 张，全部打包在本地，离线可用。上传照片只保存在你的浏览器里。
        </p>
      </div>

      <div className="panel-section">
        <SectionTitle icon={<SlidersHorizontal size={13} />}>背景调整</SectionTitle>
        <RangeField
          label="缩放"
          value={doc.bgZoom}
          min={100}
          max={200}
          onChange={(value) => setField('bgZoom', value, 'bg-zoom')}
          suffix="%"
        />
        <RangeField
          label="水平位置"
          value={doc.bgX}
          min={0}
          max={100}
          onChange={(value) => setField('bgX', value, 'bg-x')}
          suffix="%"
        />
        <RangeField
          label="垂直位置"
          value={doc.bgY}
          min={0}
          max={100}
          onChange={(value) => setField('bgY', value, 'bg-y')}
          suffix="%"
        />
        <RangeField
          label="模糊"
          value={doc.bgBlur}
          min={0}
          max={24}
          onChange={(value) => setField('bgBlur', value, 'bg-blur')}
          suffix="px"
        />
        <RangeField
          label="背景浓度"
          value={doc.bgOpacity}
          min={0}
          max={100}
          onChange={(value) => setField('bgOpacity', value, 'bg-opacity')}
          suffix="%"
          hint="调低会让背景向纸色退去，适合文字多的排版。"
        />
        <RangeField
          label="压暗"
          value={doc.dim}
          min={0}
          max={65}
          onChange={(value) => setField('dim', value, 'dim')}
          suffix="%"
        />
        <label className="field">
          <span className="field-label">
            <span>叠色</span>
            <strong>{doc.bgTintOpacity}%</strong>
          </span>
          <span className="tint-row">
            <input
              type="color"
              value={doc.bgTint}
              onChange={(event) => setField('bgTint', event.target.value, 'bg-tint')}
              aria-label="叠色颜色"
            />
            <input
              className="range"
              type="range"
              min={0}
              max={100}
              value={doc.bgTintOpacity}
              onChange={(event) => setField('bgTintOpacity', Number(event.target.value), 'bg-tint')}
              style={{
                background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${doc.bgTintOpacity}%, #dfe5df ${doc.bgTintOpacity}%, #dfe5df 100%)`,
              }}
            />
          </span>
        </label>
        <button className="btn mt-2 w-full text-[11.5px]" type="button" onClick={resetBgAdjustments}>
          <RotateCcw size={13} />
          重置背景调整
        </button>
        <p className="panel-note mt-2">
          压暗、缩放、位置、模糊与叠色都会同步到导出的图片；浅色背景会自动切换为深色文字。
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </>
  )
}
