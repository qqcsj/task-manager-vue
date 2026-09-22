export const THEME_KEY = 'youxu.theme.v1'
export const ACCENT_KEY = 'youxu.accent.v1'
export const accentColors = [
  { value: 'blue', label: '蓝色', swatch: '#3975db' },
  { value: 'red', label: '红色', swatch: '#d84b55' },
  { value: 'green', label: '绿色', swatch: '#23845d' },
  { value: 'yellow', label: '黄色', swatch: '#e7bb35' },
  { value: 'purple', label: '紫色', swatch: '#7560df' },
]
export function readAccent(storage) {
  try {
    const saved = storage.getItem(ACCENT_KEY)
    if (accentColors.some(color => color.value === saved)) return saved
  } catch { /* Keep the default accent when storage is unavailable. */ }
  return 'purple'
}
export function saveAccent(storage, accent) {
  if (!accentColors.some(color => color.value === accent)) return '请选择有效的主题颜色。'
  try { storage.setItem(ACCENT_KEY, accent); return '' }
  catch { return '主题颜色已切换，但浏览器阻止了保存，下次打开可能恢复默认颜色。' }
}
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
