export const statuses = [{ value: 'todo', label: '待办' }, { value: 'doing', label: '进行中' }, { value: 'done', label: '完成' }]
export const priorities = [{ value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }]

export function validateTask(task) {
  if (typeof task.title !== 'string' || !task.title.trim()) return '请输入任务标题，不能只填写空格。'
  if (task.title.trim().length > 120) return '任务标题最多 120 个字符。'
  if (typeof task.description !== 'string' || task.description.length > 5000) return '任务描述最多 5000 个字符。'
  if (!statuses.some(s => s.value === task.status)) return '请选择有效的任务状态。'
  if (!priorities.some(p => p.value === task.priority)) return '请选择有效的优先级。'
  return ''
}
