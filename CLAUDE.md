# Agent Org Platform

## 이 프로젝트는 무엇인가

인간과 AI 에이전트가 함께 운영하는 **"AI-에이전트 네이티브 조직"을 위한 웹 기반 운영 플랫폼**. 다음을 시각화한다:

1. **Knowledge Graph** — Markdown vault의 문서와 관계를 인터랙티브 그래프로 표현
2. **Operational Graph** — 파이프라인 단계, 핸드오프, 승인 흐름
3. **GitHub Dashboard** — Issues + Projects v2 기반 진행 상황 (Kanban)
4. **Human Gate Queue** — `need:human` 결정 및 승인 대기열

## 필수 참조 문서

| Document | Path | Purpose |
|----------|------|---------|
| **AGENT.md** | `./AGENT.md` | 프로젝트 지식 베이스, 아키텍처, 컴포넌트 |
| **project-structure.md** | `./project-structure.md` | 프로젝트 구조, 규칙, 컨벤션 |
| **PRD** | `./01-vision/prd.md` | 제품 요구사항, 사용자, 핵심 개념 |
| **Architecture** | `./02-architecture/architecture.md` | 시스템 아키텍처 |
| **Data Model** | `./02-architecture/data-model.md` | Graph + Ops 데이터 모델 |
| **MVP Scope** | `./03-mvp/mvp-scope.md` | MVP 스크린 및 딜리버러블 |

## 현재 상태

**Planning Phase** — PRD, 아키텍처, MVP 범위 문서 완성. 구현 준비 중.

## 핵심 규칙 요약

1. **GitHub = Source of Truth**: 실행/진행 상황은 GitHub에 유지 (Issues, PRs, Projects v2)
2. **Markdown = Knowledge Source**: 지식은 Markdown vault에 유지
3. **Platform = Derived Index**: 플랫폼은 파생된 인덱스 + 어노테이션만 저장 (원본 수정 X)
4. **Wikilink Resolution**: canonical path → vault-relative → slug 순으로 해석
5. **Pipeline Model**: Management → Research → Implementation → Quality

## 코드 작성 시 반드시 지킬 것

- **Frontend**: React + TypeScript, react-force-graph로 그래프 시각화
- **Backend**: GitHub App 기반 API, Indexing Worker
- **GitHub API**: GraphQL 사용 (Projects v2 접근)
- **데이터 모델**: `02-architecture/data-model.md` 참조
- **Frontend Design**: `LookAndFeel/lookAndFeel.md` 참조. 아이콘은 Lucide Library만 사용 (이모지 금지)

## MVP 기능 (5개 MUST)

| Feature | Description |
|---------|-------------|
| **Repo Connect** | GitHub App 설치로 org/repo 연결 |
| **Knowledge Graph** | frontmatter + wikilink 기반 그래프 시각화 |
| **Ops Dashboard** | 파이프라인 단계별 WIP, throughput, failures |
| **GitHub Kanban** | Projects v2 미러링 |
| **Human Queue** | `need:human` 아이템 대기열 |

## AI 에이전트 탐색 가이드

| 작업 | 참조 문서 |
|------|----------|
| 프로젝트 전체 요약 | `AGENT.md` |
| 구조, 규칙, 컨벤션 | `project-structure.md` |
| 제품 요구사항 | `01-vision/prd.md` |
| 시스템 아키텍처 | `02-architecture/architecture.md` |
| 데이터 모델 | `02-architecture/data-model.md` |
| GitHub 연동 | `02-architecture/github-integration.md` |
| MVP 범위 | `03-mvp/mvp-scope.md` |
| 사용자 플로우 | `03-mvp/user-flows.md` |
| 백로그 | `05-backlog/backlog.md` |
| **프론트엔드 디자인** | `LookAndFeel/lookAndFeel.md` (아이콘: Lucide only) |
