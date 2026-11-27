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
  { id: 'general', name: 'AI 综合 / 科普', color: '#71539B' },
  { id: 'creators', name: '公众号 / 视频号', color: '#AE4A48' },
  { id: 'official', name: '推荐公众号 / 官号', color: '#B86A3C' },
  { id: 'teachers', name: 'B 站老师阵营', color: '#3D6F8E' },
  { id: 'podcasts', name: 'AI 播客', color: '#7A4A9E' },
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
  { key: 'xuanli199', name: '玄离199', note: 'B站 · 抖音' },
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
  { key: 'stormzhang', name: 'stormzhang', note: '公众号 · 视频号' },
  { key: 'woyin', name: '沃垠AI', note: '公众号 · 视频号' },
  { key: 'xiangyang', name: '向阳乔木推荐看', note: '公众号 · 视频号' },
  { key: 'xiaohu', name: '小互AI', note: '公众号 · 视频号' },
  { key: 'xiaolin', name: '小林coding', note: '公众号 · 视频号' },
  { key: 'xixiaoyao', name: '夕小瑶科技说', note: '公众号 · 视频号' },
  { key: 'zangai', name: '葬AI', note: '公众号 · 网站' },
]

const OFFICIAL: CreatorSeed[] = [
  { key: 'tencent_research', name: '腾讯研究院', note: '公众号 · 视频号' },
  { key: 'ali_tech', name: '阿里技术', note: '公众号 · 视频号' },
  { key: 'tencent_cloud_dev', name: '腾讯云开发者', note: '公众号 · 视频号' },
  { key: 'tencent_tech_eng', name: '腾讯技术工程', note: '公众号 · 视频号' },
  { key: 'tencent_tech', name: '腾讯科技', note: '公众号 · 视频号' },
  { key: 'latepost', name: '晚点 LatePost', note: '公众号 · 视频号' },
]

const TEACHERS: CreatorSeed[] = [
  { key: 'wenda', name: '吴恩达', note: 'B站 · AI 课程' },
  { key: 'limu', name: '李沐', note: 'B站 · 论文精读' },
  { key: 'lihongyi', name: '李宏毅', note: 'B站 · 机器学习' },
  { key: 'threeblueonebrown', name: '3Blue1Brown', note: 'B站 · 数学可视化' },
  { key: 'karpathy', name: 'Andrej Karpathy', note: 'X · 深度学习' },
  { key: 'stanford_cs229', name: 'Stanford CS229', note: '斯坦福 · 机器学习' },
  { key: 'mit_6s191', name: 'MIT 6.S191', note: 'MIT · 深度学习导论' },
]

const PODCASTS: CreatorSeed[] = [
  { key: 'zhangxiaojun', name: '张小珺', note: '播客 · 小宇宙' },
  { key: 'crossing', name: '十字路口 Crossing', note: '播客 · 小宇宙' },
  { key: 'silicon101', name: '硅谷 101', note: '播客 · 小宇宙' },
  { key: 'signal_noise', name: '信号与噪声', note: '播客 · 小宇宙' },
  { key: 'tulong', name: '屠龙之术', note: '播客 · 苹果播客' },
]

const SITES: CreatorSeed[] = [
  { key: 'site_aihot', name: 'AI Hot', note: 'aihot.news' },
  { key: 'site_reddit', name: 'Reddit', note: 'www.reddit.com' },
  { key: 'site_v2ex', name: 'V2EX', note: 'www.v2ex.com' },
  { key: 'site_linuxdo', name: 'Linux.do', note: 'linux.do' },
  { key: 'site_github', name: 'GitHub Trending', note: 'github.com/trending' },
  { key: 'site_x', name: 'X', note: 'x.com' },
  { key: 'site_youtube', name: 'YouTube', note: 'www.youtube.com' },
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
  toCategory('general', 'AI 综合 / 科普', GENERAL),
  toCategory('creators', '公众号 / 视频号', CREATORS),
  toCategory('official', '推荐公众号 / 官号', OFFICIAL),
  toCategory('teachers', 'B 站老师阵营', TEACHERS),
  toCategory('podcasts', 'AI 播客', PODCASTS),
  toCategory('sites', 'AI 信息站', SITES),
]

export const AI_INDEX_TOTAL = AI_INDEX_CATEGORIES.reduce(
  (total, category) => total + category.apps.length,
  0,
)

/**
 * 66 条 AI 创作者 / 官号 / 老师 / 播客 / 信息源的示例工程。
 * 4:5、1600×2000，图片背景，左侧分类标签 + 八列索引网格。
 */
export function createAiIndexDoc(): PosterDoc {
  return {
    ...createDefaultDoc(),
    title: '2026 年我推荐的 AI 创作者与信息源',
    templateId: 'index',
    ratio: '4:5',
    exportFormat: 'png',
    bg: 'photo-forestfog-tall',
    bgBlur: 2,
    dim: 30,
    color: '#ffffff',
    names: true,
    shadow: true,
    showMeta: false,
    iconShape: 'circle',
    columns: 8,
    iconSize: 88,
    gapX: 176,
    gapY: 166,
    startX: 88,
    startY: 310,
    titleSize: 64,
    catSize: 32,
    nameSize: 16,
    exportScale: 3,
    categories: AI_INDEX_CATEGORIES,
  }
}
