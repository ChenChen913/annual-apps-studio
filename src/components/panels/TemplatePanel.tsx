import { Check, LayoutGrid, Palette, RotateCcw, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { TEMPLATES, getTemplate } from '../../data/templates'
import { usePosterStore } from '../../store/posterStore'
import { usePrefsStore } from '../../store/prefsStore'
import { useUiStore } from '../../store/uiStore'
import { RangeField, SectionTitle } from '../ui'

const COLOR_PRESETS = [
  { name: '纯白', value: '#ffffff' },
  { name: '暖白', value: '#f4efe2' },
  { name: '墨黑', value: '#232a25' },
  { name: '薄荷', value: '#c9fff3' },
]

export function TemplatePanel() {
  const doc = usePosterStore((state) => state.doc)
  const setField = usePosterStore((state) => state.setField)
  const applyTemplate = usePosterStore((state) => state.applyTemplate)
  const loadAiIndex = usePosterStore((state) => state.loadAiIndex)
  const setBackground = usePosterStore((state) => state.setBackground)
  const showToast = useUiStore((state) => state.showToast)
  const favorites = usePrefsStore((state) => state.favoriteTemplates)
  const toggleFavorite = usePrefsStore((state) => state.toggleFavorite)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const current = getTemplate(doc.templateId)
  const visibleTemplates = onlyFavorites
    ? TEMPLATES.filter((template) => favorites.includes(template.id))
    : TEMPLATES

  const totalApps = doc.categories.reduce((total, category) => total + category.apps.length, 0)
  const estimatedRows = doc.templateId === 'index'
    ? Math.max(1, Math.ceil(totalApps / Math.max(1, doc.columns)))
    : doc.categories.reduce(
        (total, category) => total + Math.max(1, Math.ceil(category.apps.length / doc.columns)),
        0,
      )
  const rowLimit =
    doc.templateId === 'index'
      ? 7
      : doc.ratio === '16:9'
        ? 4
        : doc.ratio === '1:1'
          ? 5
          : doc.ratio === '4:5'
            ? 6
            : 6

  return (
    <>
      <div className="panel-section">
        <SectionTitle icon={<LayoutGrid size={13} />}>模板</SectionTitle>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="panel-note">
            共 {TEMPLATES.length} 套 · 收藏 {favorites.length} 套
          </span>
          <button
            className={`chip ${onlyFavorites ? 'active' : ''}`}
            type="button"
            onClick={() => setOnlyFavorites((value) => !value)}
          >
            <Star size={11} fill={onlyFavorites ? 'currentColor' : 'none'} />
            只看收藏
          </button>
        </div>
        <div className="template-grid">
          {visibleTemplates.map((template) => {
            const isFavorite = favorites.includes(template.id)
            return (
              <button
                key={template.id}
                type="button"
                className={`template-card ${doc.templateId === template.id ? 'active' : ''}`}
                onClick={() => {
                  applyTemplate(template.id)
                  showToast(`已切换到「${template.name}」模板`)
                }}
              >
                <span
                  className={`template-fav ${isFavorite ? 'on' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={isFavorite ? `取消收藏 ${template.name}` : `收藏 ${template.name}`}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    toggleFavorite(template.id)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      event.stopPropagation()
                      toggleFavorite(template.id)
                    }
                  }}
                >
                  <Star size={11} fill={isFavorite ? 'currentColor' : 'none'} />
                </span>
                <span className={`template-thumb thumb-${template.id}`}>
                  <i className="thumb-title">Aa</i>
                  <i className="thumb-line" />
                  <span className="thumb-dots">
                    {Array.from({ length: template.id === 'index' ? 7 : 3 }).map((_, index) => (
                      <i key={index} />
                    ))}
                  </span>
                </span>
                <span className="template-meta">
                  <b>
                    {template.name}
                    <em>{template.english}</em>
                  </b>
                  <small>{template.description}</small>
                </span>
              </button>
            )
          })}
        </div>
        {onlyFavorites && !visibleTemplates.length && (
          <p className="panel-note mt-2">还没有收藏的模板，点击模板右上角的星标即可收藏。</p>
        )}

        {doc.templateId === 'index' && (
          <div className="index-preset">
            <div>
              <b>AI 创作者与信息源</b>
              <small>内置 49 条名录示例 · 42 位创作者 + 7 个信息站</small>
            </div>
            <button
              className="btn btn-primary index-preset-btn"
              type="button"
              onClick={() => {
                loadAiIndex()
                showToast('已载入 49 条 AI 创作者与信息源')
              }}
            >
              <Sparkles size={13} />
              载入名录
            </button>
          </div>
        )}

        <div className="recommend-row">
          <span>推荐背景</span>
          <button
            className="chip"
            type="button"
            onClick={() => {
              setBackground(current.recommendBg)
              showToast(`已搭配「${current.recommendBgName}」背景`)
            }}
          >
            {current.recommendBgName}
          </button>
          <span className="recommend-hint">切换模板不会改变已选背景</span>
        </div>
      </div>

      <div className="panel-section">
        <SectionTitle icon={<LayoutGrid size={13} />}>排版</SectionTitle>
        <RangeField
          label="每行图标数"
          value={doc.columns}
          min={3}
          max={8}
          onChange={(value) => setField('columns', value, 'columns')}
          suffix=" 个"
        />
        <RangeField
          label="图标大小"
          value={doc.iconSize}
          min={72}
          max={140}
          onChange={(value) => setField('iconSize', value, 'iconSize')}
          suffix="px"
        />
        {doc.templateId === 'elegant' && (
          <>
            <RangeField
              label="横向间距"
              value={doc.gapX}
              min={140}
              max={270}
              onChange={(value) => setField('gapX', value, 'gapX')}
            />
            <RangeField
              label="行间距"
              value={doc.gapY}
              min={130}
              max={240}
              onChange={(value) => setField('gapY', value, 'gapY')}
            />
            <RangeField
              label="图标起始 X"
              value={doc.startX}
              min={180}
              max={380}
              onChange={(value) => setField('startX', value, 'startX')}
            />
            <RangeField
              label="首行 Y"
              value={doc.startY}
              min={200}
              max={330}
              onChange={(value) => setField('startY', value, 'startY')}
            />
          </>
        )}
        <RangeField
          label="标题字号"
          value={doc.titleSize}
          min={54}
          max={110}
          onChange={(value) => setField('titleSize', value, 'titleSize')}
          suffix="px"
        />
        <RangeField
          label="分类字号"
          value={doc.catSize}
          min={16}
          max={44}
          onChange={(value) => setField('catSize', value, 'catSize')}
          suffix="px"
        />
        <RangeField
          label="应用名字号"
          value={doc.nameSize}
          min={10}
          max={26}
          onChange={(value) => setField('nameSize', value, 'nameSize')}
          suffix="px"
        />

        {estimatedRows > rowLimit && (
          <p className="panel-warning">
            当前内容约占 {estimatedRows} 行，超过这个画幅建议的 {rowLimit} 行，可能被画布裁切。可以增加每行图标数，或减少条目。
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            className={`chip ${doc.names ? 'active' : ''}`}
            type="button"
            onClick={() => setField('names', !doc.names, 'names')}
          >
            {doc.names && <Check size={12} />}
            显示应用名
          </button>
          <button
            className={`chip ${doc.shadow ? 'active' : ''}`}
            type="button"
            onClick={() => setField('shadow', !doc.shadow, 'shadow')}
          >
            {doc.shadow && <Check size={12} />}
            图标投影
          </button>
          <button
            className={`chip ${doc.showMeta ? 'active' : ''}`}
            type="button"
            onClick={() => setField('showMeta', !doc.showMeta, 'showMeta')}
          >
            {doc.showMeta && <Check size={12} />}
            评分与标签
          </button>
          <button
            className={`chip ${doc.iconShape === 'circle' ? 'active' : ''}`}
            type="button"
            onClick={() =>
              setField('iconShape', doc.iconShape === 'circle' ? 'squircle' : 'circle', 'iconShape')
            }
          >
            {doc.iconShape === 'circle' && <Check size={12} />}
            圆形图标
          </button>
        </div>
        {doc.showMeta && (
          <p className="panel-note mt-2">
            评分和首个标签会跟在名称后；备注只在手账、杂志、报纸、极简、电影、终端模板中展示。
          </p>
        )}
      </div>

      <div className="panel-section">
        <SectionTitle icon={<Palette size={13} />}>文字颜色</SectionTitle>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              className={`chip ${doc.color.toLowerCase() === preset.value ? 'active' : ''}`}
              type="button"
              onClick={() => setField('color', preset.value, 'color')}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border border-black/10"
                style={{ background: preset.value }}
              />
              {preset.name}
            </button>
          ))}
          <label className="chip cursor-pointer">
            自定义
            <input
              type="color"
              className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
              value={doc.color}
              onChange={(event) => setField('color', event.target.value, 'color')}
              aria-label="自定义文字颜色"
            />
          </label>
        </div>
        <p className="panel-note">
          切换背景时会自动在深色和浅色文字之间切换；也可以在这里手动覆盖。
        </p>
        <button
          className="btn btn-ghost mt-2 px-0 text-[11.5px]"
          type="button"
          onClick={() => {
            applyTemplate(doc.templateId)
            showToast('已恢复当前模板的默认样式')
          }}
        >
          <RotateCcw size={13} />
          恢复模板默认样式
        </button>
      </div>
    </>
  )
}
