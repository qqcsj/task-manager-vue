import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTask } from '../src/lib/tasks.js'
const valid = { title: '课堂演示', description: '', status: 'todo', priority: 'medium' }
test('标题必填且不能全为空格，描述可选', () => {
  assert.equal(validateTask(valid), '')
  assert.ok(validateTask({ ...valid, title: '   ' }))
  assert.ok(validateTask({ ...valid, title: '' }))
})
test('拒绝超长输入和无效状态、优先级', () => {
  for (const patch of [{ title: 'a'.repeat(121) }, { description: 'a'.repeat(5001) }, { status: 'unknown' }, { priority: 'urgent' }]) assert.ok(validateTask({ ...valid, ...patch }))
})
