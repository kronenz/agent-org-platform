---
title: "MVP Scope"
status: draft
updated: 2026-02-07
---

# MVP Scope

## Screens

1) Graph
- Filter: domain/status/type
- Click node -> artifact detail sidebar
- AI-powered inline search with suggestions
- Zoom controls and tooltip on hover

2) Kanban
- Mirrors Projects v2
- Quick filters: team/stage/need-human
- Stats bar showing total items, in-progress, need-human count
- Sync status indicator

3) Need Human queue
- A single list of approvals/decisions
- Priority badges (P0/P1/P2)
- Linked issues, PRs, and artifacts
- Approve/Reject actions with toast feedback

4) Documents
- Document tree sidebar with folder navigation
- Markdown viewer with full formatting
- Table of contents outline
- Metadata sidebar (type, status, folder)
- Breadcrumb navigation

5) Global Search (Cmd+K)
- AI-powered natural language search
- Recent searches and suggestions
- Search results with relevance scores
- Quick navigation to any document

## Phase 1 deliverable

- One repo connected
- Index runs on push webhook
- Graph JSON generated and served
- Projects v2 board read and displayed
- Document viewer with markdown rendering
- Global search with AI suggestions
- Toast notifications for user feedback
