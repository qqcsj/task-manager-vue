import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './workspace.css'
import { readTheme, readAccent } from './lib/theme.js'

let themeStorage
try { themeStorage = window.localStorage } catch { /* Use system preference. */ }
document.documentElement.dataset.theme = readTheme(themeStorage, window.matchMedia('(prefers-color-scheme: dark)').matches)
document.documentElement.dataset.accent = readAccent(themeStorage)

createApp(App).mount('#app')
