import { Download, Loader2, Redo2, Undo2 } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Poster } from './components/Poster'
import { BackgroundPanel } from './components/panels/BackgroundPanel'
import { ContentPanel } from './components/panels/ContentPanel'
import { ProjectPanel } from './components/panels/ProjectPanel'
import { TemplatePanel } from './components/panels/TemplatePanel'
import { BACKGROUNDS } from './data/backgrounds'
import { ICON_LIBRARY } from './data/icons'
import { RATIOS, getCanvas } from './data/ratios'
import { getTemplate } from './data/templates'
import { exportPoster } from './lib/export'
import type { ExportFormat } from './types'
import { usePosterStore } from './store/posterStore'
import { useUiStore } from './store/uiStore'

const TABS = [
  { id: 'content', label: '内容' },
  { id: 'style', label: '模板' },
  { id: 'background', label: '背景' },
  { id: 'project', label: '项目' },
] as const

type TabId = (typeof TABS)[number]['id']

function App() {
  const doc = usePosterStore((state) => state.doc)
  const pastCount = usePosterStore((state) => state.past.length)
  const futureCount = usePosterStore((state) => state.future.length)
  const undo = usePosterStore((state) => state.undo)
  const redo = usePosterStore((state) => state.redo)
  const setField = usePosterStore((state) => state.setField)
  const setRatio = usePosterStore((state) => state.setRatio)
  const toast = useUiStore((state) => state.toast)
  const showToast = useUiStore((state) => state.showToast)

  const posterRef = useRef<HTMLDivElement>(null)
  const previewAreaRef = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(0.55)
  const [tab, setTab] = useState<TabId>('content')
  const [exporting, setExporting] = useState(false)

  const template = getTemplate(doc.templateId)
  const canvas = getCanvas(doc.ratio)
  const appCount = doc.categories.reduce((total, category) => total + category.apps.length, 0)

  useLayoutEffect(() => {
    const element = previewAreaRef.current
    if (!element) return
    const update = () => {
      const rect = element.getBoundingClientRect()
      const width = Math.max(280, rect.width - 52)
      const height = Math.max(200, rect.height - 52)
      setPreviewScale(Math.min(width / canvas.width, height / canvas.height, 1))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [canvas.width, canvas.height])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey
      if (!modifier) return
      const key = event.key.toLowerCase()
      if (key === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
      } else if (key === 'y') {
        event.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const handleExport = async () => {
    if (!posterRef.current) return
    setExporting(true)
    try {
      await exportPoster(posterRef.current, {
        scale: doc.exportScale,
        title: doc.title,
        templateName: template.name,
        width: canvas.width,
        height: canvas.height,
        format: doc.exportFormat,
      })
      showToast(`${doc.exportFormat.toUpperCase()} 已开始下载`)
    } catch (error) {
      console.error(error)
      showToast('导出失败，请重试或降低倍率')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="topbar flex-wrap">
        <div className="brand-mark">26</div>
        <div className="min-w-0">
          <h1 className="truncate text-[14px] font-semibold tracking-tight">我的年度软件</h1>
          <p className="topbar-sub truncate text-[11px] text-[#75827a]">
            {template.name}模板 · {doc.categories.length} 个分类 · {appCount} 个软件
          </p>
        </div>

        <div className="topbar-actions">
          <div className="history-group">
            <button
              className="icon-btn"
              type="button"
              onClick={undo}
              disabled={!pastCount}
              title="撤销（Ctrl / Cmd + Z）"
              aria-label="撤销"
            >
              <Undo2 size={15} />
            </button>
            <button
              className="icon-btn"
              type="button"
              onClick={redo}
              disabled={!futureCount}
              title="重做（Ctrl / Cmd + Shift + Z）"
              aria-label="重做"
            >
              <Redo2 size={15} />
            </button>
          </div>

          <span className="hidden items-center text-[11px] text-[#75827a] sm:inline-flex">
            <span className="status-dot" />
            自动保存
          </span>

          <select
            className="rounded-[9px] border border-[#dfe4dd] bg-white px-2.5 py-2 text-[11.5px] text-[#1e2723] outline-none"
            value={doc.exportFormat}
            onChange={(event) =>
              setField('exportFormat', event.target.value as ExportFormat, 'exportFormat')
            }
            aria-label="导出格式"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
          </select>
          <select
            className="rounded-[9px] border border-[#dfe4dd] bg-white px-2.5 py-2 text-[11.5px] text-[#1e2723] outline-none"
            value={doc.exportScale}
            onChange={(event) =>
              setField('exportScale', Number(event.target.value) as 1 | 2 | 3, 'exportScale')
            }
            aria-label="导出倍率"
          >
            <option value={1}>1× · {canvas.width}×{canvas.height}</option>
            <option value={2}>2× · {canvas.width * 2}×{canvas.height * 2}</option>
            <option value={3}>3× · {canvas.width * 3}×{canvas.height * 3}</option>
          </select>
          <button className="btn btn-primary" type="button" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
            下载 {doc.exportFormat.toUpperCase()}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1900px] gap-4 p-4 lg:grid-cols-[400px_minmax(0,1fr)] lg:p-5">
        <aside className="panel h-fit max-h-[calc(100vh-92px)] overflow-hidden lg:sticky lg:top-[72px]">
          <nav className="panel-tabs" aria-label="编辑面板">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={tab === item.id ? 'active' : ''}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="panel-scroll">
            {tab === 'content' && <ContentPanel />}
            {tab === 'style' && <TemplatePanel />}
            {tab === 'background' && <BackgroundPanel />}
            {tab === 'project' && <ProjectPanel />}
          </div>
        </aside>

        <section className="stage">
          <div className="stage-bar">
            <span>实时预览 · {doc.ratio}</span>
            <div className="ratio-switch ml-3">
              {RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  className={doc.ratio === ratio.id ? 'active' : ''}
                  onClick={() => setRatio(ratio.id)}
                  title={ratio.hint}
                >
                  {ratio.id}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="stage-badge">{template.name}</span>
              <span className="text-[10px] text-white/35">
                {Math.round(previewScale * 100)}%
              </span>
            </div>
          </div>
          <div className="preview-area" ref={previewAreaRef}>
            <div
              className="preview-frame"
              style={{ width: canvas.width * previewScale, height: canvas.height * previewScale }}
            >
              <div
                style={{
                  width: canvas.width,
                  height: canvas.height,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <Poster ref={posterRef} doc={doc} />
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 px-5 py-3 text-[10.5px] leading-5 text-white/40">
            13 套模板 · {BACKGROUNDS.length} 张背景 · {ICON_LIBRARY.length} 个内置软件图标 · 6 种画幅 ·
            图标、背景、字体全部本地加载，断网也能编辑和导出。
          </div>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1e2723] px-4 py-2 text-[12px] text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
