import test from 'node:test'
import assert from 'node:assert/strict'
import { createPhrasePicker, completionState } from '../src/lib/encouragement.js'
test('empty and truly completed tasks use different encouragement, regardless of rounded percentage', () => {
  assert.equal(completionState(0, 0), 'empty')
  assert.equal(completionState(3, 3), 'complete')
  assert.equal(completionState(300, 299), 'ongoing')
})
test('phrase deck avoids repeats within a cycle and across cycle boundaries', () => {
  const pick = createPhrasePicker(undefined, () => 0.4)
  const first = Array.from({length: 8}, () => pick('test', 8))
  assert.equal(new Set(first).size, 8)
  assert.notEqual(pick('test', 8), first.at(-1))
})
test('refresh keeps phrase history and corrupt or blocked storage does not break rotation', () => {
  const data = new Map()
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) }
  const picks = Array.from({length: 8}, () => createPhrasePicker(storage)('headline', 8))
  assert.equal(new Set(picks).size, 8)
  for (const bad of [null, {getItem: () => '{broken'}, {getItem: () => {throw Error()}, setItem: () => {throw Error()}}]) {
    const pick = createPhrasePicker(bad)
    assert.notEqual(pick('test', 8), pick('test', 8))
  }
})
