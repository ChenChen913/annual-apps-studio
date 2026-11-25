import { ImagePlus, Loader2, Search, Upload } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { BACKGROUNDS, BACKGROUND_GROUPS, type BackgroundGroup } from '../../data/backgrounds'
import { processBackgroundFile } from '../../lib/icon'
import { usePosterStore } from '../../store/posterStore'
import { useUiStore } from '../../store/uiStore'
import { RangeField, SectionTitle } from '../ui'

type Filter = '全部' | BackgroundGroup

export function BackgroundPanel() {
  const doc = usePosterStore((state) => state.doc)
  const setBackground = usePosterStore((state) => state.setBackground)
  const applyCustomBackground = usePosterStore((state) => state.applyCustomBackground)
  const useCustomBackground = usePosterStore((state) => state.useCustomBackground)
  const setField = usePosterStore((state) => state.setField)
  const showToast = useUiStore((state) => state.showToast)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('全部')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const backgrounds = useMemo(() => {
    const value = query.trim().toLowerCase()
    return BACKGROUNDS.filter((background) => {
      const matchGroup = filter === '全部' || background.group === filter
      const matchQuery = !value || background.name.toLowerCase().includes(value) || background.group.includes(value)
      return matchGroup && matchQuery
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

  return (
    <>
      <div className="panel-section">
        <SectionTitle icon={<ImagePlus size={13} />}>背景库</SectionTitle>
        <div className="modal-search mb-2">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索背景，例如 夜、浅色、风景"
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
                title={`${background.group} · ${background.name}`}
              >
                {background.kind === 'image' && background.src ? (
                  <img src={background.src} alt="" />
                ) : (
                  <span
                    className="bg-thumb-css"
                    style={{
                      backgroundImage: background.css,
                      backgroundColor: background.base,
                    }}
                  />
                )}
                <span className="bg-name">{background.name}</span>
                <span className="bg-group">{background.group}</span>
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
              <img src={doc.customBg} alt="" />
              <span className="bg-name">我的照片</span>
              <span className="bg-group">自定义</span>
            </button>
          )}
        </div>

        {!backgrounds.length && <p className="panel-note mt-3">没有匹配的背景，换个关键词试试。</p>}

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
          背景共 {BACKGROUNDS.length} 张，全部内置或本地生成，不依赖网络。上传照片只保存在你的浏览器里。
        </p>
      </div>

      <div className="panel-section">
        <SectionTitle icon={<ImagePlus size={13} />}>背景调整</SectionTitle>
        <RangeField
          label="背景压暗"
          value={doc.dim}
          min={0}
          max={65}
          onChange={(value) => setField('dim', value, 'dim')}
          suffix="%"
        />
        <p className="panel-note">
          浅色背景会自动切换成深色文字；如果对比度仍然不够，可以继续压暗或换一张背景。
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
