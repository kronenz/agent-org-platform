# Project Structure — Agent Org Platform

> Last Updated: 2026-02-07
> Version: 1.0

---

## 1. Overview

**Agent Org Platform**은 인간과 AI 에이전트가 함께 운영하는 "AI-에이전트 네이티브 조직"을 위한 **웹 기반 운영 플랫폼**이다.

다음을 제공한다:
- **Knowledge Graph**: Markdown vault의 문서와 관계를 인터랙티브 그래프로 시각화
- **Operational Dashboard**: 파이프라인 단계별 WIP, throughput, failures 추적
- **GitHub-native Kanban**: Issues + Projects v2 기반 진행 상황 대시보드
- **Human Gate Queue**: `need:human` 결정 및 승인 대기열

**핵심 사용자**:
- **Operator (Founder/PM)**: 우선순위 설정, 승인, 처리량 모니터링
- **Researcher/Builder/Reviewer**: 각 파이프라인 단계의 담당자
- **AI Agents**: 자동화된 기여자 (PR/Issue 생성)

---

## 2. Current Project Phase

**Planning Phase → VS Code Extension MVP 구현 준비 중**

현재 프로젝트는 기획 문서가 완성된 상태이며, **VS Code Extension**으로 MVP 구현 준비 중이다.

### Phase 로드맵

```
✅ Phase 0: Planning
   └── PRD, Architecture, Data Model, MVP Scope 문서 완성

✅ Phase 0.5: Platform Decision
   └── VS Code Extension으로 구현 결정 (Web App 대신)

⬜ Phase 1: VS Code Extension MVP
   ├── Extension 모노레포 구조 구성
   ├── Core 타입 및 인터페이스 정의
   ├── TreeView (Documents, Need Human Queue)
   ├── WebviewPanel (Knowledge Graph, Pipeline Kanban)
   ├── GitHub 인증 및 GraphQL 클라이언트
   └── QuickPick 기반 검색

⬜ Phase 2: Enhancement
   ├── 실시간 파일 감시 및 증분 인덱싱
   ├── GitHub 폴lling 및 캐시 최적화
   └── 사용자 설정 및 상태 표시줄
```

### 왜 VS Code Extension인가?

| 기준 | Web App | VS Code Extension |
|------|---------|-------------------|
| 설치 복잡도 | 서버 + DB + 배포 필요 | 마켓플레이스 원클릭 설치 |
| GitHub 연동 | OAuth 앱 또는 GitHub App 필요 | VS Code 내장 GitHub 인증 |
| 파일 시스템 접근 | 별도 동기화 필요 | 워크스페이스 직접 접근 |
| 개발자 워크플로우 | 브라우저 전환 필요 | 코드 작성 중 바로 사용 |

---

## 3. Folder Structure

### 현재 구조 (MVP Implementation Phase)

```
agent-org-platform/
├── CLAUDE.md                    # AI 에이전트 설정 (프로젝트 규칙)
├── AGENT.md                     # 프로젝트 지식 베이스
├── project-structure.md         # 프로젝트 구조 정의 (본 문서)
├── README.md                    # 프로젝트 소개 및 개요
│
│  ┌─── 조직 운영 시스템 (org/) ─────────────────────────────────┐
│  │                                                              │
├── org/                         # 조직 구조 및 지식 베이스
│   ├── _meta/                   # 조직 메타데이터
│   │   ├── org-structure.md     # 조직 구조 정의 (MOC)
│   │   ├── roles.md             # 역할 정의 (Operator, Researcher, Builder, Reviewer, Agent)
│   │   └── pipelines.md         # 파이프라인 정의 (Management→Research→Implementation→Quality)
│   │
│   ├── teams/                   # 팀별 폴더 (파이프라인 스테이지)
│   │   ├── management/          # Management 스테이지
│   │   ├── research/            # Research 스테이지
│   │   ├── implementation/      # Implementation 스테이지
│   │   └── quality/             # Quality 스테이지
│   │
│   ├── projects/                # 프로젝트별 폴더
│   │   └── agent-org-platform/  # 현재 프로젝트
│   │
│   ├── knowledge/               # 지식 베이스
│   │   ├── concepts/            # 개념 정의
│   │   ├── guides/              # 가이드 문서
│   │   └── references/          # 참조 문서
│   │
│   └── agents/                  # AI 에이전트 정의
│       ├── _registry.md         # 에이전트 레지스트리
│       └── definitions/         # 에이전트별 정의
│  │                                                              │
│  └──────────────────────────────────────────────────────────────┘
│
├── 01-vision/                   # 제품 비전
│   └── prd.md                   # PRD (5 MUST 요구사항, 사용자, 핵심 개념)
│
├── 02-architecture/             # 시스템 아키텍처
│   ├── architecture.md          # 시스템 개요, 컴포넌트
│   ├── data-model.md            # 데이터 모델 (Graph + Ops 엔티티)
│   └── github-integration.md    # GitHub App, Labels, Project Fields
│
├── 03-mvp/                      # MVP 범위
│   ├── mvp-scope.md             # MVP 스크린 및 Phase 1 딜리버러블
│   └── user-flows.md            # 주요 사용자 플로우
│
├── 04-operations/               # 운영 매핑
│   └── repo-os-mapping.md       # Repo Operating System 매핑 규칙
│
├── 05-backlog/                  # 백로그
│   └── backlog.md               # Epic A (Graph), B (GitHub), C (OS Spec)
│
├── reference/                   # 외부 참조 문서 복사본
│
├── LookAndFeel/                 # 프론트엔드 디자인 가이드라인
│   ├── lookAndFeel.md           # 디자인 시스템 (테마, 색상, 아이콘 규칙)
│   └── SamplePages/             # 샘플 UI 컴포넌트
│
└── extension/                   # VS Code Extension (Monorepo)
    ├── package.json             # Monorepo workspace config
    ├── README.md                # Extension 개발 가이드
    └── packages/
        ├── extension/           # VS Code Extension Host
        ├── webview-ui/          # React Webview (Graph, Kanban)
        ├── core/                # 공유 타입 및 유틸리티
        └── github/              # GitHub GraphQL 클라이언트
```

