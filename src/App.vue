<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import TaskCard from './components/TaskCard.vue'
import TaskBoard from './components/TaskBoard.vue'
import ThemePicker from './components/ThemePicker.vue'
import AppIcon from './components/AppIcon.vue'
import ProgressEncouragement from './components/ProgressEncouragement.vue'
import { greetings, createPhrasePicker } from './lib/encouragement.js'
import { statuses, priorities, validateTask } from './lib/tasks.js'
import { filterTasks } from './lib/search.js'
import { loadTasks, saveTasks } from './lib/storage.js'
import { accentColors, saveAccent, saveTheme } from './lib/theme.js'

let storage
try { storage = window.localStorage } catch { /* Storage can be disabled by the browser. */ }
const pickPhrase = createPhrasePicker(storage)
const greeting = greetings[pickPhrase('headline', greetings.length)]
const initial = loadTasks(storage)
const tasks = ref(initial.tasks)
const storageError = ref(initial.error)
watch(tasks, value => {
  if (initial.writable) storageError.value = saveTasks(storage, value)
}, { deep: true, flush: 'sync' })
const query = ref('')
const view = ref('board')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const editor = ref(null)
const titleInput = ref(null)
const deleteDialog = ref(null)
const deleting = ref(null)
const editingId = ref(null)
const form = reactive({ title: '', description: '', status: 'todo', priority: 'medium' })
const error = ref('')
const notice = ref('')
const todayLabel = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date())
const theme = ref(document.documentElement.dataset.theme || 'light')
const accent = ref(document.documentElement.dataset.accent || 'purple')
function changeAccent(value) {
  const color = accentColors.find(color => color.value === value)
  if (!color) return
  accent.value = value
  document.documentElement.dataset.accent = value
  notice.value = saveAccent(storage, value) || `已选择${color.label}主题，并记住选择`
}
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  notice.value = saveTheme(storage, theme.value) || `已切换为${theme.value === 'dark' ? '深色' : '浅色'}模式，并记住选择`
}
const visibleTasks = computed(() => filterTasks(tasks.value, query.value, statusFilter.value, priorityFilter.value))
const hasFilters = computed(() => Boolean(query.value || statusFilter.value !== 'all' || priorityFilter.value !== 'all'))
const filterSummary = computed(() => [
  query.value.trim() ? `关键词：${query.value.trim()}` : '',
  statusFilter.value !== 'all' ? `状态：${statuses.find(s => s.value === statusFilter.value)?.label}` : '',
  priorityFilter.value !== 'all' ? `优先级：${priorities.find(p => p.value === priorityFilter.value)?.label}` : '',
].filter(Boolean).join('；'))
function resetFilters() {
  query.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  notice.value = '已清除筛选，显示全部任务'
}
const completed = computed(() => tasks.value.filter(task => task.status === 'done').length)
const progress = computed(() => tasks.value.length ? Math.round(completed.value / tasks.value.length * 100) : 0)

