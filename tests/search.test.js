import test from 'node:test'
import assert from 'node:assert/strict'
import { filterTasks } from '../src/lib/search.js'

const tasks = [
  { id: '1', title: '背单词', description: 'English practice', status: 'todo', priority: 'medium' },
  { id: '2', title: '软工作业', description: '完成报告', status: 'doing', priority: 'high' },
  { id: '3', title: '散步', description: '', status: 'done', priority: 'low' },
]
test('search matches titles, descriptions and priority aliases', () => {
  for (const query of ['单词', '中级', '中优先级', ' MEDIUM ', 'ENGLISH', '单词 中级']) {
    assert.deepEqual(filterTasks(tasks, query).map(t => t.id), ['1'])
  }
  assert.deepEqual(filterTasks(tasks, '软工').map(t => t.id), ['2'])
  assert.deepEqual(filterTasks(tasks, '低级').map(t => t.id), ['3'])
})
test('status aliases and explicit dropdown filters combine', () => {
  assert.deepEqual(filterTasks(tasks, '代办').map(t => t.id), ['1'])
  assert.deepEqual(filterTasks(tasks, '进行中').map(t => t.id), ['2'])
  assert.deepEqual(filterTasks(tasks, '已完成').map(t => t.id), ['3'])
  assert.deepEqual(filterTasks(tasks, '单词', 'todo', 'medium').map(t => t.id), ['1'])
  assert.deepEqual(filterTasks(tasks, '软工', 'all', 'medium'), [])
})
test('clearing all conditions restores every task without changing source data', () => {
  const before = structuredClone(tasks)
  assert.deepEqual(filterTasks(tasks, '不存在'), [])
  assert.deepEqual(filterTasks(tasks, '   ', 'all', 'all'), before)
  assert.deepEqual(tasks, before)
})
