<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import { statuses } from '../lib/tasks.js'
const props = defineProps({ tasks: { type: Array, required: true } })
const emit = defineEmits(['edit', 'delete', 'status', 'create'])
const dragging = ref(null)
const over = ref(null)
function start(event, task) {
  dragging.value = task.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', task.id)
}
function finish() { dragging.value = null; over.value = null }
function drop(event, status) {
  const id = event.dataTransfer.getData('text/plain')
  if (dragging.value === id && props.tasks.some(task => task.id === id)) emit('status', id, status)
  finish()
}
</script>
<template>
  <div class="board" aria-label="任务看板">
    <section v-for="status in statuses" :key="status.value" class="board-column" :class="{ 'drop-active': over === status.value }" :aria-label="`${status.label}列`" @dragover.prevent="over = status.value" @drop.prevent="drop($event, status.value)">
      <header class="column-heading"><h2><i class="dot" :class="status.value"></i>{{ status.label }}<span class="count">{{ tasks.filter(t => t.status === status.value).length }}</span></h2><button class="column-add" :aria-label="`在${status.label}列新建任务`" @click="emit('create', status.value)">＋</button></header>
      <div class="column-tasks"><div v-for="task in tasks.filter(t => t.status === status.value)" :key="task.id" draggable="true" class="draggable-task" :class="{ dragging: dragging === task.id }" @dragstart="start($event, task)" @dragend="finish"><TaskCard :task="task" @edit="emit('edit', $event)" @delete="emit('delete', $event)" @status="(id, value) => emit('status', id, value)" /></div></div>
      <p v-if="!tasks.some(t => t.status === status.value)" class="column-empty">暂无任务<br /><span>拖动卡片到这里，或点击 ＋ 添加</span></p>
    </section>
  </div>
</template>
