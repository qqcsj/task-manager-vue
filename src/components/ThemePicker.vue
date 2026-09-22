<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { accentColors } from '../lib/theme.js'
defineProps({ theme: { type: String, required: true }, accent: { type: String, required: true } })
defineEmits(['toggle', 'accent'])
const open = ref(false)
const root = ref(null)
const paletteButton = ref(null)
function enter(event) { if (event.pointerType === 'mouse') open.value = true }
function leave() {
  if (!root.value?.contains(document.activeElement)) open.value = false
}
function blur(event) {
  if (!root.value?.contains(event.relatedTarget)) open.value = false
}
function outside(event) {
  if (!root.value?.contains(event.target)) open.value = false
}
function escape() {
  paletteButton.value.focus()
  open.value = false
}
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>

<template>
  <div ref="root" class="theme-picker" @pointerenter="enter" @pointerleave="leave" @focusout="blur" @keydown.esc.stop.prevent="escape">
    <div class="theme-controls">
      <button class="theme-toggle" :aria-pressed="theme === 'dark'" @focus="open = true" @click="$emit('toggle')">{{ theme === 'dark' ? '☀ 浅色模式' : '☾ 深色模式' }}</button>
      <button ref="paletteButton" class="palette-toggle" aria-label="选择主题颜色" :aria-expanded="open" aria-controls="theme-palette" @click="open = true" @keydown.down.prevent="open = true"><span class="current-color" aria-hidden="true"></span><span aria-hidden="true">⌃</span></button>
    </div>
    <section v-show="open" id="theme-palette" class="theme-palette" aria-label="选择你喜欢的主题颜色">
      <p class="palette-title">选择你喜欢的主题颜色</p>
      <p class="palette-hint">深色、浅色模式都适用</p>
      <div class="color-options" role="group" aria-label="主题颜色">
        <button v-for="color in accentColors" :key="color.value" class="color-option" :aria-label="`${color.label}主题`" :aria-pressed="accent === color.value" @click="$emit('accent', color.value)"><span class="color-swatch" :style="{ background: color.swatch }" aria-hidden="true">{{ accent === color.value ? '✓' : '' }}</span><span>{{ color.label }}</span></button>
      </div>
    </section>
  </div>
</template>
