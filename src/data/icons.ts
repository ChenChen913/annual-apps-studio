export type LibraryIcon = {
  id: string
  label: string
  src: string
  keywords: string
}

export const ICON_LIBRARY: LibraryIcon[] = [
  { id: 'localsend', label: 'LocalSend', src: '/icons/localsend.webp', keywords: '传输 局域网' },
  { id: 'faststone', label: 'FastStone', src: '/icons/faststone.webp', keywords: '截图 看图' },
  { id: 'typeless', label: 'Typeless', src: '/icons/typeless.webp', keywords: '语音 输入' },
  { id: 'wetype', label: '微信输入法', src: '/icons/wetype.webp', keywords: '输入法 微信' },
  { id: 'doubao_ime', label: '豆包输入法', src: '/icons/doubao_ime.webp', keywords: '输入法 字节' },
  { id: 'v2rayn', label: 'v2rayN', src: '/icons/v2rayn.webp', keywords: '代理 网络 v2ray 科学上网' },
  { id: 'trae', label: 'TRAE', src: '/icons/trae.webp', keywords: '编程 AI IDE' },
  { id: 'workbuddy', label: 'WorkBuddy', src: '/icons/workbuddy.webp', keywords: '办公 AI 助手' },
  { id: 'claude_code', label: 'Claude Code', src: '/icons/claude_code.webp', keywords: '编程 AI 终端' },
  { id: 'hermes', label: 'Hermes', src: '/icons/hermes.webp', keywords: 'AI 助手' },
  { id: 'deepseek_harness', label: 'DeepSeek Harness', src: '/icons/deepseek_harness.webp', keywords: 'AI 深度求索' },
  { id: 'notepadpp', label: 'Notepad++', src: '/icons/notepadpp.webp', keywords: '编辑器 文本' },
  { id: 'obsidian', label: 'Obsidian', src: '/icons/obsidian.webp', keywords: '笔记 知识库' },
  { id: 'typora', label: 'Typora', src: '/icons/typora.webp', keywords: 'Markdown 写作' },
  { id: 'feishu', label: '飞书', src: '/icons/feishu.webp', keywords: '协作 办公 文档' },
  { id: 'chrome', label: 'Google Chrome', src: '/icons/chrome.webp', keywords: '浏览器' },
  { id: 'edge', label: 'Microsoft Edge', src: '/icons/edge.webp', keywords: '浏览器 微软' },
  { id: 'douyin', label: '抖音', src: '/icons/douyin.webp', keywords: '视频 社交' },
  { id: 'yuanbao', label: '元宝', src: '/icons/yuanbao.webp', keywords: '腾讯 AI' },
  { id: 'wechat', label: '微信', src: '/icons/wechat.webp', keywords: '社交 聊天' },
]

export const ICON_MAP = new Map(ICON_LIBRARY.map((icon) => [icon.id, icon]))

export function getIconSrc(app: { libraryId: string | null; iconSrc: string | null }) {
  if (app.iconSrc) return app.iconSrc
  if (app.libraryId) return ICON_MAP.get(app.libraryId)?.src ?? null
  return null
}
