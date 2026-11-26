import { ChevronDown, ChevronUp, GripVertical, ImageIcon, Plus, SlidersHorizontal, Trash2, Type, X } from 'lucide-react'
import { useEffect, useState, type DragEvent } from 'react'
import { ICON_MAP, getIconSrc } from '../../data/icons'
import { usePosterStore } from '../../store/posterStore'
import { useUiStore } from '../../store/uiStore'
import { IconPicker, type IconPick } from '../IconPicker'
import { SectionTitle } from '../ui'

type PickerState =
  | { mode: 'add'; categoryId: string }
  | {
      mode: 'replace'
      categoryId: string
      appId: string
      name: string
      libraryId: string | null
      canReset: boolean
    }
  | null

type DragState = { categoryId: string; appId: string }
type DropState = { categoryId: string; appId: string | null }

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [value, setValue] = useState(tags.join('、'))

  useEffect(() => {
    setValue(tags.join('、'))
  }, [tags])

  const commit = () => {
    const next = value
      .split(/[,，、\s]+/)
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter(Boolean)
      .slice(0, 3)
    const unique = Array.from(new Set(next))
    onChange(unique)
    setValue(unique.join('、'))
  }

  return (
    <div className="tag-editor">
      <div className="field-label">
        <span>标签</span>
        <strong>最多 3 个</strong>
      </div>
      {tags.length > 0 && (
        <div className="tag-chips">
          {tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              #{tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((item) => item !== tag))}
                aria-label={`移除标签 ${tag}`}
              >
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className="text-input"
        value={value}
        placeholder="用逗号分隔，例如：效率、写作"
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
          }
        }}
      />
    </div>
  )
}

