<script setup lang="ts">
/**
 * KanbanBoard.vue
 * 
 * Sample component demonstrating:
 * - Kanban board layout (GitHub Projects v2 mirror)
 * - Lucide icons for status and actions (NO emojis)
 * - Pipeline stage color coding
 * - Issue/PR card styling
 */
import { ref } from 'vue'
import {
  Columns,
  CircleDot,
  GitPullRequest,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  User,
  Tag,
  MoreHorizontal,
  Plus,
  ExternalLink,
  Filter,
  RefreshCw
} from 'lucide-vue-next'

interface WorkItem {
  id: string
  title: string
  type: 'issue' | 'pr'
  number: number
  labels: string[]
  assignee?: string
  needHuman: boolean
  stage: string
}

interface KanbanColumn {
  key: string
  label: string
  color: string
  items: WorkItem[]
}

const columns = ref<KanbanColumn[]>([
  {
    key: 'management',
    label: 'Management',
    color: '#8B5CF6',
    items: [
      { id: '1', title: 'Define Q2 roadmap priorities', type: 'issue', number: 42, labels: ['planning'], needHuman: true, stage: 'management' },
    ]
  },
  {
    key: 'research',
    label: 'Research',
    color: '#3B82F6',
    items: [
      { id: '2', title: 'Analyze competitor integrations', type: 'issue', number: 38, labels: ['research'], assignee: 'AI-Agent', needHuman: false, stage: 'research' },
      { id: '3', title: 'Document API requirements', type: 'issue', number: 39, labels: ['docs'], assignee: 'AI-Agent', needHuman: false, stage: 'research' },
    ]
  },
  {
    key: 'implementation',
    label: 'Implementation',
    color: '#22C55E',
    items: [
      { id: '4', title: 'Implement graph indexer', type: 'pr', number: 15, labels: ['feature'], assignee: 'AI-Agent', needHuman: false, stage: 'implementation' },
      { id: '5', title: 'Add wikilink resolver', type: 'pr', number: 16, labels: ['feature'], assignee: 'AI-Agent', needHuman: true, stage: 'implementation' },
    ]
  },
  {
    key: 'quality',
    label: 'Quality',
    color: '#F59E0B',
    items: [
      { id: '6', title: 'Review PR #15 changes', type: 'issue', number: 40, labels: ['review'], needHuman: true, stage: 'quality' },
    ]
  }
])

function getItemIcon(type: WorkItem['type']) {
  return type === 'pr' ? GitPullRequest : CircleDot
}
</script>

<template>
  <div class="kanban-view">
    <!-- Header -->
    <header class="kanban-header">
      <div class="header-left">
        <Columns :size="20" class="header-icon" />
        <h1 class="header-title">Pipeline Board</h1>
      </div>

      <div class="header-actions">
        <button class="action-btn">
          <Filter :size="16" />
          Filter
        </button>
        <button class="action-btn">
          <RefreshCw :size="16" />
          Sync
        </button>
        <a href="#" class="github-link">
          <ExternalLink :size="14" />
          Open in GitHub
        </a>
      </div>
    </header>

    <!-- Board -->
    <div class="kanban-board">
      <div 
        v-for="column in columns" 
        :key="column.key" 
        class="kanban-column"
      >
        <!-- Column Header -->
        <header class="column-header">
          <div class="column-title">
            <span class="column-dot" :style="{ backgroundColor: column.color }"></span>
            <span class="column-label">{{ column.label }}</span>
            <span class="column-count">{{ column.items.length }}</span>
          </div>
          <button class="column-action">
            <Plus :size="16" />
          </button>
        </header>

        <!-- Cards -->
        <div class="column-cards">
          <article 
            v-for="item in column.items" 
            :key="item.id"
            class="kanban-card"
            :class="{ 'kanban-card--need-human': item.needHuman }"
          >
            <!-- Card Header -->
            <header class="card-header">
              <component 
                :is="getItemIcon(item.type)" 
                :size="14" 
                :class="item.type === 'pr' ? 'icon-pr' : 'icon-issue'" 
              />
              <span class="card-number">#{{ item.number }}</span>
              <button class="card-menu">
                <MoreHorizontal :size="14" />
              </button>
            </header>

            <!-- Card Title -->
            <h3 class="card-title">{{ item.title }}</h3>

            <!-- Labels -->
            <div class="card-labels">
              <span v-for="label in item.labels" :key="label" class="label-badge">
                <Tag :size="10" />
                {{ label }}
              </span>
            </div>

            <!-- Card Footer -->
            <footer class="card-footer">
              <div class="card-assignee" v-if="item.assignee">
                <User :size="14" />
                <span>{{ item.assignee }}</span>
              </div>
              <div v-if="item.needHuman" class="need-human-badge">
                <UserCheck :size="12" />
                Need Human
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F8FAFC;
}

.kanban-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #3B82F6;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: #FFFFFF;
  font-size: 14px;
  color: #64748B;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #F8FAFC;
  color: #0F172A;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #3B82F6;
  text-decoration: none;
}

.github-link:hover {
  text-decoration: underline;
}

.kanban-board {
  display: flex;
  gap: 16px;
  padding: 24px;
  overflow-x: auto;
  flex: 1;
}

.kanban-column {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  background-color: #F1F5F9;
  border-radius: 12px;
  max-height: 100%;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.column-label {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
}

.column-count {
  font-size: 12px;
  color: #64748B;
  background-color: #E2E8F0;
  padding: 2px 8px;
  border-radius: 9999px;
}

.column-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #64748B;
  cursor: pointer;
}

.column-action:hover {
  background-color: #E2E8F0;
}

.column-cards {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kanban-card {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}

.kanban-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.kanban-card--need-human {
  border-left: 3px solid #F59E0B;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.icon-issue {
  color: #22C55E;
}

.icon-pr {
  color: #8B5CF6;
}

.card-number {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.card-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #94A3B8;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

.kanban-card:hover .card-menu {
  opacity: 1;
}

.card-menu:hover {
  background-color: #F1F5F9;
  color: #64748B;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: #0F172A;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.card-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.label-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 11px;
  color: #64748B;
  background-color: #F1F5F9;
  border-radius: 9999px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #F1F5F9;
}

.card-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748B;
}

.need-human-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #92400E;
  background-color: #FEF3C7;
  border-radius: 9999px;
}
</style>