### 향후 구현 시 예상 구조 (VS Code Extension)

```
agent-org-platform/
│
│  ┌─── 프로젝트 메타 ─────────────────────────────────────────┐
│  │                                                            │
├── CLAUDE.md                    # AI 에이전트 설정
├── AGENT.md                     # 프로젝트 지식 베이스
├── project-structure.md         # 프로젝트 구조 정의 (본 문서)
├── README.md                    # 프로젝트 소개 및 개요
│  │                                                            │
│  └────────────────────────────────────────────────────────────┘
│
│  ┌─── 기획 문서 ──────────────────────────────────────────────┐
│  │                                                            │
├── 01-vision/                   # 제품 비전
├── 02-architecture/             # 시스템 아키텍처
├── 03-mvp/                      # MVP 범위
├── 04-operations/               # 운영 매핑
├── 05-backlog/                  # 백로그
├── reference/                   # 외부 참조 문서
│  │                                                            │
│  └────────────────────────────────────────────────────────────┘
│
│  ┌─── 프론트엔드 디자인 가이드라인 ─────────────────────────────┐
│  │                                                            │
├── LookAndFeel/                 # 디자인 시스템
│   ├── lookAndFeel.md           # 테마, 색상, 아이콘 규칙
│   └── SamplePages/             # 샘플 UI 컴포넌트
│  │                                                            │
│  └────────────────────────────────────────────────────────────┘
│
│  ┌─── VS Code Extension (Monorepo) ────────────────────────────┐
│  │                                                            │
├── extension/                   # VS Code Extension 루트
│   ├── package.json             # Monorepo workspace config
│   ├── tsconfig.base.json       # 공유 TypeScript 설정
│   └── packages/
│       │
│       ├── extension/           # VS Code Extension Host
│       │   ├── package.json     # Extension manifest
│       │   └── src/
│       │       ├── extension.ts         # 진입점 (activate/deactivate)
│       │       ├── commands/            # 명령어
│       │       │   ├── openGraph.ts     # 그래프 뷰 열기
│       │       │   ├── openKanban.ts    # 칸반 뷰 열기
│       │       │   ├── search.ts        # 퀵픽 검색
│       │       │   └── reindex.ts       # 재인덱싱
│       │       │
│       │       ├── providers/           # TreeView 제공자
│       │       │   ├── DocumentsTreeProvider.ts
│       │       │   └── QueueTreeProvider.ts
│       │       │
│       │       ├── services/            # 핵심 서비스
│       │       │   ├── IndexService.ts  # 마크다운 인덱서
│       │       │   ├── GitHubService.ts # GitHub API 클라이언트
│       │       │   └── CacheService.ts  # 캐시 관리
│       │       │
│       │       └── views/               # Webview 관리
│       │           ├── WebviewPanelFactory.ts
│       │           └── StatusBar.ts
│       │
│       ├── webview-ui/          # React Webview 앱
│       │   ├── package.json     # Vite + React 설정
│       │   ├── vite.config.ts
│       │   ├── index.html
│       │   └── src/
│       │       ├── main.tsx           # 진입점
│       │       ├── App.tsx            # 루트 컴포넌트
│       │       │
│       │       ├── views/             # 뷰 페이지
│       │       │   ├── GraphView/
│       │       │   │   ├── index.tsx
│       │       │   │   ├── Graph.tsx  # react-force-graph
│       │       │   │   └── FilterPanel.tsx
│       │       │   └── KanbanView/
│       │       │       ├── index.tsx
│       │       │       ├── Board.tsx
│       │       │       └── Column.tsx
│       │       │
│       │       ├── components/        # 공통 컴포넌트
│       │       ├── hooks/             # 커스텀 훅
│       │       └── stores/            # Zustand 상태 관리
│       │
│       ├── core/                # 공유 타입 및 유틸리티
│       │   └── src/
│       │       ├── types/
│       │       │   ├── artifact.ts    # Artifact, Frontmatter
│       │       │   ├── edge.ts        # Edge, EdgeType
│       │       │   ├── graph.ts       # GraphData, GraphNode
│       │       │   ├── work-item.ts   # WorkItem, PipelineStage
│       │       │   ├── queue-item.ts  # QueueItem
│       │       │   └── messages.ts    # Extension ↔ Webview 메시지
│       │       └── utils/
│       │           └── wikilink.ts    # Wikilink 파서
│       │
│       └── github/              # GitHub API 클라이언트
│           └── src/
│               ├── auth.ts      # VS Code GitHub 인증
│               ├── client.ts    # GraphQL 클라이언트
│               ├── queries/     # GraphQL 쿼리
│               └── mappers/     # 데이터 매핑
│  │                                                            │
│  └────────────────────────────────────────────────────────────┘
│  └────────────────────────────────────────────────────────────┘
│
├── package.json                 # Root package.json (workspaces)
├── pnpm-workspace.yaml          # pnpm workspace 설정
└── tsconfig.json                # Root TypeScript 설정
```

