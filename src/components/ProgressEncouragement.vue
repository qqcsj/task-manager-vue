<script setup>
import { computed, ref, watch } from 'vue'
import { completionState, messages } from '../lib/encouragement.js'
const props = defineProps({ total: Number, completed: Number, progress: Number, pick: Function })
const dialog = ref(null)
const phrase = ref('')
const state = computed(() => completionState(props.total, props.completed))
const remaining = computed(() => props.total - props.completed)
const title = computed(() => ({ complete: '圆满收工，给自己一个赞', ongoing: '每一步，都在靠近完成', empty: '新的小目标，从这里开始' })[state.value])
function another() { phrase.value = messages[state.value][props.pick(state.value, messages[state.value].length)] }
function open() { another(); dialog.value.showModal() }
watch(state, () => { if (dialog.value?.open) another() })
</script>

<template>
  <div class="hero-progress">
    <button type="button" class="progress-ring" :style="{ '--completion': `${progress}%` }" :aria-label="`任务完成率 ${progress}%，点击获取鼓励`" @click="open">
      <div><strong>{{ progress }}<small>%</small></strong><span>任务完成率</span></div>
    </button>
    <p>{{ total ? `已完成 ${completed} 项，还有 ${remaining} 项待推进` : '从你的第一个小目标开始' }}</p>
    <button class="encouragement-link" @click="open">✦ 点击，收下一句鼓励</button>
  </div>
  <button class="mobile-encouragement secondary" @click="open">✦ 完成 {{ progress }}% · 给自己一点鼓励</button>
  <dialog ref="dialog" class="modal encouragement-dialog" aria-labelledby="encouragement-title" @click="event => { if (event.target === dialog) dialog.close() }">
    <button class="icon-button encouragement-close" aria-label="关闭鼓励" @click="dialog.close()">×</button>
    <div class="encouragement-symbol" aria-hidden="true">{{ state === 'complete' ? '✧' : state === 'empty' ? '☀' : '✦' }}</div>
    <p class="eyebrow">给认真生活的你</p>
    <h2 id="encouragement-title">{{ title }}</h2>
    <p class="encouragement-count">{{ state === 'empty' ? '还没有任务，先从一个小目标开始。' : state === 'complete' ? `全部 ${total} 项任务已完成 · 100%` : `已完成 ${completed} / ${total} 项，还剩 ${remaining} 项` }}</p>
    <p class="encouragement-quote" role="status" aria-live="polite">{{ phrase }}</p>
    <div class="encouragement-actions"><button class="secondary" @click="another">换一句</button><button class="primary" @click="dialog.close()">{{ state === 'complete' ? '开心收下' : '带着鼓励继续' }}</button></div>
  </dialog>
</template>
