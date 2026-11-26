import {
  Check,
  Cloud,
  Download,
  Globe,
  HardDrive,
  Loader2,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { ICON_CATEGORIES, ICON_LIBRARY, ICON_MAP, type IconCategory } from '../data/icons'
import { processIconFile } from '../lib/icon'
import { rasterizeRemoteIcon, searchOnlineIcons, type OnlineIcon } from '../lib/onlineIcons'
import { useIconLibraryStore, type SavedIcon } from '../store/iconLibraryStore'

export type IconPick = { libraryId: string | null; iconSrc: string | null }

type IconPickerProps = {
  open: boolean
  mode: 'add' | 'replace'
  title: string
  /** replace 模式下当前应用的内置图标 id，用于「恢复默认」 */
  currentLibraryId?: string | null
  canReset?: boolean
  onClose: () => void
  onPick: (icon: IconPick, name?: string) => void
  onReset?: () => void
}

type Tab = 'builtin' | 'mine' | 'online'

type RecentItem = {
  id: string
  label: string
  src: string
  libraryId: string | null
  iconSrc: string | null
}

const TAB_LABEL: Record<Tab, string> = {
  builtin: '内置图标库',
  mine: '我的图标库',
  online: '在线搜索',
}

export function IconPicker({
  open,
  mode,
  title,
  currentLibraryId,
  canReset,
  onClose,
  onPick,
  onReset,
}: IconPickerProps) {
  const [tab, setTab] = useState<Tab>('builtin')
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [selection, setSelection] = useState<IconPick | null>(null)
  const [category, setCategory] = useState<IconCategory | '全部'>('全部')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [onlineItems, setOnlineItems] = useState<OnlineIcon[] | null>(null)
  const [onlineBusy, setOnlineBusy] = useState(false)
  const [onlineError, setOnlineError] = useState<string | null>(null)
  const [onlineQuery, setOnlineQuery] = useState('')
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const favorites = useIconLibraryStore((state) => state.favorites)
  const recents = useIconLibraryStore((state) => state.recents)
  const saved = useIconLibraryStore((state) => state.saved)
  const saveIcon = useIconLibraryStore((state) => state.saveIcon)
  const removeIcon = useIconLibraryStore((state) => state.removeIcon)
  const toggleFavorite = useIconLibraryStore((state) => state.toggleFavorite)
  const touchRecent = useIconLibraryStore((state) => state.touchRecent)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      abortRef.current?.abort()
    }
  }, [open, onClose])

  const builtinResults = useMemo(() => {
    const value = query.trim().toLowerCase()
    const base =
      category === '全部' ? ICON_LIBRARY : ICON_LIBRARY.filter((icon) => icon.category === category)
    if (!value) return base
    return base.filter((icon) => {
      const haystack = `${icon.label} ${icon.keywords}`.toLowerCase()
      return value.split(/\s+/).every((part) => haystack.includes(part))
    })
  }, [query, category])

  const savedResults = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return saved
    return saved.filter((icon) => `${icon.label} ${icon.category} ${icon.source}`.toLowerCase().includes(value))
  }, [query, saved])

  const recentIcons = useMemo(() => {
    const items: RecentItem[] = []
    for (const id of recents) {
      if (items.length >= 10) break
      const builtin = ICON_MAP.get(id)
      if (builtin) {
        items.push({ id, label: builtin.label, src: builtin.src, libraryId: id, iconSrc: null })
        continue
      }
      const mine = saved.find((item) => item.id === id)
      if (mine) items.push({ id, label: mine.label, src: mine.src, libraryId: null, iconSrc: mine.src })
    }
    return items.slice(0, 10)
  }, [recents, saved])

  const favoriteIcons = useMemo(
    () => favoriteItems(favorites, ICON_MAP, saved),
    [favorites, saved],
  )

  if (!open) return null

  const pick = (icon: IconPick, pickedName?: string, recentKey?: string) => {
    if (recentKey) touchRecent(recentKey)
    if (mode === 'replace') {
      onPick(icon)
      onClose()
      return
    }
    if (!icon.libraryId && !icon.iconSrc) return
    onPick(icon, (pickedName ?? '').trim() || undefined)
    onClose()
  }

  const handleLibrary = (id: string, label: string) => {
    if (mode === 'replace') {
      pick({ libraryId: id, iconSrc: null }, undefined, id)
      return
    }
    setSelection({ libraryId: id, iconSrc: null })
    if (!name.trim()) setName(label)
  }

  const handleSaved = (icon: SavedIcon) => {
    if (mode === 'replace') {
      pick({ libraryId: null, iconSrc: icon.src }, undefined, icon.id)
      return
    }
    setSelection({ libraryId: null, iconSrc: icon.src })
    if (!name.trim()) setName(icon.label)
  }

  /** 在线图标：先栅格化成 data URL，保证离线仍然可用 */
  const applyOnline = async (icon: OnlineIcon, alsoSave: boolean) => {
    setSavingKey(icon.key)
    setError(null)
    try {
      const src = await rasterizeRemoteIcon(icon.url)
      if (alsoSave) {
        const id = saveIcon({
          label: icon.name,
          src,
          category: '在线获取',
          source: `${icon.setName} · Iconify`,
          license: icon.license,
        })
        touchRecent(id)
      }
      if (mode === 'replace') {
        onPick({ libraryId: null, iconSrc: src })
        onClose()
        return
      }
      setSelection({ libraryId: null, iconSrc: src })
      if (!name.trim()) setName(icon.name)
      if (alsoSave) setTab('mine')
    } catch (err) {
      console.error(err)
      setError('在线图标加载失败，请检查网络后重试；也可以改用本地上传')
    } finally {
      setSavingKey(null)
    }
  }

  const runOnlineSearch = async (term?: string) => {
    const value = (term ?? query).trim()
    if (!value) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setOnlineBusy(true)
    setOnlineError(null)
    setOnlineItems(null)
    setOnlineQuery(value)
    try {
      const items = await searchOnlineIcons(value, controller.signal)
      setOnlineItems(items)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      console.error(err)
      setOnlineError((err as Error).message || '在线图标搜索失败')
    } finally {
      setOnlineBusy(false)
    }
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
        onPick({ libraryId: null, iconSrc: dataUrl })
        onClose()
        return
      }
      setSelection({ libraryId: null, iconSrc: dataUrl })
      if (!name.trim()) setName(file.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 30))
    } catch (err) {
      console.error(err)
      setError('图片处理失败，请换一张试试')
    } finally {
      setBusy(false)
    }
  }

  const resetVisible = mode === 'replace' && canReset && Boolean(currentLibraryId)

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="icon-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-head">
          <div>
            <h3>{title}</h3>
            <p>内置图标库离线可用，也可以在线搜索或上传本地图片</p>
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

        <div className="icon-tabs" role="tablist">
          {(['builtin', 'mine', 'online'] as Tab[]).map((item) => {
            const icon = item === 'builtin' ? <HardDrive size={13} /> : item === 'mine' ? <Star size={13} /> : <Globe size={13} />
            return (
              <button
                key={item}
                role="tab"
                type="button"
                aria-selected={tab === item}
                className={`icon-tab ${tab === item ? 'active' : ''}`}
                onClick={() => {
                  setTab(item)
                  setError(null)
                  if (item === 'online' && query.trim() && !onlineItems && !onlineBusy) void runOnlineSearch()
                }}
              >
                {icon}
                {TAB_LABEL[item]}
                {item === 'mine' && saved.length > 0 && <span className="icon-tab-count">{saved.length}</span>}
              </button>
            )
          })}
        </div>

        {tab !== 'online' && (
          <div className="modal-search">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tab === 'builtin' ? '搜索名称或关键词，例如 代码编辑器、Claude、浏览器' : '搜索我的图标'}
              aria-label="搜索图标"
            />
            {query && (
              <button className="icon-btn" type="button" onClick={() => setQuery('')} aria-label="清空搜索">
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {tab === 'builtin' && (
          <>
            <div className="icon-cat-strip" role="tablist" aria-label="图标分类">
              {(['全部', ...ICON_CATEGORIES] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip ${category === item ? 'active' : ''}`}
                  onClick={() => setCategory(item as IconCategory | '全部')}
                >
                  {item}
                </button>
              ))}
            </div>

            {!query.trim() && category === '全部' && (recentIcons.length > 0 || favoriteIcons.length > 0) && (
              <div className="icon-rail">
                {favoriteIcons.length > 0 && (
                  <div className="icon-rail-group">
                    <span className="icon-rail-title">
                      <Star size={11} /> 收藏
                    </span>
                    <div className="icon-rail-row">
                      {favoriteIcons.slice(0, 10).map((item) => (
                        <IconChip key={`fav-${item.id}`} label={item.label} src={item.src} onPick={() => pick(item.pick, item.label, item.id)} />
                      ))}
                    </div>
                  </div>
                )}
                {recentIcons.length > 0 && (
                  <div className="icon-rail-group">
                    <span className="icon-rail-title">最近使用</span>
                    <div className="icon-rail-row">
                      {recentIcons.map((item) => (
                        <IconChip
                          key={`recent-${item.id}`}

                          label={item.label}
                          src={item.src}
                          onPick={() => pick({ libraryId: item.libraryId, iconSrc: item.iconSrc }, item.label, item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="icon-lib-grid">
              {builtinResults.map((icon) => {
                const active = mode === 'add' && selection?.libraryId === icon.id && !selection.iconSrc
                const fav = favorites.includes(icon.id)
                return (
                  <div key={icon.id} className={`icon-lib-cell ${active ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="icon-cell-main"
                      onClick={() => handleLibrary(icon.id, icon.label)}
                      title={`${icon.label} · ${icon.category} · ${icon.platform}`}
                    >
                      <img src={icon.src} alt="" loading="lazy" />
                      <span>{icon.label}</span>
                    </button>
                    <button
                      type="button"
                      className={`icon-cell-star ${fav ? 'on' : ''}`}
                      onClick={() => toggleFavorite(icon.id)}
                      aria-label={fav ? `取消收藏 ${icon.label}` : `收藏 ${icon.label}`}
                      title={fav ? '取消收藏' : '收藏'}
                    >
                      <Star size={11} />
                    </button>
                  </div>
                )
              })}
              {!builtinResults.length && (
                <div className="icon-lib-empty">
                  <p>没有匹配的内置图标</p>
                  <button className="btn btn-sm" type="button" onClick={() => { setTab('online'); void runOnlineSearch() }}>
                    <Globe size={13} />用「{query.trim()}」在线搜索
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'mine' && (
          <div className="icon-lib-grid">
            {savedResults.map((icon) => {
              const fav = favorites.includes(icon.id)
              const active = mode === 'add' && selection?.iconSrc === icon.src
              return (
                <div key={icon.id} className={`icon-lib-cell ${active ? 'active' : ''}`}>
                  <button type="button" className="icon-cell-main" onClick={() => handleSaved(icon)} title={`${icon.label} · ${icon.source}`}>
                    <img src={icon.src} alt="" loading="lazy" />
                    <span>{icon.label}</span>
                  </button>
                  <button
                    type="button"
                    className={`icon-cell-star ${fav ? 'on' : ''}`}
                    onClick={() => toggleFavorite(icon.id)}
                    aria-label={fav ? '取消收藏' : '收藏'}
                  >
                    <Star size={11} />
                  </button>
                  <button
                    type="button"
                    className="icon-cell-del"
                    onClick={() => {
                      if (window.confirm(`从「我的图标库」删除「${icon.label}」？已使用它的海报不受影响。`)) removeIcon(icon.id)
                    }}
                    aria-label={`删除 ${icon.label}`}
                    title="删除"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )
            })}
            {!savedResults.length && (
              <div className="icon-lib-empty">
                <p>{saved.length ? '没有匹配的图标' : '还没有保存过图标'}</p>
                <p className="icon-empty-hint">
                  在内置库或在线搜索里点「存到我的图标库」，图标会以本地数据保存，离线也能继续使用。
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 'online' && (
          <div className="icon-online">
            <div className="modal-search">
              <Search size={14} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void runOnlineSearch()
                }}
                placeholder="输入软件名，例如 Cursor、Figma、Docker"
                aria-label="搜索在线图标"
              />
              <button className="btn btn-sm" type="button" onClick={() => void runOnlineSearch()} disabled={!query.trim() || onlineBusy}>
                {onlineBusy ? <Loader2 className="animate-spin" size={12} /> : <Cloud size={12} />}
                搜索
              </button>
            </div>
            <p className="icon-online-note">
              数据来自 Iconify 公开 API（SVG Logos / Devicon / Simple Icons / selfh.st），只显示许可清晰的图标集。在线搜索需要联网，不影响其他功能。
            </p>

            {onlineBusy && (
              <div className="icon-lib-empty">
                <Loader2 className="animate-spin" size={16} />
                <p>正在搜索「{query.trim()}」…</p>
              </div>
            )}

            {onlineError && (
              <div className="icon-lib-empty">
                <p>{onlineError}</p>
                <button className="btn btn-sm" type="button" onClick={() => void runOnlineSearch(onlineQuery)}>
                  重试
                </button>
              </div>
            )}

            {!onlineBusy && !onlineError && onlineItems && (
              <>
                {onlineItems.length === 0 ? (
                  <div className="icon-lib-empty">
                    <p>没有找到「{onlineQuery}」相关的在线图标</p>
                    <p className="icon-empty-hint">试试英文名或更短的关键词，例如 figma、docker、notion。</p>
                  </div>
                ) : (
                  <div className="online-grid">
                    {onlineItems.map((icon) => (
                      <div className="online-card" key={icon.key}>
                        <div className="online-preview">
                          <img src={icon.url} alt="" loading="lazy" />
                        </div>
                        <div className="online-meta">
                          <strong>{icon.name}</strong>
                          <span className="online-src">
                            {icon.setName} · {icon.license} · {icon.format}
                          </span>
                          <span className="online-platform">{icon.platform}</span>
                        </div>
                        <div className="online-actions">
                          <button
                            className="btn btn-sm"
                            type="button"
                            disabled={savingKey === icon.key}
                            onClick={() => void applyOnline(icon, false)}
                          >
                            {savingKey === icon.key ? <Loader2 className="animate-spin" size={12} /> : <Check size={12} />}
                            仅本次使用
                          </button>
                          <button
                            className="btn btn-sm"
                            type="button"
                            disabled={savingKey === icon.key}
                            onClick={() => void applyOnline(icon, true)}
                          >
                            <Download size={12} />
                            存到我的图标库
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {!onlineBusy && !onlineError && !onlineItems && (
              <div className="icon-lib-empty">
                <p>输入关键词后点「搜索」</p>
                <p className="icon-empty-hint">
                  能搜到图标只代表可以在这里使用；保存到「我的图标库」后仅在本机离线可用，不会进入项目公开内置库。
                </p>
              </div>
            )}
          </div>
        )}

        {mode === 'add' && selection?.iconSrc && (
          <div className="upload-preview">
            <img src={selection.iconSrc} alt="" />
            <span>已选择图标，点「添加软件」生效</span>
            <button type="button" className="icon-btn" onClick={() => setSelection(null)} aria-label="移除">
              <X size={14} />
            </button>
          </div>
        )}

        {error && <p className="modal-error">{error}</p>}

        <footer className="modal-foot">
          <button className="btn" type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
            {busy ? '处理中…' : '上传本地图标'}
          </button>
          {resetVisible && onReset && (
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
              onClick={() => selection && pick(selection, name)}
            >
              添加软件
            </button>
          )}
        </footer>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>,
    document.body,
  )
}

function favoriteItems(favoriteIds: string[], map: typeof ICON_MAP, saved: SavedIcon[]) {
  return favoriteIds
    .map((id) => {
      const builtin = map.get(id)
      if (builtin) {
        return { id, label: builtin.label, src: builtin.src, pick: { libraryId: id, iconSrc: null } as IconPick }
      }
      const mine = saved.find((item) => item.id === id)
      if (mine) return { id, label: mine.label, src: mine.src, pick: { libraryId: null, iconSrc: mine.src } as IconPick }
      return null
    })
    .filter((item): item is { id: string; label: string; src: string; pick: IconPick } => Boolean(item))
}

function IconChip({
  label,
  src,
  onPick,
}: {
  label: string
  src: string
  onPick: () => void
}) {
  return (
    <button className="icon-chip" type="button" onClick={onPick} title={label}>
      <img src={src} alt="" loading="lazy" />
      <span>{label}</span>
    </button>
  )
}