---

## 4. Rules

### 4.1 Data Source Rules

플랫폼의 데이터 소스 원칙:

| 규칙 | 설명 |
|------|------|
| **GitHub = Source of Truth** | 실행/진행 상황은 GitHub에 유지 (Issues, PRs, Projects v2) |
| **Markdown = Knowledge Source** | 지식은 Markdown vault에 유지 |
| **Platform = Derived Index** | 플랫폼은 파생된 인덱스 + 어노테이션만 저장 (원본 수정 X) |

### 4.2 Link Resolution Rules

Wikilink 해석 우선순위:

| 순위 | 조건 | 해석 |
|------|------|------|
| 1 | `vault/` 시작 | canonical path로 처리 |
| 2 | `/` 포함 | `vault/` prefix 추가 |
| 3 | bare slug | `vault/**/{slug}.md` 유일 매칭 시 해석 |

### 4.3 Pipeline Model

```
Management → Research → Implementation → Quality
```

각 단계는 owner_role, entry_condition, exit_condition을 가진다.

### 4.4 Naming Conventions

| 대상 | 규칙 | 예시 |
|------|------|------|
| **React 컴포넌트** | PascalCase | `GraphCanvas.tsx`, `KanbanBoard.tsx` |
| **TypeScript 훅** | camelCase with `use` prefix | `useGraph.ts`, `useGitHub.ts` |
| **TypeScript 유틸** | camelCase | `parseMarkdown.ts`, `resolveLink.ts` |
| **API 라우트** | kebab-case | `/api/artifacts`, `/api/work-items` |
| **기획 문서** | kebab-case | `data-model.md`, `github-integration.md` |
| **GraphQL 쿼리** | PascalCase | `GetProjectItems`, `GetIssueDetails` |

### 4.5 Documentation Rules

| 규칙 | 설명 |
|------|------|
| **영문 파일명** | 파일명은 영문 소문자 + 하이픈 (kebab-case) |
| **문서 간 참조** | 상대 경로로 링크. 예: `[PRD](./01-vision/prd.md)` |
| **Frontmatter** | 모든 MD 문서는 title, status, updated frontmatter 포함 |
| **프론트엔드 디자인** | `LookAndFeel/lookAndFeel.md` 참조. 아이콘은 Lucide Library만 사용 (이모지 금지) |

---

## 5. Component → Feature Mapping

