import { createDefaultDoc } from './defaultProject'
import type { AppItem, Category, PosterDoc } from '../types'

export type AiIndexCategory = {
  id: string
  name: string
  color: string
}

export const AI_INDEX_LEGEND: AiIndexCategory[] = [
  { id: 'enlightenment', name: 'AI 启蒙', color: '#D36A2E' },
  { id: 'tech', name: 'AI 技术', color: '#2F5E9E' },
  { id: 'general', name: 'AI 综合', color: '#71539B' },
  { id: 'creators', name: 'AI 创作者', color: '#AE4A48' },
  { id: 'sites', name: 'AI 信息站', color: '#2F7857' },
]

type CreatorSeed = {
  key: string
  name: string
  note: string
}

const ENLIGHTENMENT: CreatorSeed[] = [
  { key: 'qiuzhi2046', name: '秋芝2046', note: 'B站 · 抖音' },
  { key: 'xuan_jiang', name: 'Xuan_酱', note: 'B站 · 抖音' },
  { key: 'xuanli199', name: '玄离199', note: 'B站 · 抖音' },
]

const TECH: CreatorSeed[] = [
  { key: 'feitian', name: '飞天闪客', note: 'B站 · 抖音' },
  { key: 'papaxia', name: '技术爬爬虾', note: 'B站 · 抖音' },
  { key: 'yupi', name: '程序员鱼皮', note: 'B站 · 抖音' },
]

const GENERAL: CreatorSeed[] = [
  { key: 'linyi', name: '林亦LYi', note: 'B站 · 抖音' },
  { key: 'youmuren', name: '数字游牧人Samuel', note: '抖音 · B站' },
  { key: 'muzi', name: '木子不写代码', note: 'B站 · 抖音' },
  { key: 'xiaohui', name: '晓辉博士', note: 'B站 · 抖音' },
]

const CREATORS: CreatorSeed[] = [
  { key: 'kazike', name: '数字生命卡兹克', note: '公众号 · 视频号' },
  { key: 'kaer', name: '卡尔的AI沃茨', note: '公众号 · 视频号' },
  { key: 'cxuan', name: 'cxuanAI', note: '公众号 · 视频号' },
  { key: 'saibo', name: '赛博禅心', note: '公众号 · 视频号' },
  { key: 'guizang', name: '歸藏的AI工具箱', note: '公众号 · 视频号' },
  { key: 'baoyu', name: '宝玉AI', note: '公众号 · X' },
  { key: 'canghe', name: '苍何', note: '公众号 · 视频号' },
  { key: 'aiying', name: 'AI产品阿颖', note: '公众号 · 视频号' },
  { key: 'azhen', name: '阿真Irene', note: '公众号 · 视频号' },
  { key: 'yize', name: '一泽Eze', note: '公众号 · 视频号' },
  { key: 'daishu', name: '袋鼠帝AI客栈', note: '公众号 · 视频号' },
  { key: 'xiaohui_coder', name: '程序员小灰', note: '公众号 · 视频号' },
  { key: 'draco', name: 'Draco正在VibeCoding', note: '公众号 · 视频号' },
  { key: 'gongzilong', name: '公子龙', note: '公众号 · 视频号' },
  { key: 'jackcui', name: 'JackCui', note: '公众号 · B站' },
  { key: 'javaguide', name: 'JavaGuide', note: '公众号 · GitHub' },
  { key: 'jiamu', name: '甲木未来派', note: '公众号 · 视频号' },
  { key: 'juai', name: '橘AI', note: '公众号 · 视频号' },
  { key: 'liuxiaopai', name: '刘小排r', note: '公众号 · 视频号' },
  { key: 'luoxiaoshan', name: '洛小山', note: '公众号 · 视频号' },
  { key: 'lurenjia', name: '路人甲TM', note: '公众号 · 视频号' },
  { key: 'moli', name: '莫理', note: '公众号 · 视频号' },
  { key: 'moyu', name: '摸鱼小李', note: '公众号 · 视频号' },
  { key: 'zhangzala', name: '张咋啦Zara', note: '公众号 · 视频号' },
  { key: 'shutongwen', name: '书同文Suwin', note: '公众号 · 视频号' },
  { key: 'stormzhang', name: 'stormzhang', note: '公众号 · 视频号' },
  { key: 'woyin', name: '沃垠AI', note: '公众号 · 视频号' },
  { key: 'xiangyang', name: '向阳乔木推荐看', note: '公众号 · 视频号' },
  { key: 'xiaohu', name: '小互AI', note: '公众号 · 视频号' },
  { key: 'xiaolin', name: '小林coding', note: '公众号 · 视频号' },
  { key: 'xixiaoyao', name: '夕小瑶科技说', note: '公众号 · 视频号' },
  { key: 'zangai', name: '葬AI', note: '公众号 · 网站' },
]

const SITES: CreatorSeed[] = [
  { key: 'site_aihot', name: 'AI Hot', note: 'aihot.news' },
  { key: 'site_reddit', name: 'Reddit', note: 'reddit.com' },
  { key: 'site_v2ex', name: 'V2EX', note: 'v2ex.com' },
  { key: 'site_linuxdo', name: 'Linux.do', note: 'linux.do' },
  { key: 'site_github', name: 'GitHub Trending', note: 'github.com/trending' },
  { key: 'site_x', name: 'X', note: 'x.com' },
  { key: 'site_youtube', name: 'YouTube', note: 'youtube.com' },
]

function toApp(seed: CreatorSeed): AppItem {
  return {
    id: `ai-${seed.key}`,
    name: seed.name,
    libraryId: `creator:${seed.key}`,
    iconSrc: null,
    note: seed.note,
    rating: 0,
    tags: [],
  }
}

function toCategory(id: string, name: string, seeds: CreatorSeed[]): Category {
  return {
    id: `ai-${id}`,
    name,
    apps: seeds.map(toApp),
  }
}

export const AI_INDEX_CATEGORIES: Category[] = [
  toCategory('enlightenment', 'AI 启蒙', ENLIGHTENMENT),
  toCategory('tech', 'AI 技术', TECH),
  toCategory('general', 'AI 综合', GENERAL),
  toCategory('creators', 'AI 创作者', CREATORS),
  toCategory('sites', 'AI 信息站', SITES),
]

export const AI_INDEX_TOTAL = AI_INDEX_CATEGORIES.reduce(
  (total, category) => total + category.apps.length,
  0,
)

/**
 * 49 条 AI 创作者 / 信息源的示例工程。
 * 版式按 4:5、1600×2000、7 列 × 7 行设计；内容顺序与用户提供的名单一致。
 */
export function createAiIndexDoc(): PosterDoc {
  return {
    ...createDefaultDoc(),
    title: 'AI 创作者与信息源',
    templateId: 'index',
    ratio: '4:5',
    exportFormat: 'png',
    bg: 'design-paper',
    dim: 0,
    color: '#211d18',
    names: true,
    shadow: false,
    showMeta: true,
    iconShape: 'circle',
    columns: 7,
    iconSize: 92,
    gapX: 203,
    gapY: 210,
    startX: 88,
    startY: 430,
    titleSize: 96,
    catSize: 18,
    nameSize: 15,
    exportScale: 3,
    categories: AI_INDEX_CATEGORIES,
  }
}