export function ContentPanel() {
  const doc = usePosterStore((state) => state.doc)
  const renameCategory = usePosterStore((state) => state.renameCategory)
  const addCategory = usePosterStore((state) => state.addCategory)
  const removeCategory = usePosterStore((state) => state.removeCategory)
  const moveCategory = usePosterStore((state) => state.moveCategory)
  const addApp = usePosterStore((state) => state.addApp)
  const renameApp = usePosterStore((state) => state.renameApp)
  const removeApp = usePosterStore((state) => state.removeApp)
  const setAppIcon = usePosterStore((state) => state.setAppIcon)
  const updateAppMeta = usePosterStore((state) => state.updateAppMeta)
  const moveApp = usePosterStore((state) => state.moveApp)
  const moveAppTo = usePosterStore((state) => state.moveAppTo)
  const moveAppToCategory = usePosterStore((state) => state.moveAppToCategory)
  const setField = usePosterStore((state) => state.setField)
  const showToast = useUiStore((state) => state.showToast)
  const [picker, setPicker] = useState<PickerState>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [drop, setDrop] = useState<DropState | null>(null)

  const handlePick = (icon: IconPick, name?: string) => {
    if (!picker) return
    if (picker.mode === 'add') {
      const fallbackName = icon.libraryId ? ICON_MAP.get(icon.libraryId)?.label ?? '新软件' : '新软件'
      addApp(picker.categoryId, {
        name: name?.trim() || fallbackName,
        libraryId: icon.libraryId,
        iconSrc: icon.iconSrc,
      })
      showToast('已添加软件')
    } else {
      setAppIcon(picker.categoryId, picker.appId, icon)
      showToast('图标已更新')
    }
  }

  const handleResetIcon = () => {
    if (!picker || picker.mode !== 'replace') return
    setAppIcon(picker.categoryId, picker.appId, { libraryId: picker.libraryId, iconSrc: null })
    showToast('已恢复内置图标')
  }

  const clearDrag = () => {
    setDrag(null)
    setDrop(null)
  }

  const handleRowDrop = (event: DragEvent, categoryId: string, appId: string) => {
    event.preventDefault()
    event.stopPropagation()
    if (!drag) return
    const target = doc.categories.find((category) => category.id === categoryId)
    const targetIndex = target?.apps.findIndex((app) => app.id === appId) ?? 0
    moveAppTo(drag.categoryId, drag.appId, categoryId, targetIndex)
    clearDrag()
    showToast('排序已更新')
  }

  return (
    <>
      <div className="panel-section">
        <SectionTitle icon={<Type size={13} />}>标题</SectionTitle>
        <label className="field mb-0">
          <span className="field-label">
            <span>主标题</span>
            <strong>{doc.title.length}/60</strong>
          </span>
          <input
            className="text-input"
            value={doc.title}
            maxLength={60}
            onChange={(event) => setField('title', event.target.value, 'title')}
          />
        </label>
      </div>

      <div className="panel-section">
        <SectionTitle icon={<ImageIcon size={13} />}>分类与软件</SectionTitle>
        <p className="panel-note">
          一行对应一个分类。拖动软件左侧的手柄可以排序或跨分类拖动；也可以增删分类、改名、换图标。
        </p>

        <div className="cat-list">
          {doc.categories.map((category, catIndex) => (
            <section className="cat-editor" key={category.id}>
              <div className="cat-editor-head">
                <span className="cat-index">{String(catIndex + 1).padStart(2, '0')}</span>
                <input
                  className="text-input cat-name-input"
                  value={category.name}
                  maxLength={20}
                  placeholder="分类名称"
                  onChange={(event) => renameCategory(category.id, event.target.value)}
                  aria-label={`分类 ${catIndex + 1} 名称`}
                />
                <div className="row-tools">
                  <button
                    className="icon-btn"
                    type="button"
                    onClick={() => moveCategory(category.id, -1)}
                    disabled={catIndex === 0}
                    title="分类上移"
                    aria-label="分类上移"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    className="icon-btn"
                    type="button"
                    onClick={() => moveCategory(category.id, 1)}
                    disabled={catIndex === doc.categories.length - 1}
                    title="分类下移"
                    aria-label="分类下移"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    className="icon-btn danger"
                    type="button"
                    onClick={() => {
                      if (!category.apps.length || window.confirm(`删除分类「${category.name || '未命名'}」及其 ${category.apps.length} 个软件？`)) {
                        removeCategory(category.id)
                        showToast('分类已删除')
                      }
                    }}
                    disabled={doc.categories.length <= 1}
                    title={doc.categories.length <= 1 ? '至少保留一个分类' : '删除分类'}
                    aria-label="删除分类"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div
                className={`app-list ${
                  drop?.categoryId === category.id && drop.appId === null ? 'drop-end' : ''
                }`}
                onDragOver={(event) => {
                  if (!drag) return
                  event.preventDefault()
                  setDrop({ categoryId: category.id, appId: null })
                  event.dataTransfer.dropEffect = 'move'
                }}
                onDrop={(event) => {
                  if (!drag) return
                  event.preventDefault()
                  moveAppTo(drag.categoryId, drag.appId, category.id, category.apps.length)
                  clearDrag()
                  showToast('已移动到分类末尾')
                }}
              >
                {category.apps.map((app, appIndex) => (
                  <div key={app.id}>
                    <div
                      className={`app-row ${drag?.appId === app.id ? 'dragging' : ''} ${
                        drop?.categoryId === category.id && drop.appId === app.id ? 'drop-before' : ''
                      }`}
                      onDragOver={(event) => {
                        if (!drag || (drag.categoryId === category.id && drag.appId === app.id)) return
                        event.preventDefault()
                        event.stopPropagation()
                        setDrop({ categoryId: category.id, appId: app.id })
                        event.dataTransfer.dropEffect = 'move'
                      }}
                      onDrop={(event) => handleRowDrop(event, category.id, app.id)}
                    >
                      <span
                        className="drag-handle"
                        draggable
                        onDragStart={(event) => {
                          setDrag({ categoryId: category.id, appId: app.id })
                          event.dataTransfer.effectAllowed = 'move'
                          event.dataTransfer.setData('text/plain', app.id)
                        }}
                        onDragEnd={clearDrag}
                        title="拖拽排序"
                        aria-hidden="true"
                      >
                        <GripVertical size={12} />
                      </span>

                      <button
                        className="app-thumb"
                        type="button"
                        onClick={() =>
                          setPicker({
                            mode: 'replace',
                            categoryId: category.id,
                            appId: app.id,
                            name: app.name,
                            libraryId: app.libraryId,
                            canReset: Boolean(app.iconSrc && app.libraryId),
                          })
                        }
                        title="替换图标"
                        aria-label={`替换 ${app.name} 的图标`}
                      >
                        {getIconSrc(app) ? (
                          <img src={getIconSrc(app) ?? ''} alt="" />
                        ) : (
                          <span>{(app.name || '?').slice(0, 1)}</span>
                        )}
                      </button>

                      <input
                        className="text-input app-name-input"
                        value={app.name}
                        maxLength={30}
                        onChange={(event) => renameApp(category.id, app.id, event.target.value)}
                        aria-label="软件名称"
                      />

                      <div className="row-tools">
                        <button
                          className="icon-btn"
                          type="button"
                          onClick={() => moveApp(category.id, app.id, -1)}
                          disabled={appIndex === 0}
                          title="上移"
                          aria-label="上移"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          className="icon-btn"
                          type="button"
                          onClick={() => moveApp(category.id, app.id, 1)}
                          disabled={appIndex === category.apps.length - 1}
                          title="下移"
                          aria-label="下移"
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          className={`icon-btn ${expandedId === app.id ? 'active' : ''}`}
                          type="button"
                          onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                          title="评分、备注与标签"
                          aria-label="编辑详情"
                        >
                          <SlidersHorizontal size={12} />
                        </button>
                        <button
                          className="icon-btn danger"
                          type="button"
                          onClick={() => {
                            removeApp(category.id, app.id)
                            showToast('已删除软件，可撤销')
                          }}
                          title="删除软件"
                          aria-label="删除软件"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {expandedId === app.id && (
                      <div className="app-details">
                        <div className="detail-top">
                          <span className="detail-label">评分</span>
                          <div className="star-row">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                type="button"
                                className={score <= app.rating ? 'on' : ''}
                                onClick={() =>
                                  updateAppMeta(
                                    category.id,
                                    app.id,
                                    { rating: app.rating === score ? 0 : score },
                                    `rating-${app.id}`,
                                  )
                                }
                                aria-label={`评分 ${score} 星`}
                              >
                                ★
                              </button>
                            ))}
                            <span className="rating-value">
                              {app.rating ? `${app.rating}/5` : '未评分'}
                            </span>
                          </div>
                        </div>

                        <label className="field mb-0">
                          <span className="field-label">
                            <span>备注</span>
                            <strong>{app.note.length}/90</strong>
                          </span>
                          <textarea
                            className="text-input detail-note"
                            rows={2}
                            maxLength={90}
                            value={app.note}
                            placeholder="一句话记住它，例如：每天开机第一个打开"
                            onChange={(event) =>
                              updateAppMeta(
                                category.id,
                                app.id,
                                { note: event.target.value },
                                `note-${app.id}`,
                              )
                            }
                          />
                        </label>

                        <TagEditor
                          tags={app.tags}
                          onChange={(tags) =>
                            updateAppMeta(category.id, app.id, { tags }, `tags-${app.id}`)
                          }
                        />

                        <label className="field mb-0">
                          <span className="field-label">
                            <span>移动到分类</span>
                          </span>
                          <select
                            className="text-input detail-select"
                            value={category.id}
                            onChange={(event) => {
                              moveAppToCategory(category.id, app.id, event.target.value)
                              showToast('已移动到其他分类')
                            }}
                          >
                            {doc.categories.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name || '未命名分类'}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}
                  </div>
                ))}

                {!category.apps.length && <p className="app-empty">这个分类还没有软件</p>}
              </div>

              <button
                className="btn cat-add-app"
                type="button"
                onClick={() => setPicker({ mode: 'add', categoryId: category.id })}
              >
                <Plus size={13} />
                添加软件
              </button>
            </section>
          ))}
        </div>

        <button className="btn mt-3 w-full" type="button" onClick={addCategory}>
          <Plus size={13} />
          添加分类
        </button>
        <p className="panel-note mt-2">
          共 {doc.categories.length} 个分类 /{' '}
          {doc.categories.reduce((total, category) => total + category.apps.length, 0)} 个软件
          {doc.categories.length > 6 && '，内容较多，导出前建议检查是否超出画布'}
        </p>
      </div>

      {picker && (
        <IconPicker
          open
          mode={picker.mode}
          title={picker.mode === 'replace' ? `替换「${picker.name}」的图标` : '添加软件'}
          currentLibraryId={picker.mode === 'replace' ? picker.libraryId : null}
          canReset={picker.mode === 'replace' && picker.canReset}
          onClose={() => setPicker(null)}
          onPick={handlePick}
          onReset={handleResetIcon}
        />
      )}
    </>
  )
}