PRD 요구사항 → Architecture 컴포넌트 → MVP 기능의 매핑:

| PRD Requirement | Architecture Component | MVP Feature |
|-----------------|------------------------|-------------|
| MUST-1: Repo Connect | GitHub App | GitHub App 설치, Webhook 수신 |
| MUST-2: Knowledge Graph | Indexer + Graph View | Markdown 파싱, 그래프 시각화 |
| MUST-3: Ops Dashboard | GitHub Overlay | 파이프라인 단계별 WIP, throughput |
| MUST-4: GitHub Kanban | GitHub API Client | Projects v2 미러링 |
| MUST-5: Human Queue | WorkItem Filter | `need:human` 아이템 필터링 |

---

## 6. Data Flow

### Indexing Flow

```
GitHub Repo
    │
    ▼ (push webhook / poll)
Indexing Worker
    │
    ├── Walker: repo tree 순회
    ├── Parser: MD frontmatter + body 파싱
    ├── Resolver: wikilink 해석
    └── Linter: 검증 (dangling, ambiguous, missing)
    │
    ▼
App Database
    │
    ├── Artifacts (nodes)
    ├── Edges (relationships)
    └── Lints (errors/warnings)
```

### GitHub Overlay Flow

```
GitHub API (GraphQL)
    │
    ├── Issues: state, labels, assignees
    ├── PRs: checks, files, reviews
    └── Projects v2: items, field values
    │
    ▼
WorkItem mapping
    │
    ├── stage_key: from labels/fields
    ├── need_human: from labels
    └── links: issue/pr/artifacts
```

---

## 7. Tech Stack Summary

### VS Code Extension Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Platform** | VS Code Extension | 메인 플랫폼 (웹앱 대신) |
| Extension Host | TypeScript + esbuild | 익스텐션 로직 번들링 |
| Webview UI | React + TypeScript + Vite | 그래프/칸반 뷰 렌더링 |
| Graph Viz | react-force-graph-2d | 인터랙티브 그래프 |
| State (Extension) | VS Code API | 상태 저장 (storageUri) |
| State (Webview) | Zustand | UI 상태 관리 |
| Styling | VS Code Webview UI Toolkit | VS Code 네이티브 UI |
| Icons | **Lucide** | 아이콘 (이모지 금지) |
| GitHub | Octokit GraphQL + VS Code Auth | GitHub API + 내장 인증 |
| Data Storage | `context.storageUri` | 인덱스 캐시 저장 |
| Build | esbuild (host) + Vite (webview) | 각 레이어에 최적화된 빌드 |

### 기존 Web App 아키텍처 (참고용)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + TypeScript | SPA, 컴포넌트 기반 UI |
| Backend | Node.js / Express | API 서버 |
| Database | PostgreSQL | 인덱스 저장 |
| Auth | GitHub OAuth | 사용자 인증 |

**Note**: MVP는 VS Code Extension으로 구현하며, 별도 백엔드 서버 없이 VS Code 내장 API와 GitHub 직접 연동을 사용한다.

---

## 8. AI Agent 활용 가이드

### 문서 참조 순서

AI 에이전트가 이 프로젝트를 이해하기 위한 권장 순서:

1. **본 문서 (`project-structure.md`)** — 구조, 규칙, 컨벤션
2. **`AGENT.md`** — 프로젝트 전체 요약, 아키텍처, 기술 스택
3. **`01-vision/prd.md`** — 제품 요구사항, 사용자, 핵심 개념
4. **`02-architecture/`** — 아키텍처, 데이터 모델, GitHub 연동
5. **`03-mvp/`** — MVP 범위, 사용자 플로우

### 코드 구현 시 참조 문서

| 작업 | 참조 문서 |
|------|----------|
| 제품 요구사항 이해 | `01-vision/prd.md` |
| 시스템 아키텍처 | `02-architecture/architecture.md` |
| 데이터 모델 (Artifact, Edge, WorkItem) | `02-architecture/data-model.md` |
| GitHub App / Labels / Fields | `02-architecture/github-integration.md` |
| MVP 스크린 및 딜리버러블 | `03-mvp/mvp-scope.md` |
| 사용자 플로우 | `03-mvp/user-flows.md` |
| 백로그 (Epic A/B/C) | `05-backlog/backlog.md` |
| **프론트엔드 디자인** | `LookAndFeel/lookAndFeel.md` (테마, 색상, 아이콘), `LookAndFeel/SamplePages/` (샘플 컴포넌트) |

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-07 | 1.0 | Agent Org Platform에 맞게 전면 재작성 |
