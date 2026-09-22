<script setup>
import { priorities, statuses } from '../lib/tasks.js'
import AppIcon from './AppIcon.vue'
import { computed } from 'vue'
import { cardPattern } from '../lib/cardPatterns.js'
const props = defineProps({ task: { type: Object, required: true } })
const pattern = computed(() => cardPattern(props.task.id, props.task.priority))
defineEmits(['edit', 'delete', 'status'])
</script>
<template>
  <article class="task-card" :class="[{ completed: task.status === 'done' }, `card-${task.priority}`]" :aria-label="task.title">
    <div class="card-decoration" aria-hidden="true"><svg viewBox="0 0 64 64" :style="{ transform: `rotate(${pattern.tilt}deg)` }" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path :d="pattern.path" /></svg><svg class="decoration-small" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="pattern.path" /></svg></div>
    <div class="card-top"><span class="priority" :class="task.priority"><i></i>{{ priorities.find(p => p.value === task.priority)?.label }}优先级</span><div class="card-actions"><button class="text-button" :aria-label="`编辑任务：${task.title}`" title="编辑任务" @click="$emit('edit', task)"><AppIcon name="edit" /></button><button class="text-button delete-button" :aria-label="`删除任务：${task.title}`" title="删除任务" @click="$emit('delete', task)"><AppIcon name="trash" /></button></div></div>
    <h3>{{ task.title }}</h3><p v-if="task.description" class="task-description">{{ task.description }}</p><p v-else class="task-description muted">暂无描述</p>
    <div class="card-bottom"><span class="muted">{{ new Date(task.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) }}</span><select :aria-label="`任务状态：${task.title}`" :value="task.status" @change="$emit('status', task.id, $event.target.value)"><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select></div>
  </article>
</template>
