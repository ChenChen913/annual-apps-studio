import { del, get, set as setDb } from 'idb-keyval'

export const idbStorage = {
  getItem: async (name: string) => {
    try {
      return ((await get(name)) as string | undefined) ?? null
    } catch {
      return null
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await setDb(name, value)
    } catch (error) {
      console.warn('本地数据保存失败，建议导出项目文件备份。', error)
    }
  },
  removeItem: async (name: string) => {
    try {
      await del(name)
    } catch {
      // ignore
    }
  },
}
