<script setup>
import { priorities, statuses } from '../lib/tasks.js'
defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'delete', 'status'])
</script>
<template>
  <article class="task-card" :class="{ completed: task.status === 'done' }" :aria-label="task.title">
    <div class="card-top"><span class="priority" :class="task.priority"><i></i>{{ priorities.find(p => p.value === task.priority)?.label }}优先级</span><div class="card-actions"><button class="text-button" :aria-label="`编辑任务：${task.title}`" @click="$emit('edit', task)">编辑</button><button class="text-button delete-button" :aria-label="`删除任务：${task.title}`" @click="$emit('delete', task)">删除</button></div></div>
    <h3>{{ task.title }}</h3><p v-if="task.description" class="task-description">{{ task.description }}</p><p v-else class="task-description muted">暂无描述</p>
    <div class="card-bottom"><span class="muted">{{ new Date(task.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) }}</span><select :aria-label="`任务状态：${task.title}`" :value="task.status" @change="$emit('status', task.id, $event.target.value)"><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select></div>
  </article>
</template>
