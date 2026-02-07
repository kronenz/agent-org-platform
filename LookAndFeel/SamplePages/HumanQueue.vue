<script setup lang="ts">
/**
 * HumanQueue.vue
 * 
 * Sample component demonstrating:
 * - Human approval queue layout
 * - Lucide icons for actions and status (NO emojis)
 * - Linked artifacts/issues/PRs display
 * - Priority and urgency indicators
 */
import { ref } from 'vue'
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  CircleDot,
  GitPullRequest,
  FileText,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
  Filter,
  RefreshCw,
  MessageSquare
} from 'lucide-vue-next'

interface QueueItem {
  id: string
  title: string
  type: 'approval' | 'decision' | 'review'
  priority: 'P0' | 'P1' | 'P2'
  stage: string
  waitTime: string
  linkedIssue?: { number: number; title: string }
  linkedPR?: { number: number; title: string }
  linkedArtifact?: { path: string; title: string }
  requestedBy: string
}

const queueItems = ref<QueueItem[]>([
  {
    id: '1',
    title: 'Approve Q2 roadmap priorities',
    type: 'approval',
    priority: 'P0',
    stage: 'Management',
    waitTime: '2h',
    linkedIssue: { number: 42, title: 'Define Q2 roadmap priorities' },
    linkedArtifact: { path: 'vault/strategy/roadmap-q2', title: 'Q2 Roadmap' },
    requestedBy: 'AI-Agent'
  },
  {
    id: '2',
    title: 'Review wikilink resolver implementation',
    type: 'review',
    priority: 'P1',
    stage: 'Implementation',
    waitTime: '45m',
    linkedPR: { number: 16, title: 'Add wikilink resolver' },
    requestedBy: 'AI-Agent'
  },
  {
    id: '3',
    title: 'Decide: Use GraphQL or REST for GitHub API?',
    type: 'decision',
    priority: 'P1',
    stage: 'Research',
    waitTime: '1d',
    linkedIssue: { number: 35, title: 'GitHub API integration approach' },
    requestedBy: 'AI-Agent'
  },
])

function getTypeIcon(type: QueueItem['type']) {
  switch (type) {
    case 'approval': return CheckCircle
    case 'decision': return AlertTriangle
    case 'review': return GitPullRequest
  }
}

function getTypeColor(type: QueueItem['type']) {
  switch (type) {
    case 'approval': return '#22C55E'
    case 'decision': return '#F59E0B'
    case 'review': return '#8B5CF6'
  }
}

function getPriorityClass(priority: QueueItem['priority']) {
  return {
    P0: 'priority--p0',
    P1: 'priority--p1',
    P2: 'priority--p2'
  }[priority]
}
</script>

