/**
 * 在线图标搜索：只用 Iconify 的公开 API（https://iconify.design 提供，允许跨域、无需密钥）。
 *
 * 只挑许可清晰的彩色品牌图标集，避免把不明来源、禁止再分发的素材混进本地库：
 *  - SVG Logos    CC0 1.0
 *  - Devicon      MIT
 *  - Simple Icons CC0 1.0
 *  - selfh.st     CC BY 4.0（保存时记录署名）
 *
 * 没有可靠接口的来源（macOSicons、Windows Icon Archive 等）不强行接入。
 */

export type OnlineIcon = {
  key: string
  prefix: string
  name: string
  setName: string
  license: string
  format: 'SVG'
  platform: string
  url: string
}

type CollectionInfo = { setName: string; license: string; platform: string }

const COLLECTIONS: Record<string, CollectionInfo> = {
  logos: { setName: 'SVG Logos', license: 'CC0 1.0', platform: '跨平台 · 品牌 Logo' },
  'simple-icons': { setName: 'Simple Icons', license: 'CC0 1.0', platform: '跨平台 · 单色品牌' },
  devicon: { setName: 'Devicon', license: 'MIT', platform: '跨平台 · 开发工具' },
  selfhst: { setName: 'selfh.st/icons', license: 'CC BY 4.0', platform: '跨平台 · 自托管软件' },
}

const API = 'https://api.iconify.design'

/** 中文搜索词 → 英文别名，在线图标集基本只有英文名 */
const ALIASES: Record<string, string[]> = {
  浏览器: ['browser', 'chrome', 'firefox'],
  编辑器: ['editor', 'vscode', 'sublime'],
  代码: ['code', 'vscode', 'github'],
  笔记: ['note', 'notion', 'obsidian'],
  文档: ['docs', 'notion', 'office'],
  办公: ['office', 'notion', 'slack'],
  聊天: ['chat', 'telegram', 'discord'],
  会议: ['meeting', 'zoom', 'teams'],
  音乐: ['music', 'spotify'],
  视频: ['video', 'youtube'],
  剪辑: ['video', 'premiere', 'davinci'],
  设计: ['design', 'figma', 'sketch'],
  绘图: ['design', 'photoshop', 'illustrator'],
  开发: ['dev', 'github', 'docker'],
  数据库: ['database', 'mysql', 'postgres'],
  终端: ['terminal', 'shell', 'bash'],
  输入法: ['input', 'keyboard'],
  下载: ['download', 'torrent', 'qbit'],
  网盘: ['cloud', 'drive', 'nextcloud'],
  密码: ['password', 'bitwarden', '1password'],
  远程: ['remote', 'desktop', 'anydesk'],
  微信: ['wechat', 'weixin'],
  飞书: ['lark', 'feishu'],
  钉钉: ['dingtalk'],
  抖音: ['tiktok', 'douyin'],
  哔哩哔哩: ['bilibili'],
  腾讯: ['tencent', 'qq'],
  阿里: ['alibaba', 'aliyun'],
  百度: ['baidu'],
  网易: ['netease', 'music'],
  小米: ['xiaomi', 'mi'],
  华为: ['huawei'],
}

function prettify(name: string) {
  return name
    .split('-')
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
    .replace(/\bAws\b/g, 'AWS')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bAi\b/g, 'AI')
}

function toResult(key: string): OnlineIcon | null {
  const [prefix, name] = key.split(':')
  const info = COLLECTIONS[prefix]
  if (!info || !name) return null
  return {
    key,
    prefix,
    name: prettify(name),
    setName: info.setName,
    license: info.license,
    format: 'SVG',
    platform: info.platform,
    url: `${API}/${prefix}/${name}.svg?height=160`,
  }
}

function collectAliases(query: string) {
  const list: string[] = []
  for (const [chinese, english] of Object.entries(ALIASES)) {
    if (query.includes(chinese)) list.push(...english)
  }
  return list
}

export async function searchOnlineIcons(rawQuery: string, signal?: AbortSignal): Promise<OnlineIcon[]> {
  const query = rawQuery.trim()
  if (!query) return []
  const terms = [query, ...collectAliases(query)].slice(0, 3)
  const seen = new Map<string, OnlineIcon>()

  for (const term of terms) {
    const response = await fetch(`${API}/search?query=${encodeURIComponent(term)}&limit=64`, { signal })
    if (!response.ok) {
      throw new Error(response.status === 429 ? '图标服务繁忙，请稍后再试' : '在线图标搜索失败')
    }
    const data = (await response.json()) as { icons?: string[] }
    for (const key of data.icons ?? []) {
      const result = toResult(key)
      if (result && !seen.has(result.key)) seen.set(result.key, result)
    }
    if (seen.size >= 36) break
  }

  return [...seen.values()].sort((a, b) => {
    const rank = (icon: OnlineIcon) => (icon.prefix === 'logos' ? 0 : icon.prefix === 'devicon' ? 1 : 2)
    return rank(a) - rank(b)
  })
}

/** 把在线 SVG 栅格化成 320px WebP data URL，离线也能继续使用 */
export async function rasterizeRemoteIcon(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('图标下载失败')
  const svg = await response.text()
  if (!svg.includes('<svg')) throw new Error('图标格式异常')
  const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

  const image = new Image()
  image.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('图标渲染失败'))
    image.src = encoded
  })

  const size = 320
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('无法创建画布')
  const ratio = Math.min(1, 288 / Math.max(image.width, image.height))
  const width = image.width * ratio
  const height = image.height * ratio
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height)
  return canvas.toDataURL('image/webp', 0.92)
}
