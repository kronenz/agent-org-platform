<script setup lang="ts">
/**
 * GraphView.vue
 * 
 * Sample component demonstrating:
 * - Knowledge graph visualization layout
 * - Lucide icons for nodes and controls (NO emojis)
 * - Filter panel styling
 * - Node type color coding
 */
import { ref } from 'vue'
import {
  Network,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  FileText,
  Folder,
  Link as LinkIcon,
  X,
  ChevronDown
} from 'lucide-vue-next'

interface GraphNode {
  id: string
  title: string
  type: 'moc' | 'concept' | 'project' | 'resource'
  status: 'draft' | 'review' | 'published'
  domain: string
}

const nodes = ref<GraphNode[]>([
  { id: '1', title: 'AI-Native Organization', type: 'moc', status: 'published', domain: 'strategy' },
  { id: '2', title: 'Pipeline Model', type: 'concept', status: 'published', domain: 'operations' },
  { id: '3', title: 'Knowledge Vault', type: 'project', status: 'review', domain: 'infrastructure' },
  { id: '4', title: 'Handoff Rules', type: 'resource', status: 'draft', domain: 'operations' },
])

const selectedNode = ref<GraphNode | null>(null)
const searchQuery = ref('')
const showFilters = ref(false)

const filters = ref({
  type: [] as string[],
  status: [] as string[],
  domain: [] as string[]
})

function getNodeColor(type: GraphNode['type']) {
  const colors = {
    moc: '#8B5CF6',      // Violet
    concept: '#3B82F6',   // Blue
    project: '#22C55E',   // Green
    resource: '#F59E0B'   // Amber
  }
  return colors[type]
}

function getStatusBadgeClass(status: GraphNode['status']) {
  return {
    draft: 'badge--draft',
    review: 'badge--review',
    published: 'badge--published'
  }[status]
}
</script>

<template>
  <div class="graph-view">
    <!-- Toolbar -->
    <header class="graph-toolbar">
      <div class="toolbar-left">
        <Network :size="20" class="toolbar-icon" />
        <h1 class="toolbar-title">Knowledge Graph</h1>
        <span class="node-count">{{ nodes.length }} nodes</span>
      </div>

      <div class="toolbar-center">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search nodes..."
            class="search-input"
          />
        </div>
      </div>

      <div class="toolbar-right">
        <button 
          class="toolbar-btn" 
          :class="{ 'toolbar-btn--active': showFilters }"
          @click="showFilters = !showFilters"
        >
          <Filter :size="16" />
          Filters
        </button>
        <button class="toolbar-btn" title="Refresh">
          <RefreshCw :size="16" />
        </button>
      </div>
    </header>

    <!-- Filter Panel -->
    <div v-if="showFilters" class="filter-panel">
      <div class="filter-group">
        <label class="filter-label">Type</label>
        <div class="filter-options">
          <button 
            v-for="type in ['moc', 'concept', 'project', 'resource']" 
            :key="type"
            class="filter-chip"
            :style="{ borderColor: getNodeColor(type as GraphNode['type']) }"
          >
            {{ type }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <div class="filter-options">
          <button class="filter-chip">draft</button>
          <button class="filter-chip">review</button>
          <button class="filter-chip">published</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="graph-container">
      <!-- Graph Canvas (placeholder for react-force-graph) -->
      <div class="graph-canvas">
        <div class="graph-placeholder">
          <Network :size="48" class="placeholder-icon" />
          <p>Interactive graph rendered here with react-force-graph</p>
        </div>

        <!-- Zoom Controls -->
        <div class="zoom-controls">
          <button class="zoom-btn" title="Zoom In">
            <ZoomIn :size="18" />
          </button>
          <button class="zoom-btn" title="Zoom Out">
            <ZoomOut :size="18" />
          </button>
          <button class="zoom-btn" title="Fit to Screen">
            <Maximize2 :size="18" />
          </button>
        </div>
      </div>

      <!-- Node Detail Sidebar -->
      <aside v-if="selectedNode" class="node-sidebar">
        <header class="sidebar-header">
          <h2 class="sidebar-title">Node Details</h2>
          <button class="close-btn" @click="selectedNode = null">
            <X :size="18" />
          </button>
        </header>

        <div class="node-detail">
          <div class="node-icon" :style="{ backgroundColor: getNodeColor(selectedNode.type) }">
            <FileText :size="20" class="text-white" />
          </div>
          <h3 class="node-title">{{ selectedNode.title }}</h3>
          <span class="status-badge" :class="getStatusBadgeClass(selectedNode.status)">
            {{ selectedNode.status }}
          </span>
        </div>

        <dl class="node-meta">
          <dt>Type</dt>
          <dd>{{ selectedNode.type }}</dd>
          <dt>Domain</dt>
          <dd>{{ selectedNode.domain }}</dd>
        </dl>

        <div class="node-links">
          <h4 class="links-title">
            <LinkIcon :size="14" />
            Connections
          </h4>
          <ul class="links-list">
            <li class="link-item">
              <FileText :size="14" />
              <span>Parent: Organizational Structure</span>
            </li>
            <li class="link-item">
              <FileText :size="14" />
              <span>Related: Team Handoffs</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <!-- Legend -->
    <footer class="graph-legend">
      <span class="legend-title">Node Types:</span>
      <div class="legend-items">
        <span v-for="type in ['moc', 'concept', 'project', 'resource']" :key="type" class="legend-item">
          <span class="legend-dot" :style="{ backgroundColor: getNodeColor(type as GraphNode['type']) }"></span>
          {{ type }}
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.graph-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FAFAFA;
}

