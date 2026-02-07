# AGENTS.md — Agent Org Platform

> Last Updated: 2026-02-07
> Status: Planning Phase (MVP 구현 준비 중)

---

## 1. Project Overview

**Agent Org Platform**은 인간과 AI 에이전트가 함께 운영하는 "AI-에이전트 네이티브 조직"을 위한 **웹 기반 운영 플랫폼**이다.

**핵심 가치**: 
- **지식 그래프 시각화**: Markdown vault의 문서와 관계를 인터랙티브 그래프로 표현
- **운영 그래프**: 파이프라인 단계, 핸드오프, 승인 흐름 시각화
- **GitHub 네이티브 대시보드**: Issues + Projects v2 기반 진행 상황 추적
- **Human Gate**: `need:human` 결정 및 승인 대기열 관리

**현재 상태**: Planning Phase — PRD, 아키텍처, MVP 범위 문서 완성.

---

## 2. Tech Stack (계획)

| Layer | Technology | Role |
|-------|------------|------|
| Frontend | **React** + TypeScript | SPA, 그래프 뷰, 대시보드 UI |
| Graph Visualization | **react-force-graph** | 인터랙티브 지식 그래프 렌더링 |
| Backend | **Node.js** / Python (TBD) | API 서버, Indexer Worker |
| Database | **PostgreSQL** (TBD) | 아티팩트 인덱스, 그래프 엣지, 워크 아이템 |
| GitHub Integration | **GitHub App** + GraphQL API | Repo 접근, Issues, PRs, Projects v2 |
| Auth | **GitHub OAuth** | 사용자 인증 |

---

## 3. Architecture Summary

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Agent Org Platform                         │
│                                                              │
│  ┌─────────────────────────┐    ┌──────────────────────────┐ │
│  │   Backend Services       │    │   Web Frontend (React)   │ │
│  │                         │    │                          │ │
│  │  • GitHub API Client    │◄──►│  • Graph View            │ │
│  │  • Indexing Worker      │ API│  • Kanban Dashboard      │ │
│  │  • Link Resolver        │    │  • Need-Human Queue      │ │
│  │  • Lint Engine          │    │  • Artifact Detail Page  │ │
│  │                         │    │                          │ │
│  └────────────┬────────────┘    └──────────────────────────┘ │
│               │                                              │
└───────────────┼──────────────────────────────────────────────┘
                │ 
    ┌───────────┴───────────────┐
    │       GitHub Repo          │
    │  • Markdown Vault          │
    │  • Issues / PRs            │
    │  • Projects v2             │
    └────────────────────────────┘
```

### Core Components

| # | Component | Responsibility |
|---|-----------|----------------|
| 1 | **GitHub App** | Repo 설치, Webhook 수신, API 토큰 관리 |
| 2 | **Indexing Worker** | Repo 트리 순회, Markdown 파싱, 그래프 빌드 |
| 3 | **Link Resolver** | Wikilink 해석 (canonical path, vault-relative, slug) |
| 4 | **Lint Engine** | Dangling link, 모호한 slug, 누락된 frontmatter 검출 |
| 5 | **GitHub Overlay** | Issues/PRs/Projects v2를 파이프라인 모델에 매핑 |
| 6 | **Graph View UI** | react-force-graph 기반 인터랙티브 그래프 |
| 7 | **Kanban Dashboard** | Projects v2 미러링, 필터링 |
| 8 | **Need-Human Queue** | 승인/결정 대기 아이템 전용 뷰 |

---

## 4. Project Structure

```
agent-org-platform/
├── CLAUDE.md                    # AI 에이전트 설정 (프로젝트 규칙)
├── AGENT.md                     # 프로젝트 지식 베이스 (본 문서)
├── project-structure.md         # 프로젝트 구조 정의서
├── README.md                    # 프로젝트 소개 및 개요
│
├── 01-vision/                   # 제품 비전
│   └── prd.md                   # PRD (5 MUST 요구사항)
│
├── 02-architecture/             # 시스템 아키텍처
│   ├── architecture.md          # 아키텍처 개요
│   ├── data-model.md            # 데이터 모델 (Graph + Ops)
│   └── github-integration.md    # GitHub 연동 설계
│
├── 03-mvp/                      # MVP 범위
│   ├── mvp-scope.md             # MVP 스크린 및 딜리버러블
│   └── user-flows.md            # 사용자 플로우
│
├── 04-operations/               # 운영 매핑
│   └── repo-os-mapping.md       # Repo OS 매핑 규칙
│
├── 05-backlog/                  # 백로그
│   └── backlog.md               # Epic A/B/C 정의
│
├── reference/                   # 참조 문서 (외부 소스)
│   ├── TEAMKNOWLEDGE-*.md       # TeamKnowledge 레포 참조 복사본
│   └── ...
│
└── LookAndFeel/                 # 프론트엔드 디자인 가이드라인
    ├── lookAndFeel.md           # 디자인 시스템 (테마, 색상, 아이콘)
    └── SamplePages/             # 샘플 UI 컴포넌트
