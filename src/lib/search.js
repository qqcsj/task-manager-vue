const priorityWords = {
  high: '高 高级 高优先级 high',
  medium: '中 中级 中优先级 medium',
  low: '低 低级 低优先级 low',
}
const statusWords = { todo: '待办 代办 todo', doing: '进行中 doing', done: '完成 已完成 done' }

export function filterTasks(tasks, query = '', status = 'all', priority = 'all') {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  return tasks.filter(task => {
    const fields = [task.title, task.description, priorityWords[task.priority], statusWords[task.status]]
      .map(value => (value || '').toLocaleLowerCase())
    return (status === 'all' || task.status === status) &&
      (priority === 'all' || task.priority === priority) &&
      words.every(word => fields.some(field => field.includes(word)))
  })
}
