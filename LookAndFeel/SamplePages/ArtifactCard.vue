<script setup lang="ts">
/**
 * ArtifactCard.vue
 * 
 * Sample component demonstrating:
 * - Artifact (markdown document) card display
 * - Lucide icons for metadata (NO emojis)
 * - Frontmatter visualization
 * - Link/edge indicators
 */
import { ref } from 'vue'
import {
  FileText,
  Tag,
  Calendar,
  User,
  Link as LinkIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  ExternalLink,
  MoreHorizontal,
  Folder
} from 'lucide-vue-next'

interface Artifact {
  id: string
  title: string
  path: string
  type: 'moc' | 'concept' | 'project' | 'resource'
  status: 'draft' | 'review' | 'published'
  domain: string
  tags: string[]
  summary: string
  updatedAt: string
  author: string
  incomingLinks: number
  outgoingLinks: number
}

const artifact = ref<Artifact>({
  id: '1',
  title: 'AI-Native Organization Model',
  path: 'vault/strategy/org-model/ai-native-org',
  type: 'concept',
  status: 'published',
  domain: 'strategy',
  tags: ['organization', 'ai-native', 'operating-model'],
  summary: 'A framework for structuring organizations where AI agents work alongside humans in a formalized pipeline with clear ownership boundaries and handoff rules.',
  updatedAt: '2026-02-06',
  author: 'AI-Agent',
  incomingLinks: 5,
  outgoingLinks: 3
})

function getTypeColor(type: Artifact['type']) {
  const colors = {
    moc: '#8B5CF6',
    concept: '#3B82F6',
    project: '#22C55E',
    resource: '#F59E0B'
  }
  return colors[type]
}

function getStatusBadgeClass(status: Artifact['status']) {
  return {
    draft: 'status--draft',
    review: 'status--review',
    published: 'status--published'
  }[status]
}
</script>

<template>
  <article class="artifact-card">
    <!-- Card Header -->
    <header class="card-header">
      <div class="type-indicator" :style="{ backgroundColor: getTypeColor(artifact.type) }">
        <FileText :size="18" class="text-white" />
      </div>
      <div class="header-content">
        <div class="header-top">
          <span class="type-label">{{ artifact.type }}</span>
          <span class="status-badge" :class="getStatusBadgeClass(artifact.status)">
            {{ artifact.status }}
          </span>
        </div>
        <h2 class="artifact-title">{{ artifact.title }}</h2>
      </div>
      <button class="menu-btn">
        <MoreHorizontal :size="18" />
      </button>
    </header>

    <!-- Path -->
    <div class="artifact-path">
      <Folder :size="14" class="path-icon" />
      <span class="path-text">{{ artifact.path }}</span>
    </div>

    <!-- Summary -->
    <p class="artifact-summary">{{ artifact.summary }}</p>

    <!-- Tags -->
    <div class="artifact-tags">
      <Tag :size="14" class="tags-icon" />
      <div class="tags-list">
        <span v-for="tag in artifact.tags" :key="tag" class="tag-chip">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">Domain</span>
        <span class="meta-value domain-value">{{ artifact.domain }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Updated</span>
        <span class="meta-value">
          <Calendar :size="12" />
          {{ artifact.updatedAt }}
        </span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Author</span>
        <span class="meta-value">
          <User :size="12" />
          {{ artifact.author }}
        </span>
      </div>
    </div>

    <!-- Links Section -->
    <div class="links-section">
      <h3 class="links-title">
        <LinkIcon :size="14" />
        Connections
      </h3>
      <div class="links-stats">
        <div class="link-stat">
          <ArrowDownLeft :size="16" class="stat-icon stat-icon--incoming" />
          <span class="stat-count">{{ artifact.incomingLinks }}</span>
          <span class="stat-label">incoming</span>
        </div>
        <div class="link-stat">
          <ArrowUpRight :size="16" class="stat-icon stat-icon--outgoing" />
          <span class="stat-count">{{ artifact.outgoingLinks }}</span>
          <span class="stat-label">outgoing</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <footer class="card-footer">
      <button class="btn btn--secondary">
        <Eye :size="14" />
        Preview
      </button>
      <button class="btn btn--primary">
        <ExternalLink :size="14" />
        Open in Editor
      </button>
    </footer>
  </article>
</template>

<style scoped>
.artifact-card {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.type-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
}

.text-white {
  color: #FFFFFF;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.type-label {
  font-size: 11px;
  font-weight: 500;
  color: #64748B;
  text-transform: uppercase;
}

.status-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  text-transform: capitalize;
}

.status--draft {
  background-color: #F1F5F9;
  color: #64748B;
}

.status--review {
  background-color: #FEF3C7;
  color: #92400E;
}

.status--published {
  background-color: #DCFCE7;
  color: #166534;
}

.artifact-title {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
  line-height: 1.3;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94A3B8;
  cursor: pointer;
}

.menu-btn:hover {
  background-color: #F1F5F9;
  color: #64748B;
}

.artifact-path {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px 10px;
  background-color: #F8FAFC;
  border-radius: 6px;
}

.path-icon {
  color: #94A3B8;
  flex-shrink: 0;
}

.path-text {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #64748B;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artifact-summary {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.artifact-tags {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.tags-icon {
  color: #94A3B8;
  margin-top: 4px;
  flex-shrink: 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  font-size: 11px;
  color: #64748B;
  background-color: #F1F5F9;
  padding: 4px 10px;
  border-radius: 9999px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #F8FAFC;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 10px;
  font-weight: 500;
  color: #94A3B8;
  text-transform: uppercase;
}

.meta-value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #0F172A;
}

.domain-value {
  font-weight: 500;
  color: #3B82F6;
}

.links-section {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #F8FAFC;
  border-radius: 8px;
}

.links-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  margin: 0 0 12px 0;
}

.links-stats {
  display: flex;
  gap: 24px;
}

.link-stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  opacity: 0.7;
}

.stat-icon--incoming {
  color: #22C55E;
}

.stat-icon--outgoing {
  color: #3B82F6;
}

.stat-count {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
}

.stat-label {
  font-size: 12px;
  color: #64748B;
}

.card-footer {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
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

.btn--primary {
  border: none;
  background: #2563EB;
  color: #FFFFFF;
}

.btn--primary:hover {
  background-color: #1D4ED8;
}
</style>
