import test from 'node:test'
import assert from 'node:assert/strict'
import { readTheme, saveTheme, THEME_KEY } from '../src/lib/theme.js'
test('优先读取用户选择，无有效设置则遵循系统主题', () => {
  assert.equal(readTheme({ getItem: () => 'light' }, true), 'light')
  assert.equal(readTheme({ getItem: () => 'dark' }, false), 'dark')
  assert.equal(readTheme({ getItem: () => 'invalid' }, true), 'dark')
  assert.equal(readTheme(undefined, false), 'light')
})
test('主题可以保存，存储失败有明确提示', () => {
  let saved
  assert.equal(saveTheme({ setItem(key, value) { assert.equal(key, THEME_KEY); saved = value } }, 'dark'), '')
  assert.equal(saved, 'dark')
  assert.ok(saveTheme(undefined, 'light'))
})
