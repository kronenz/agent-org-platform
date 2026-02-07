# Look and Feel Design Guidelines

> Version: 1.0  
> Last Updated: 2026-02-07

---

## 1. Overview

This document defines the visual design standards and UI/UX guidelines for the Agent Org Platform frontend. All frontend implementations MUST adhere to these guidelines to ensure consistency, accessibility, and production-quality aesthetics.

---

## 2. Core Design Principles

### 2.1 Theme Requirements

- **Please use a modern and light theme applicable to production-level deployment.**
- The design should feel clean, professional, and suitable for operational dashboards.
- Prioritize readability and information density balance.
- Support both light and dark modes.

### 2.2 Color Palette

| Role | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Primary** | `#2563EB` (Blue 600) | `#3B82F6` (Blue 500) | Primary actions, active states |
| **Secondary** | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Secondary text, borders |
| **Background** | `#FFFFFF` | `#0F172A` (Slate 900) | Main background |
| **Surface** | `#F8FAFC` (Slate 50) | `#1E293B` (Slate 800) | Cards, panels, elevated surfaces |
| **Border** | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) | Dividers, input borders |
| **Text Primary** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Main text |
| **Text Secondary** | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Descriptions, labels |
| **Success** | `#22C55E` (Green 500) | `#4ADE80` (Green 400) | Done, published states |
| **Warning** | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Need attention, blocked |
| **Error** | `#EF4444` (Red 500) | `#F87171` (Red 400) | Errors, critical issues |

### 2.3 Pipeline Stage Colors

| Stage | Color | Usage |
|-------|-------|-------|
| **Management** | `#8B5CF6` (Violet 500) | Management stage items |
| **Research** | `#3B82F6` (Blue 500) | Research stage items |
| **Implementation** | `#22C55E` (Green 500) | Implementation stage items |
| **Quality** | `#F59E0B` (Amber 500) | Quality stage items |

### 2.4 Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| **H1** | Inter / System | 24px | 600 (Semibold) | 1.3 |
| **H2** | Inter / System | 20px | 600 (Semibold) | 1.3 |
| **H3** | Inter / System | 16px | 600 (Semibold) | 1.4 |
| **Body** | Inter / System | 14px | 400 (Regular) | 1.5 |
| **Small** | Inter / System | 12px | 400 (Regular) | 1.5 |
| **Code** | JetBrains Mono / Fira Code | 13px | 400 (Regular) | 1.4 |

---

## 3. Icon Usage (CRITICAL)

### 3.1 Icon Library Requirement

> **IMPORTANT: Whenever an icon is necessary, DO NOT use an emoji, and instead use the Lucide Library.**

