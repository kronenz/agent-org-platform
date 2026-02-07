---
title: "Agent Org Platform PRD"
status: draft
updated: 2026-02-07
---

# Agent Org Platform PRD

## 1. Problem

AI agent-native teams need a shared operational plane:

- Humans need visibility: what is happening, what is blocked, what needs approval.
- Agents need structure: rules, ownership boundaries, handoff contracts.
- The system needs traceability: why decisions were made and what changed.

Today this is spread across:

- Markdown docs (rules, knowledge)
- GitHub Issues/Projects (progress)
- CI logs, n8n workflows, local scripts (execution)

## 2. Users

- Operator (Founder/PM): sets priorities, approves decisions, monitors throughput.
- Researcher: produces findings and sources.
- Builder/Writer: turns research into structured artifacts.
- Reviewer/QA: enforces quality gates and promotes to published.
- AI agents (automated contributors): generate outputs and open PRs/issues.

## 3. Core Concepts

- Workspace: an organization + one or more repositories.
- Repo Operating System: a repo-defined process spec (like TeamKnowledge `project-structure.md`).
- Artifact: a markdown file, plus extracted metadata (frontmatter, links).
- Pipeline Stage: a named stage with ownership and handoff rules.
- Human Gate: a required approval step before a stage transition.

## 4. Requirements (MVP)

### MUST-1 Repo connect (VS Code Extension)
- Extension activates when `org/` folder detected in workspace.
- Use VS Code's built-in GitHub authentication.
- Read workspace files directly (no GitHub App needed for file access).
- Sync with GitHub Issues/PRs/Projects v2 via GraphQL API.

### MUST-2 Knowledge graph
- Parse markdown frontmatter.
- Extract relationships: `parent`, `related`, body `[[wikilink]]`.
- Resolve links deterministically (support full paths + vault-relative + slug).
- Render an interactive graph view (filter by domain/status/type).

### MUST-3 Ops dashboard
- Show current work by pipeline stage.
- Show WIP per stage and throughput (weekly counts).
- Surface failures: dangling links, missing frontmatter, review stuck.

### MUST-4 GitHub-native kanban
- Integrate GitHub Projects v2 as the canonical board.
- Map issues to pipeline stages via fields/labels.
- Provide a dashboard view inside the platform.

### MUST-5 Human approval queue
- A dedicated view for `need:human` items.
- Each item links to: issue, PR, and relevant artifacts.

### MUST-6 Natural language search
- AI-powered search across all documents and artifacts.
- Keyboard shortcut (Cmd+K / Ctrl+K) for quick access.
- Search results show relevance score and document excerpts.
- Inline search in graph view with AI suggestions.

### MUST-7 Document viewer
- Render markdown documents with full formatting support.
- Document tree navigation with folder structure.
- Table of contents / outline for quick navigation.
- Metadata sidebar showing frontmatter properties.
- Modal view for quick document preview from search/graph.

## 5. Platform: VS Code Extension

### Why VS Code Extension?

| 기준 | Web App | VS Code Extension |
|------|---------|-------------------|
| **설치** | 서버 + DB + 배포 필요 | 마켓플레이스 원클릭 설치 |
| **GitHub 연동** | OAuth 앱 또는 GitHub App 필요 | VS Code 내장 GitHub 인증 |
| **파일 시스템** | 별도 동기화 필요 | 워크스페이스 직접 접근 |
| **워크플로우** | 브라우저 전환 필요 | 코드 작성 중 바로 사용 |
| **실시간 업데이트** | Webhook 서버 필요 | FileSystemWatcher |

### Extension-specific Requirements

#### EXT-1: Activation
- `org/` 폴더가 워크스페이스에 있을 때 자동 활성화
- Activity Bar에 "Agent Org" 아이콘 표시
- 상태 표시줄에 동기화 상태 표시

#### EXT-2: Views
- **WebviewPanel**: Knowledge Graph, Pipeline Kanban (복잡한 UI)
- **TreeView**: Documents, Need Human Queue (목록/트리)
- **QuickPick**: Global Search (Cmd+Shift+K)

#### EXT-3: Commands
- `Cmd+Shift+K`: Global Search 열기
- `Cmd+Shift+G`: Knowledge Graph 열기
- `Agent Org: Reindex Vault`: 전체 재인덱싱
- `Agent Org: Sync GitHub`: GitHub 데이터 동기화

#### EXT-4: Storage
- 인덱스 캐시: `context.storageUri`에 JSON 저장
- 사용자 설정: VS Code `settings.json`
- 인증 토큰: `context.secrets`에 안전하게 저장
- 워크스페이스 폴터는 수정하지 않음 (read-only)

## 6. Non-Goals (MVP)

- Full document editor (VS Code 기본 에디터 사용).
- Replacing GitHub Issues/Projects.
- Running agents inside the platform.
- Drag-and-drop kanban (v2 consideration).
- AI/embedding search (simple text search for v1).

## 7. Success Metrics

- **Time-to-clarity**: 새 팀원이 VS Code에서 조직 OS를 15분 내에 이해할 수 있음.
- **확장 설치**: 마켓플레이스에서 1클릭으로 설치 가능.
- **지연 시간 감소**: 단계 간 평균 리드 타임 감소 (GitHub Projects v2 연동으로).
- **Human gate SLA**: `need:human` 아이템이 Queue TreeView에서 표시되고 즉시 조치 가능.

## 8. Open Questions

- Should the OS spec be standardized (YAML/JSON) instead of markdown-only?
- How do we authenticate agents (service accounts vs GitHub App acting as bot)?
