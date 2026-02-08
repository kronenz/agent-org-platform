---
title: "Project Goals & Milestones"
type: project
status: active
updated: 2026-02-08
---

# Agent Org Platform - Goals & Milestones

## Project Vision

> **인간과 AI가 협업하는 조직 운영의 표준을 제시한다.**

AI-에이전트 네이티브 조직을 위한 운영 플랫폼을 구축하여, 지식 그래프 시각화, 파이프라인 대시보드, GitHub 네이티브 통합을 제공한다.

---

## Strategic Goals (OKR)

### Objective 1: MVP 완성

**Key Results:**
- KR1.1: VS Code Extension v1.0 릴리스
- KR1.2: Knowledge Graph 렌더링 성공
- KR1.3: Pipeline Kanban 동작 확인
- KR1.4: GitHub 연동 완료

### Objective 2: 사용자 경험 최적화

**Key Results:**
- KR2.1: 설치 후 5분 내 첫 그래프 표시
- KR2.2: 1000+ 노드에서 부드러운 렌더링
- KR2.3: 검색 응답 < 500ms

### Objective 3: 조직 운영 효율화

**Key Results:**
- KR3.1: Human Gate 처리 시간 50% 단축
- KR3.2: 파이프라인 처리량 가시화
- KR3.3: 에스컬레이션 추적 가능

---

## Milestones

### M0: Foundation (완료)
**Target**: 2026-02-07 ✅

| Deliverable | Status |
|-------------|--------|
| PRD 문서 | ✅ Done |
| Architecture 문서 | ✅ Done |
| Data Model 정의 | ✅ Done |
| MVP Scope 정의 | ✅ Done |
| Extension 구조 설계 | ✅ Done |

### M1: Extension MVP (현재)
**Target**: 2026-02-15

| Deliverable | Owner | Status |
|-------------|-------|--------|
| Extension 모노레포 구성 | A-BLD-001 | ✅ Done |
| Core Types 정의 | A-BLD-001 | ✅ Done |
| Webview 기본 구조 | A-BLD-001 | ✅ Done |
| Knowledge Graph 렌더링 | 2.2 Team | ⏳ In Progress |
| Pipeline Kanban 렌더링 | 2.2 Team | ⏳ Pending |
| TreeView 구현 | 2.2 Team | ⏳ Pending |

### M2: GitHub Integration
**Target**: 2026-02-22

| Deliverable | Owner | Status |
|-------------|-------|--------|
| GitHub Auth 연동 | 2.2 Team | ⏳ Pending |
| Issues/PRs 조회 | 2.2 Team | ⏳ Pending |
| Projects v2 연동 | 2.2 Team | ⏳ Pending |
| Webhook 처리 | 2.2 Team | ⏳ Pending |

### M3: Polish & Release
**Target**: 2026-02-28

| Deliverable | Owner | Status |
|-------------|-------|--------|
| 성능 최적화 | 2.3 Team | ⏳ Pending |
| 에러 핸들링 | 2.2 Team | ⏳ Pending |
| 문서 정리 | A-BLD-002 | ⏳ Pending |
| Marketplace 배포 | 2.3 Team | ⏳ Pending |

---

## Current Sprint

### Sprint 1: Graph Visualization (2026-02-08 ~ 02-14)

**Goal**: Knowledge Graph가 실제 org/ 폴더의 문서를 시각화

| Task | Assignee | Priority | Status |
|------|----------|----------|--------|
| IndexService 구현 | A-BLD-001 | P0 | ⏳ |
| Frontmatter 파싱 | A-BLD-001 | P0 | ⏳ |
| Wikilink 추출 | A-BLD-001 | P0 | ⏳ |
| Graph 데이터 변환 | A-BLD-001 | P1 | ⏳ |
| Webview 데이터 전송 | A-BLD-001 | P1 | ⏳ |
| 노드 필터링 | A-BLD-001 | P2 | ⏳ |

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Extension 설치 성공률 | N/A | 95% | Telemetry |
| 첫 그래프 표시 시간 | N/A | < 5sec | User Test |
| 노드 렌더링 (1000개) | N/A | 60fps | Performance |
| Human Gate 응답 시간 | N/A | < 2hr | GitHub Labels |

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Remote SSH 호환성 | High | Medium | Inline script 방식 적용 (해결됨) |
| 대용량 그래프 성능 | Medium | Medium | 가상화, 클러스터링 고려 |
| GitHub API Rate Limit | Medium | Low | 캐싱, 증분 업데이트 |

---

## Decision Log

| Date | Decision | Rationale | Decided By |
|------|----------|-----------|------------|
| 2026-02-07 | VS Code Extension 선택 | 설치 간편, 파일 직접 접근 | H-MGT-001 |
| 2026-02-08 | Inline Script 방식 | Remote SSH 호환성 | A-BLD-001 |
| 2026-02-08 | react-force-graph-2d | 2D가 성능상 유리 | A-RES-001 |

---

## Related

- [[INDEX]]
- [[03-mvp/mvp-scope]]
- [[05-backlog/backlog]]
