import { Loader2, RotateCcw, Search, Upload, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { ICON_LIBRARY } from '../data/icons'
import { processIconFile } from '../lib/icon'

export type IconPick = { libraryId: string | null; iconSrc: string | null }

type IconPickerProps = {
  open: boolean
  mode: 'add' | 'replace'
  title: string
  canReset?: boolean
  onClose: () => void
  onPick: (icon: IconPick, name?: string) => void
  onReset?: () => void
}

export function IconPicker({
  open,
  mode,
  title,
  canReset,
  onClose,
  onPick,
  onReset,
}: IconPickerProps) {
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [selection, setSelection] = useState<IconPick | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setName('')
    setSelection(null)
    setError(null)
    setBusy(false)
  }, [open, mode])

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return ICON_LIBRARY
    return ICON_LIBRARY.filter(
      (icon) => icon.label.toLowerCase().includes(value) || icon.keywords.includes(value),
    )
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const apply = (icon: IconPick, pickedName?: string) => {
    if (mode === 'replace') {
      onPick(icon)
      onClose()
      return
    }
    if (!icon.libraryId && !icon.iconSrc) return
    onPick(icon, (pickedName ?? '').trim() || undefined)
    onClose()
  }

  const handleLibrary = (iconId: string, label: string) => {
    if (mode === 'replace') {
      apply({ libraryId: iconId, iconSrc: null })
      return
    }
    setSelection({ libraryId: iconId, iconSrc: null })
    if (!name.trim()) setName(label)
  }

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('图标文件请控制在 5MB 以内')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const dataUrl = await processIconFile(file)
      if (mode === 'replace') {
        apply({ libraryId: null, iconSrc: dataUrl })
      } else {
        setSelection({ libraryId: null, iconSrc: dataUrl })
      }
    } catch (err) {
      console.error(err)
      setError('图片处理失败，请换一张试试')
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="icon-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-head">
          <div>
            <h3>{title}</h3>
            <p>从内置图标库选择，或上传一张本地图片</p>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="关闭">
            <X size={16} />
          </button>
        </header>

        {mode === 'add' && (
          <label className="field mb-0">
            <span className="field-label">
              <span>软件名称</span>
              <strong>{name.length}/30</strong>
            </span>
            <input
              className="text-input"
              value={name}
              maxLength={30}
              placeholder="例如：ChatGPT"
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </label>
        )}

        <div className="modal-search">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索内置图标，例如 TRAE、微信、输入法"
            aria-label="搜索图标"
          />
        </div>

        <div className="icon-lib-grid">
          {filtered.map((icon) => {
            const active =
              mode === 'add' && selection?.libraryId === icon.id && !selection.iconSrc
            return (
              <button
                key={icon.id}
                type="button"
                className={`icon-lib-cell ${active ? 'active' : ''}`}
                onClick={() => handleLibrary(icon.id, icon.label)}
              >
                <img src={icon.src} alt="" />
                <span>{icon.label}</span>
              </button>
            )
          })}
          {!filtered.length && <p className="icon-lib-empty">没有匹配的图标</p>}
        </div>

        {mode === 'add' && selection?.iconSrc && (
          <div className="upload-preview">
            <img src={selection.iconSrc} alt="" />
            <span>已选择上传的图标</span>
            <button type="button" className="icon-btn" onClick={() => setSelection(null)} aria-label="移除">
              <X size={14} />
            </button>
          </div>
        )}

        {error && <p className="modal-error">{error}</p>}

        <footer className="modal-foot">
          <button className="btn" type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
            {busy ? '处理中…' : '上传图片'}
          </button>
          {mode === 'replace' && canReset && onReset && (
            <button
              className="btn"
              type="button"
              onClick={() => {
                onReset()
                onClose()
              }}
            >
              <RotateCcw size={14} />
              恢复默认图标
            </button>
          )}
          <div className="modal-foot-spacer" />
          <button className="btn" type="button" onClick={onClose}>
            取消
          </button>
          {mode === 'add' && (
            <button
              className="btn btn-primary"
              type="button"
              disabled={!selection}
              onClick={() =>
                selection &&
                apply(selection, name)
              }
            >
              添加软件
            </button>
          )}
        </footer>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>,
    document.body,
  )
}
