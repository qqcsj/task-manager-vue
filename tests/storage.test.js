import test from 'node:test'
import assert from 'node:assert/strict'
import { loadTasks, saveTasks, TASKS_KEY } from '../src/lib/storage.js'
const task = { id: '1', title: '测试', description: '', status: 'todo', priority: 'high', createdAt: '2026-09-22T00:00:00Z', updatedAt: '2026-09-22T00:00:00Z' }
function memory(initial = null) { let value = initial; return { getItem: () => value, setItem: (key, next) => { assert.equal(key, TASKS_KEY); value = next } } }
test('新建、修改、删除后的数据可以重新读取，包括空列表', () => {
  const storage = memory()
  assert.deepEqual(loadTasks(storage).tasks, [])
  assert.equal(saveTasks(storage, [task]), '')
  assert.deepEqual(loadTasks(storage).tasks, [task])
  saveTasks(storage, [{ ...task, status: 'done' }])
  assert.equal(loadTasks(storage).tasks[0].status, 'done')
  saveTasks(storage, [])
  assert.deepEqual(loadTasks(storage).tasks, [])
})
test('损坏、结构异常及重复 ID 数据保留原值并禁止覆盖', () => {
  for (const raw of ['{', '{}', '[null]', JSON.stringify([{ ...task, status: 'bad' }]), JSON.stringify([task, task])]) {
    const storage = memory(raw)
    assert.equal(loadTasks(storage).writable, false)
    assert.ok(loadTasks(storage).error)
    assert.equal(storage.getItem(TASKS_KEY), raw)
  }
})
test('存储禁用或空间不足时报告失败', () => {
  assert.ok(loadTasks(undefined).error)
  assert.ok(saveTasks({ setItem() { throw new Error('QuotaExceededError') } }, [task]))
})