- **Library**: [Lucide Icons](https://lucide.dev/)
- **Installation**: `npm install lucide-react` (React) or `npm install lucide-vue-next` (Vue)
- **Style**: Stroke-based, 24x24 default size, 2px stroke width

### 3.2 Prohibited

| DO NOT USE | Reason |
|------------|--------|
| Emoji (e.g., 📄, 🔗, ✅) | Inconsistent across platforms, unprofessional appearance |
| Custom icon fonts | Maintenance burden, accessibility concerns |
| PNG/JPEG icons | Poor scaling, lack of theming support |

### 3.3 Common Icon Mappings (Agent Org Platform)

| Concept | Lucide Icon | Import |
|---------|-------------|--------|
| Artifact/Document | `FileText`, `File` | `import { FileText } from 'lucide-react'` |
| Graph/Network | `Network`, `Share2` | `import { Network } from 'lucide-react'` |
| Link/Connection | `Link`, `ArrowRight` | `import { Link } from 'lucide-react'` |
| Kanban/Board | `Columns`, `LayoutGrid` | `import { Columns } from 'lucide-react'` |
| GitHub Issue | `CircleDot`, `AlertCircle` | `import { CircleDot } from 'lucide-react'` |
| GitHub PR | `GitPullRequest` | `import { GitPullRequest } from 'lucide-react'` |
| Repository | `GitFork`, `FolderGit2` | `import { GitFork } from 'lucide-react'` |
| Pipeline Stage | `Workflow`, `ArrowRightCircle` | `import { Workflow } from 'lucide-react'` |
| Need Human | `UserCheck`, `Hand` | `import { UserCheck } from 'lucide-react'` |
| Approval/Done | `CheckCircle`, `Check` | `import { CheckCircle } from 'lucide-react'` |
| Blocked/Error | `XCircle`, `AlertTriangle` | `import { XCircle } from 'lucide-react'` |
| In Progress | `Loader2`, `Clock` | `import { Clock } from 'lucide-react'` |
| Search | `Search` | `import { Search } from 'lucide-react'` |
| Filter | `Filter`, `SlidersHorizontal` | `import { Filter } from 'lucide-react'` |
| Settings | `Settings` | `import { Settings } from 'lucide-react'` |
| User/Assignee | `User`, `Users` | `import { User } from 'lucide-react'` |
| Tag/Label | `Tag`, `Tags` | `import { Tag } from 'lucide-react'` |
| Calendar/Date | `Calendar` | `import { Calendar } from 'lucide-react'` |
| External Link | `ExternalLink` | `import { ExternalLink } from 'lucide-react'` |
| Refresh | `RefreshCw` | `import { RefreshCw } from 'lucide-react'` |
| Expand/Collapse | `ChevronDown`, `ChevronRight` | `import { ChevronDown } from 'lucide-react'` |

### 3.4 Icon Sizing Guidelines

| Context | Size | Usage |
|---------|------|-------|
| Inline with text | 16px | Buttons, labels, tags |
| Standard UI | 20px | Cards, list items |
| Large/Hero | 24px | Empty states, section headers |
| Compact | 14px | Status indicators, badges |

---

## 4. Component Styling Standards

### 4.1 Spacing System

Use a 4px base unit system:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, icon gaps |
| `sm` | 8px | Compact elements |
| `md` | 16px | Standard component padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large section breaks |
| `2xl` | 48px | Page margins |

### 4.2 Border Radius

| Size | Value | Usage |
|------|-------|-------|
| `sm` | 4px | Small elements, tags, badges |
| `md` | 6px | Buttons, inputs |
| `lg` | 8px | Cards, panels |
| `xl` | 12px | Large cards, modals |
| `full` | 9999px | Avatars, circular elements |

### 4.3 Shadow Levels

| Level | Value | Usage |
|-------|-------|-------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| `lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |

---

## 5. Sample Page Designs

**Please refer to sample page designs in the `LookAndFeel/SamplePages` folder.**

Sample pages include:
- `GraphView.vue` - Knowledge graph visualization
- `KanbanBoard.vue` - GitHub Projects v2 kanban mirror
- `HumanQueue.vue` - Need-human approval queue
- `ArtifactCard.vue` - Artifact detail card

These samples demonstrate:
- Proper Lucide icon usage
- Color palette application
- Pipeline stage color coding
- Component composition patterns

---

## 6. Graph View Styling

Since this platform features interactive knowledge graphs:

| Property | Value | Reason |
|----------|-------|--------|
| Node Default Color | `#94A3B8` (Slate 400) | Neutral base |
| Node by Type | Vary by artifact type | Visual differentiation |
| Edge Color | `#CBD5E1` (Slate 300) | Subtle connections |
| Edge Highlight | `#3B82F6` (Blue 500) | Selected/hover state |
| Background | `#FAFAFA` | Clean, minimal distraction |
| Zoom Controls | Top-right | Standard position |

### Node Type Colors

| Type | Color |
|------|-------|
| moc (Map of Content) | `#8B5CF6` (Violet) |
| concept | `#3B82F6` (Blue) |
| project | `#22C55E` (Green) |
| resource | `#F59E0B` (Amber) |
| default | `#64748B` (Slate) |

---

## 7. Kanban Card Styling

| Element | Style |
|---------|-------|
| Card Background | `#FFFFFF` |
| Card Border | `1px solid #E2E8F0` |
| Card Shadow | `sm` on hover |
| Title | 14px, Semibold |
| Labels | Pill-shaped, 12px |
| Assignee Avatar | 24px, rounded-full |
| Due Date | 12px, secondary color |

### Status Indicators

| Status | Color | Icon |
|--------|-------|------|
| Todo | `#94A3B8` | `Circle` |
| In Progress | `#3B82F6` | `Clock` |
| Blocked | `#EF4444` | `XCircle` |
| Done | `#22C55E` | `CheckCircle` |

---

## 8. Accessibility Requirements

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Color Contrast | WCAG 2.1 AA (4.5:1 text, 3:1 UI) | Use defined color palette |
| Focus Indicators | Visible focus ring | 2px solid primary color outline |
| Keyboard Navigation | Full keyboard access | Logical tab order, focus management |
| Screen Reader | ARIA labels | All interactive elements labeled |
| Motion | Reduced motion support | `prefers-reduced-motion` media query |

---

## 9. Framework-Specific Notes

### React + Lucide

```tsx
import { FileText, Network, CheckCircle } from 'lucide-react'

function ArtifactNode({ title, status }) {
  return (
    <div className="flex items-center gap-2">
      <FileText size={16} className="text-blue-500" />
      <span>{title}</span>
      {status === 'done' && <CheckCircle size={14} className="text-green-500" />}
    </div>
  )
}
```

### Vue 3 + Lucide

```vue
<script setup>
import { FileText, Network, CheckCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center gap-2">
    <FileText :size="16" class="text-blue-500" />
    <span>{{ title }}</span>
    <CheckCircle v-if="status === 'done'" :size="14" class="text-green-500" />
  </div>
</template>
```

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-07 | 1.0 | Agent Org Platform에 맞게 전면 재작성 |