.graph-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-icon {
  color: #3B82F6;
}

.toolbar-title {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.node-count {
  font-size: 12px;
  color: #64748B;
  padding: 2px 8px;
  background-color: #F1F5F9;
  border-radius: 9999px;
}

.toolbar-center {
  flex: 1;
  max-width: 400px;
  margin: 0 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
}

.search-box:focus-within {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: #94A3B8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #0F172A;
  outline: none;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
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
  transition: all 0.15s ease;
}

.toolbar-btn:hover {
  background-color: #F8FAFC;
  color: #0F172A;
}

.toolbar-btn--active {
  background-color: #EFF6FF;
  border-color: #3B82F6;
  color: #2563EB;
}

.filter-panel {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
}

.filter-options {
  display: flex;
  gap: 6px;
}

.filter-chip {
  padding: 4px 10px;
  border: 1px solid #E2E8F0;
  border-radius: 9999px;
  background: transparent;
  font-size: 12px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-chip:hover {
  background-color: #F8FAFC;
}

.graph-container {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.graph-canvas {
  flex: 1;
  position: relative;
}

.graph-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94A3B8;
}

.placeholder-icon {
  margin-bottom: 12px;
  opacity: 0.5;
}

.zoom-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748B;
  cursor: pointer;
}

.zoom-btn:hover {
  background-color: #F1F5F9;
  color: #0F172A;
}

.node-sidebar {
  width: 300px;
  background-color: #FFFFFF;
  border-left: 1px solid #E2E8F0;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #E2E8F0;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748B;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #F1F5F9;
}

.node-detail {
  padding: 16px;
  text-align: center;
}

.node-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.node-title {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.badge--draft {
  background-color: #F1F5F9;
  color: #64748B;
}

.badge--review {
  background-color: #FEF3C7;
  color: #92400E;
}

.badge--published {
  background-color: #DCFCE7;
  color: #166534;
}

.node-meta {
  padding: 0 16px;
  margin: 0;
}

.node-meta dt {
  font-size: 11px;
  font-weight: 500;
  color: #94A3B8;
  text-transform: uppercase;
  margin-top: 12px;
}

.node-meta dd {
  font-size: 14px;
  color: #0F172A;
  margin: 4px 0 0 0;
}

.node-links {
  padding: 16px;
  border-top: 1px solid #E2E8F0;
  margin-top: 16px;
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

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin: 4px 0;
  font-size: 13px;
  color: #0F172A;
  background-color: #F8FAFC;
  border-radius: 6px;
}

.graph-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  border-top: 1px solid #E2E8F0;
}

.legend-title {
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
}

.legend-items {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748B;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.text-white {
  color: #FFFFFF;
}
</style>