```

### 향후 구현 시 예상 구조

```
agent-org-platform/
├── apps/
│   ├── web/                     # React Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── graph/       # Graph View (react-force-graph)
│   │   │   │   ├── kanban/      # Kanban Dashboard
│   │   │   │   ├── queue/       # Need-Human Queue
│   │   │   │   └── artifact/    # Artifact Detail Page
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── api/                     # Backend API
│       ├── src/
│       │   ├── github/          # GitHub API Client
│       │   ├── indexer/         # Indexing Worker
│       │   ├── resolver/        # Link Resolver
│       │   ├── linter/          # Lint Engine
│       │   └── routes/
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared types/utils
│
└── docs/                        # 기획 문서 (현재 루트 폴더에서 이동)
```

---

## 5. Data Model Summary

### Graph Entities

| Entity | Fields | Description |
|--------|--------|-------------|
| **Artifact** | id (canonical path), title, type, status, domain, tags | Markdown 문서 |
| **Edge** | from_id, to_id, type | 문서 간 관계 (`parent`, `related`, `mentions`, `moc_contains`) |

### Ops Entities

| Entity | Fields | Description |
|--------|--------|-------------|
| **PipelineStage** | key, owner_role, entry/exit_condition | 파이프라인 단계 정의 |
| **WorkItem** | source, stage_key, status, need_human, links | 작업 아이템 |

### Pipeline Stages (TeamKnowledge 기반)

```
Management → Research → Implementation → Quality
```

---

## 6. MVP Features (5개 MUST)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Repo Connect** | GitHub App 설치로 org/repo 연결 |
| 2 | **Knowledge Graph** | Markdown frontmatter + wikilink 기반 그래프 시각화 |
| 3 | **Ops Dashboard** | 파이프라인 단계별 WIP, throughput, failures 표시 |
| 4 | **GitHub Kanban** | Projects v2 미러링, 단계/라벨 필터링 |
| 5 | **Human Approval Queue** | `need:human` 아이템 전용 대기열 |

---

## 7. Link Resolution Rules

Wikilink 해석 우선순위:

1. `vault/` 시작 → canonical path로 처리
2. `/` 포함 → `vault/` prefix 추가
3. bare slug → `vault/**/{slug}.md` 유일 매칭 시 해석

### Lint Rules

| Lint | Condition |
|------|-----------|
| Dangling Link | target not found |
| Ambiguous Slug | 2+ matches |
| Missing Frontmatter | title/type/status/domain/summary 누락 |

---

## 8. GitHub Integration

### Labels Convention

| Label | Purpose |
|-------|---------|
| `team:management` | Management 팀 소유 |
| `team:research` | Research 팀 소유 |
| `team:implementation` | Implementation 팀 소유 |
| `team:quality` | Quality 팀 소유 |
| `need:human` | 인간 결정/승인 필요 |
| `handoff:blocked` | 핸드오프 블로킹 |

### Projects v2 Fields

| Field | Values |
|-------|--------|
| Stage | Management / Research / Implementation / Quality |
| Status | Todo / In Progress / Blocked / Done |
| Priority | P0 / P1 / P2 |

---

## 9. User Personas

| Persona | Role | Primary Actions |
|---------|------|-----------------|
| **Operator** | Founder/PM | 우선순위 설정, 승인, 처리량 모니터링 |
| **Researcher** | 리서치 팀 | 발견 및 소스 생성 |
| **Builder/Writer** | 구현 팀 | 리서치를 구조화된 결과물로 변환 |
| **Reviewer/QA** | QA 팀 | 품질 게이트 적용, published 승격 |
| **AI Agent** | 자동화된 기여자 | 아웃풋 생성, PR/Issue 오픈 |

---

## 10. Document Map

| Document | Path | Purpose |
|----------|------|---------|
| PRD | `01-vision/prd.md` | 제품 요구사항, 사용자, 핵심 개념 |
| Architecture | `02-architecture/architecture.md` | 시스템 개요, 컴포넌트 |
| Data Model | `02-architecture/data-model.md` | 그래프 + Ops 엔티티 |
| GitHub Integration | `02-architecture/github-integration.md` | GitHub App, Labels, Fields |
| MVP Scope | `03-mvp/mvp-scope.md` | 스크린, Phase 1 딜리버러블 |
| User Flows | `03-mvp/user-flows.md` | 주요 사용자 플로우 |
| Backlog | `05-backlog/backlog.md` | Epic A/B/C |
| **Look and Feel** | `LookAndFeel/lookAndFeel.md` | 디자인 시스템 (아이콘: Lucide only) |

### 문서 간 참조 흐름

```
README (개요)
    ↓
PRD (요구사항) → Architecture (기술 설계)
                      ↓
              Data Model + GitHub Integration
                      ↓
                 MVP Scope + User Flows
                      ↓
                   Backlog (구현 계획)
```

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Time-to-clarity | 신규 팀원이 Org OS를 15분 내 이해 |
| Handoff latency | 단계 간 평균 리드 타임 감소 |
| Human gate SLA | 대기 중인 승인이 가시적이고 처리됨 |

---

## 12. AI Agent 활용 가이드

### 이 프로젝트에서 AI 에이전트가 할 일

1. **기획 문서 유지보수**: 문서 정합성 유지, 상호 참조 검증
2. **MVP 구현**: React Frontend + Backend API 개발
3. **GitHub App 설정**: Webhook 처리, GraphQL 쿼리 구현
4. **Indexer 구현**: Markdown 파싱, wikilink 해석, lint 검출

### 코드 작성 시 반드시 지킬 것

- **GitHub = Source of Truth**: 실행/진행 상황은 GitHub에 유지
- **Markdown = Knowledge Source**: 지식은 Markdown vault에 유지
- **Platform = Derived Index**: 플랫폼은 파생된 인덱스 + 어노테이션만 저장
- **아이콘**: Lucide Library 사용 (이모지 금지)
- **디자인**: `LookAndFeel/lookAndFeel.md` 참조

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-07 | 1.0 | Agent Org Platform에 맞게 전면 재작성 |
