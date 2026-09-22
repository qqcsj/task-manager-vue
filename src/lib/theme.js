export const THEME_KEY = 'youxu.theme.v1'
export function readTheme(storage, prefersDark = false) {
  try {
    const saved = storage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* Fall back to system preference when storage is unavailable. */ }
  return prefersDark ? 'dark' : 'light'
}
export function saveTheme(storage, theme) {
  try { storage.setItem(THEME_KEY, theme); return '' }
  catch { return '主题已切换，但浏览器阻止了保存，下次打开可能恢复默认主题。' }
}
