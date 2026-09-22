import { validateTask } from './tasks.js'
export const TASKS_KEY = 'youxu.tasks.v1'

export function loadTasks(storage) {
  try {
    const raw = storage.getItem(TASKS_KEY)
    if (raw === null) return { tasks: [], error: '', writable: true }
    const parsed = JSON.parse(raw)
    const ids = new Set()
    if (!Array.isArray(parsed) || parsed.some(task => {
      if (!task || validateTask(task) || typeof task.id !== 'string' || !task.id || ids.has(task.id) || !Number.isFinite(Date.parse(task.createdAt)) || !Number.isFinite(Date.parse(task.updatedAt))) return true
      ids.add(task.id)
      return false
    })) throw new Error('Invalid saved data')
    return { tasks: parsed, error: '', writable: true }
  } catch {
    return { tasks: [], error: '无法读取本地任务。原数据已保留，本次修改仅在当前页面有效；请检查浏览器存储设置或备份损坏数据后再处理。', writable: false }
  }
}

export function saveTasks(storage, tasks) {
  try { storage.setItem(TASKS_KEY, JSON.stringify(tasks)); return '' }
  catch { return '保存失败：浏览器存储不可用或空间已满。本次修改仅在当前页面有效，请勿刷新。' }
}
