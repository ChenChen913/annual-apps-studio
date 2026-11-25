import { Archive, Download, FileJson, FolderOpen, Loader2, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { EXPORT_PRESETS } from '../../data/presets'
import { getCanvas } from '../../data/ratios'
import { getTemplate } from '../../data/templates'
import { downloadProjectFile, readProjectFile } from '../../lib/project'
import { useDraftsStore } from '../../store/draftsStore'
import { usePosterStore } from '../../store/posterStore'
import { useUiStore } from '../../store/uiStore'
import { SectionTitle } from '../ui'

function formatDraftTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ProjectPanel() {
  const doc = usePosterStore((state) => state.doc)
  const importDoc = usePosterStore((state) => state.importDoc)
  const resetAll = usePosterStore((state) => state.resetAll)
  const applyExportPreset = usePosterStore((state) => state.applyExportPreset)
  const drafts = useDraftsStore((state) => state.drafts)
  const saveDraft = useDraftsStore((state) => state.saveDraft)
  const removeDraft = useDraftsStore((state) => state.removeDraft)
  const removeAllDrafts = useDraftsStore((state) => state.removeAllDrafts)
  const showToast = useUiStore((state) => state.showToast)
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftName, setDraftName] = useState('')

  const appCount = doc.categories.reduce((total, category) => total + category.apps.length, 0)
  const canvas = getCanvas(doc.ratio)
  const activePreset = EXPORT_PRESETS.find(
    (preset) =>
      preset.ratio === doc.ratio &&
      preset.scale === doc.exportScale &&
      preset.format === doc.exportFormat,
  )

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!window.confirm('导入项目会覆盖当前海报内容，确定继续吗？')) return
    setBusy(true)
    try {
      const next = await readProjectFile(file)
      importDoc(next)
      showToast('项目已导入')
    } catch (error) {
      console.error(error)
      showToast(error instanceof Error ? error.message : '项目文件读取失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="panel-section">
        <SectionTitle icon={<Save size={13} />}>项目</SectionTitle>
        <div className="project-stats">
          <div>
            <strong>{doc.categories.length}</strong>
            <span>分类</span>
          </div>
          <div>
            <strong>{appCount}</strong>
            <span>软件</span>
          </div>
          <div>
            <strong>{doc.ratio}</strong>
            <span>画幅</span>
          </div>
        </div>
        <p className="panel-note">
          当前内容会自动保存到浏览器本地数据库（IndexedDB），刷新或关闭页面都不会丢失。上传的图片也包含在项目里。
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <button className="btn w-full" type="button" onClick={() => downloadProjectFile(doc)}>
            <FileJson size={14} />
            导出项目文件
          </button>
          <button
            className="btn w-full"
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
          >
            {busy ? <Loader2 className="animate-spin" size={14} /> : <FolderOpen size={14} />}
            {busy ? '导入中…' : '导入项目文件'}
          </button>
        </div>
        <p className="panel-note mt-2">
          项目文件是单个 <code>.yearapps</code> 文件（JSON 格式），包含全部文字、排版、背景和上传的图片，换设备也能继续编辑。
        </p>
      </div>

      <div className="panel-section">
        <SectionTitle icon={<Archive size={13} />}>草稿箱</SectionTitle>
        <div className="flex items-center justify-between gap-2">
          <span className="panel-note">
            {drafts.length} / 20 份，同名草稿会覆盖
          </span>
          <button
            className="chip"
            type="button"
            onClick={() => {
              setDraftName(doc.title)
              setSavingDraft((value) => !value)
            }}
          >
            {savingDraft ? '取消' : '保存当前'}
          </button>
        </div>

        {savingDraft && (
          <div className="draft-save">
            <input
              className="text-input"
              value={draftName}
              maxLength={30}
              placeholder="草稿名称"
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  const draft = saveDraft(draftName, doc)
                  showToast(`已保存草稿「${draft.name}」`)
                  setSavingDraft(false)
                }
              }}
              autoFocus
            />
            <button
              className="btn btn-primary px-3 text-[11px]"
              type="button"
              onClick={() => {
                const draft = saveDraft(draftName, doc)
                showToast(`已保存草稿「${draft.name}」`)
                setSavingDraft(false)
              }}
            >
              保存
            </button>
          </div>
        )}

        <div className="draft-list">
          {drafts.map((draft) => (
            <div className="draft-row" key={draft.id}>
              <div className="draft-info">
                <b>{draft.name}</b>
                <small>
                  {formatDraftTime(draft.savedAt)} · {getTemplate(draft.doc.templateId).name} ·{' '}
                  {draft.doc.categories.reduce((total, category) => total + category.apps.length, 0)} 个软件
                </small>
              </div>
              <div className="draft-actions">
                <button
                  className="draft-load"
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`载入「${draft.name}」会覆盖当前编辑内容，确定继续吗？`)) return
                    importDoc(JSON.parse(JSON.stringify(draft.doc)) as typeof doc)
                    showToast(`已载入草稿「${draft.name}」`)
                  }}
                >
                  载入
                </button>
                <button
                  className="icon-btn danger"
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`删除草稿「${draft.name}」？`)) return
                    removeDraft(draft.id)
                    showToast('草稿已删除')
                  }}
                  aria-label={`删除草稿 ${draft.name}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {!drafts.length && (
            <p className="draft-empty">还没有草稿。保存当前海报后，可以随时切回这一版。</p>
          )}
        </div>

        {drafts.length > 0 && (
          <button
            className="btn btn-ghost mt-2 w-full px-0 text-[11px]"
            type="button"
            onClick={() => {
              if (!window.confirm('清空所有草稿？此操作不会影响当前海报。')) return
              removeAllDrafts()
              showToast('草稿箱已清空')
            }}
          >
            <Trash2 size={12} />
            清空草稿箱
          </button>
        )}
      </div>

      <div className="panel-section">
        <SectionTitle icon={<Download size={13} />}>导出预设</SectionTitle>
        <div className="preset-grid">
          {EXPORT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`preset-card ${activePreset?.id === preset.id ? 'active' : ''}`}
              type="button"
              onClick={() => {
                applyExportPreset(preset.ratio, preset.scale, preset.format)
                showToast(`已应用「${preset.name}」预设`)
              }}
            >
              <b>{preset.name}</b>
              <small>{preset.hint}</small>
            </button>
          ))}
        </div>
        <p className="panel-note mt-2">
          应用预设会同时切换画幅、倍率和格式，并按画幅重新排版。当前 {doc.ratio}，1× 导出{' '}
          {canvas.width}×{canvas.height}。
        </p>
      </div>

      <div className="panel-section">
        <SectionTitle icon={<RotateCcw size={13} />}>重置</SectionTitle>
        <button
          className="btn btn-danger w-full"
          type="button"
          onClick={() => {
            if (!window.confirm('恢复默认海报？当前标题、分类、图标、背景和排版都会被清空。')) return
            resetAll()
            showToast('已恢复默认海报')
          }}
        >
          <RotateCcw size={14} />
          恢复默认海报
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".yearapps,application/json,application/octet-stream"
        className="hidden"
        onChange={handleImport}
      />
    </>
  )
}