async function openEditor(task = null) {
  editingId.value = task?.id ?? null
  Object.assign(form, { title: task?.title ?? '', description: task?.description ?? '', status: task?.status ?? 'todo', priority: task?.priority ?? 'medium' })
  error.value = ''
  editor.value.showModal()
  await nextTick()
  titleInput.value.focus()
}
function saveTask() {
  error.value = validateTask(form)
  if (error.value) return
  const fields = { ...form, title: form.title.trim(), description: form.description.trim(), updatedAt: new Date().toISOString() }
  if (editingId.value) {
    tasks.value = tasks.value.map(task => task.id === editingId.value ? { ...task, ...fields } : task)
    notice.value = '任务已更新'
  } else {
    tasks.value.unshift({ ...fields, id: crypto.randomUUID(), createdAt: fields.updatedAt })
    notice.value = '任务已创建'
  }
  editor.value.close()
}
function changeStatus(id, status) {
  if (!statuses.some(item => item.value === status)) return
  tasks.value = tasks.value.map(task => task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task)
  notice.value = '任务状态已更新'
}
function askDelete(task) { deleting.value = task; deleteDialog.value.showModal() }
function createInColumn(status) { openEditor(); form.status = status }
function removeTask() {
  tasks.value = tasks.value.filter(task => task.id !== deleting.value.id)
  deleteDialog.value.close()
  notice.value = '任务已删除'
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="./"><span class="brand-icon"><AppIcon name="check" /></span> 有序 <span class="brand-en">TASKS</span></a>
      <div class="workspace-label">个人工作空间</div>
      <div class="nav-active"><AppIcon name="board" /><span>我的任务</span><span class="nav-count">{{ tasks.length }}</span></div>
      <div class="sidebar-note"><span class="note-icon">✦</span><h2>专注当下，逐一完成</h2><p>把大目标拆成小任务。<br />每一步，都算数。</p></div>
      <ThemePicker :theme="theme" :accent="accent" @toggle="toggleTheme" @accent="changeAccent" />
      <div class="profile"><span class="avatar">我</span><div>我的工作空间<small>个人任务管理</small></div></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><span>工作空间 <span class="breadcrumb"> / 我的任务</span></span><span class="today-label"><AppIcon name="clock" />{{ todayLabel }}</span></header>
      <div class="page-content">
        <p v-if="storageError" class="storage-error" role="alert">{{ storageError }}</p>
        <div class="page-heading"><div><p class="eyebrow">一点专注 · 一点进步</p><h1>{{ greeting[0] }}<span class="heading-dot">。</span></h1><p class="muted mt-3">{{ greeting[1] }}</p><button class="primary hero-create" @click="openEditor()"><AppIcon name="plus" />新建任务<AppIcon name="arrow" /></button></div><ProgressEncouragement :total="tasks.length" :completed="completed" :progress="progress" :pick="pickPhrase" /></div>
        <section class="stats" aria-label="任务统计">
          <div><span>全部任务</span><strong>{{ tasks.length }}<small>项任务</small></strong></div>
          <div><span><i class="dot doing"></i>进行中</span><strong>{{ tasks.filter(t => t.status === 'doing').length }}<small>正在推进</small></strong></div>
          <div><span><i class="dot done"></i>已完成</span><strong>{{ completed }}<small>继续保持</small></strong></div>
          <div><span>完成进度 <b>{{ progress }}%</b></span><div class="progress"><div :style="{ width: `${progress}%` }"></div></div><small>每一次完成，都是一次前进</small></div>
        </section>
        <div class="toolbar"><h2>任务清单 <span class="count">{{ visibleTasks.length }}</span></h2><div class="filters"><input v-model="query" aria-label="搜索任务" placeholder="搜索标题、描述、状态或优先级…" type="search" /><select v-model="statusFilter" aria-label="筛选状态"><option value="all">全部状态</option><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select><select v-model="priorityFilter" aria-label="筛选优先级"><option value="all">全部优先级</option><option v-for="p in priorities" :key="p.value" :value="p.value">{{ p.label }}优先级</option></select></div></div>
        <div v-if="hasFilters" class="search-feedback">
          <div role="status" aria-live="polite"><strong>{{ visibleTasks.length ? `显示 ${visibleTasks.length} / ${tasks.length} 项任务` : '没有找到匹配的任务' }}</strong><p>{{ filterSummary }}</p><p>搜索与下拉筛选同时生效，未匹配的任务只是暂时隐藏。</p></div>
          <button class="secondary" @click="resetFilters">清除筛选，显示全部</button>
        </div>
        <div class="view-bar"><div class="view-switch" role="group" aria-label="切换视图"><button :aria-pressed="view === 'board'" :class="{ active: view === 'board' }" @click="view = 'board'">▦ 看板视图</button><button :aria-pressed="view === 'list'" :class="{ active: view === 'list' }" @click="view = 'list'">☷ 列表视图</button></div><span class="muted">{{ view === 'board' ? '拖动卡片即可更改状态' : '清晰记录每一项行动' }}</span></div>
        <TaskBoard v-if="view === 'board'" :tasks="visibleTasks" :filtered="hasFilters" @edit="openEditor" @delete="askDelete" @status="changeStatus" @create="createInColumn" />
        <div v-else class="task-list"><TaskCard v-for="task in visibleTasks" :key="task.id" :task="task" @edit="openEditor" @delete="askDelete" @status="changeStatus" /></div>
        <section v-if="!visibleTasks.length && view === 'list'" class="empty"><div class="empty-icon">✓</div><h2>{{ tasks.length ? '没有找到匹配的任务' : '给今天安排第一件事' }}</h2><p class="muted mt-3">{{ tasks.length ? '试试其他关键词，或调整筛选条件。' : '添加一个任务，让想法从这里开始落地。' }}</p><button v-if="!tasks.length" class="primary mt-6" @click="openEditor()">＋ 创建第一个任务</button></section>
        <footer class="page-footer"><span>{{ storageError ? '本地保存不可用' : '✓ 任务自动保存在当前浏览器' }}</span><span role="status" aria-live="polite">{{ notice }}</span></footer>
      </div>
    </main>
    <dialog ref="editor" aria-labelledby="editor-title" class="modal">
      <form @submit.prevent="saveTask" novalidate><div class="modal-heading"><h2 id="editor-title">{{ editingId ? '编辑任务' : '新建任务' }}</h2><button type="button" class="icon-button" aria-label="关闭表单" @click="editor.close()">×</button></div>
        <p class="muted mb-6">明确下一步，让行动更简单。</p>
        <label for="task-title">任务标题 <span class="required">*</span></label><input id="task-title" ref="titleInput" v-model="form.title" maxlength="120" required placeholder="你想完成什么？" :aria-invalid="Boolean(error)" aria-describedby="form-error" />
        <label for="task-description">任务描述 <span class="muted">（选填）</span></label><textarea id="task-description" v-model="form.description" rows="4" maxlength="5000" placeholder="补充细节、想法或执行步骤…"></textarea>
        <div class="form-grid"><div><label for="task-status">状态</label><select id="task-status" v-model="form.status"><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select></div><div><label for="task-priority">优先级</label><select id="task-priority" v-model="form.priority"><option v-for="p in priorities" :key="p.value" :value="p.value">{{ p.label }}</option></select></div></div>
        <p id="form-error" class="error" role="alert">{{ error }}</p><div class="modal-actions"><button type="button" class="secondary" @click="editor.close()">取消</button><button type="submit" class="primary">{{ editingId ? '保存修改' : '创建任务' }}</button></div>
      </form>
    </dialog>
    <dialog ref="deleteDialog" class="modal delete-modal" aria-labelledby="delete-title"><h2 id="delete-title">删除这个任务？</h2><p class="delete-text">“{{ deleting?.title }}” 将被删除，此操作无法撤销。</p><div class="modal-actions"><button class="secondary" @click="deleteDialog.close()">取消</button><button class="danger" @click="removeTask">确认删除</button></div></dialog>
  </div>
</template>