<template>
  <div class="human-queue">
    <!-- Header -->
    <header class="queue-header">
      <div class="header-left">
        <UserCheck :size="20" class="header-icon" />
        <h1 class="header-title">Need Human</h1>
        <span class="queue-count">{{ queueItems.length }} pending</span>
      </div>

      <div class="header-actions">
        <button class="action-btn">
          <Filter :size="16" />
          Filter
        </button>
        <button class="action-btn">
          <RefreshCw :size="16" />
          Refresh
        </button>
      </div>
    </header>

    <!-- Queue List -->
    <div class="queue-list">
      <article 
        v-for="item in queueItems" 
        :key="item.id"
        class="queue-item"
      >
        <!-- Item Header -->
        <header class="item-header">
          <div class="item-type" :style="{ color: getTypeColor(item.type) }">
            <component :is="getTypeIcon(item.type)" :size="18" />
          </div>
          <div class="item-info">
            <h2 class="item-title">{{ item.title }}</h2>
            <div class="item-meta">
              <span class="type-badge">{{ item.type }}</span>
              <span class="priority-badge" :class="getPriorityClass(item.priority)">
                {{ item.priority }}
              </span>
              <span class="stage-badge">{{ item.stage }}</span>
              <span class="wait-time">
                <Clock :size="12" />
                {{ item.waitTime }}
              </span>
            </div>
          </div>
          <ChevronRight :size="20" class="item-chevron" />
        </header>

        <!-- Linked Items -->
        <div class="linked-items">
          <!-- Linked Issue -->
          <a v-if="item.linkedIssue" href="#" class="linked-item">
            <CircleDot :size="14" class="linked-icon linked-icon--issue" />
            <span class="linked-number">#{{ item.linkedIssue.number }}</span>
            <span class="linked-title">{{ item.linkedIssue.title }}</span>
            <ExternalLink :size="12" class="external-icon" />
          </a>

          <!-- Linked PR -->
          <a v-if="item.linkedPR" href="#" class="linked-item">
            <GitPullRequest :size="14" class="linked-icon linked-icon--pr" />
            <span class="linked-number">#{{ item.linkedPR.number }}</span>
            <span class="linked-title">{{ item.linkedPR.title }}</span>
            <ExternalLink :size="12" class="external-icon" />
          </a>

          <!-- Linked Artifact -->
          <a v-if="item.linkedArtifact" href="#" class="linked-item">
            <FileText :size="14" class="linked-icon linked-icon--artifact" />
            <span class="linked-title">{{ item.linkedArtifact.title }}</span>
            <ExternalLink :size="12" class="external-icon" />
          </a>
        </div>

        <!-- Actions -->
        <footer class="item-actions">
          <span class="requested-by">
            Requested by: <strong>{{ item.requestedBy }}</strong>
          </span>
          <div class="action-buttons">
            <button class="btn btn--secondary">
              <MessageSquare :size="14" />
              Comment
            </button>
            <button class="btn btn--reject">
              <XCircle :size="14" />
              Reject
            </button>
            <button class="btn btn--approve">
              <CheckCircle :size="14" />
              Approve
            </button>
          </div>
        </footer>
      </article>
    </div>

    <!-- Empty State (when no items) -->
    <div v-if="queueItems.length === 0" class="empty-state">
      <CheckCircle :size="48" class="empty-icon" />
      <h2 class="empty-title">All caught up!</h2>
      <p class="empty-description">No pending items require human attention.</p>
    </div>
  </div>
</template>

<style scoped>
.human-queue {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F8FAFC;
}

.queue-header {
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
  color: #F59E0B;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.queue-count {
  font-size: 12px;
  color: #92400E;
  background-color: #FEF3C7;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
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

.queue-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.queue-item {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
}

.item-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.item-type {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #F8FAFC;
  border-radius: 10px;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.type-badge {
  font-size: 11px;
  font-weight: 500;
  color: #64748B;
  background-color: #F1F5F9;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: capitalize;
}

.priority-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.priority--p0 {
  color: #991B1B;
  background-color: #FEE2E2;
}

.priority--p1 {
  color: #92400E;
  background-color: #FEF3C7;
}

.priority--p2 {
  color: #166534;
  background-color: #DCFCE7;
}

.stage-badge {
  font-size: 11px;
  color: #64748B;
  background-color: #F1F5F9;
  padding: 2px 8px;
  border-radius: 4px;
}

.wait-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94A3B8;
}

.item-chevron {
  color: #CBD5E1;
}

.linked-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
  padding: 12px;
  background-color: #F8FAFC;
  border-radius: 8px;
}

.linked-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #0F172A;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background-color 0.15s;
}

.linked-item:hover {
  background-color: #E2E8F0;
}

.linked-icon {
  flex-shrink: 0;
}

.linked-icon--issue {
  color: #22C55E;
}

.linked-icon--pr {
  color: #8B5CF6;
}

.linked-icon--artifact {
  color: #3B82F6;
}

.linked-number {
  font-weight: 500;
  color: #64748B;
}

.linked-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.external-icon {
  color: #94A3B8;
  opacity: 0;
  transition: opacity 0.15s;
}

.linked-item:hover .external-icon {
  opacity: 1;
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
}

.requested-by {
  font-size: 12px;
  color: #64748B;
}

.requested-by strong {
  color: #0F172A;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn--secondary {
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #64748B;
}

.btn--secondary:hover {
  background-color: #F8FAFC;
  color: #0F172A;
}

.btn--reject {
  border: 1px solid #FECACA;
  background: #FEF2F2;
  color: #DC2626;
}

.btn--reject:hover {
  background-color: #FEE2E2;
}

.btn--approve {
  border: none;
  background: #22C55E;
  color: #FFFFFF;
}

.btn--approve:hover {
  background-color: #16A34A;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
}

.empty-icon {
  color: #22C55E;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}
</style>
