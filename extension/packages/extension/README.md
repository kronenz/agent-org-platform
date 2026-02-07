# Agent Org Platform

AI-에이전트 네이티브 조직을 위한 VS Code Extension.

인간과 AI 에이전트가 함께 운영하는 조직의 **지식 그래프**, **파이프라인 대시보드**, **승인 대기열**을 시각화합니다.

![Knowledge Graph](https://raw.githubusercontent.com/agent-org/agent-org-platform/main/docs/graph-preview.png)

## Features

### 📊 Knowledge Graph
인터랙티브 그래프로 조직의 지식 구조를 시각화합니다.
- **노드 타입별 색상**: MOC(파랑), Concept(초록), Project(주황), Resource(보라)
- **필터링**: 타입, 상태, 도메인별 필터
- **노드 상세**: 클릭 시 연결된 문서 탐색
- **줌/팬**: 자유로운 그래프 탐색

### 📋 Pipeline Kanban
4단계 파이프라인으로 작업 진행 상황을 추적합니다.
- **Management** → **Research** → **Implementation** → **Quality**
- GitHub Issues/PRs 자동 연동
- Need Human 항목 강조 표시
- WIP 카운트 및 통계

### 🌳 Documents TreeView
조직 폴더 구조를 트리 형태로 탐색합니다.
- `org/_meta/` - 조직 메타데이터
- `org/teams/` - 팀별 폴더
- `org/projects/` - 프로젝트
- `org/knowledge/` - 지식 베이스
- `org/agents/` - AI 에이전트 정의

### 🔔 Need Human Queue
인간의 결정이 필요한 항목을 한눈에 확인합니다.
- 우선순위별 정렬 (P0 → P1 → P2)
- 대기 시간 표시
- 빠른 승인/반려 액션

### 🔍 Global Search
조직의 모든 문서를 빠르게 검색합니다.
- `Ctrl+Cmd+S` (Mac) / `Ctrl+Alt+S` (Windows/Linux)
- 최근 검색 기록
- 제목, 내용, 경로 검색

### 🔗 GitHub Integration
GitHub와 실시간 연동합니다.
- VS Code 내장 GitHub 인증
- Issues, PRs, Projects v2 동기화
- 라벨 기반 파이프라인 스테이지 매핑

## Requirements

- VS Code 1.85.0 이상
- 워크스페이스에 `org/` 폴더 필요

## Usage

1. `org/` 폴더가 있는 워크스페이스를 열면 자동 활성화
2. Activity Bar에서 "Agent Org" 아이콘 클릭
3. 단축키로 빠르게 접근:

| 기능 | Mac | Windows/Linux |
|------|-----|---------------|
| Knowledge Graph | `Ctrl+Cmd+G` | `Ctrl+Alt+G` |
| 문서 검색 | `Ctrl+Cmd+S` | `Ctrl+Alt+S` |
| Ops Dashboard | `Ctrl+Cmd+K` | `Ctrl+Alt+K` |

## Commands

| Command | Description |
|---------|-------------|
| `Agent Org: Open Knowledge Graph` | 지식 그래프 열기 |
| `Agent Org: Open Ops Dashboard` | 파이프라인 칸반 열기 |
| `Agent Org: Search Documents` | 문서 검색 |
| `Agent Org: Reindex Vault` | 문서 재인덱싱 |
| `Agent Org: Sync GitHub` | GitHub 동기화 |

## Extension Settings

이 Extension은 다음 설정을 제공합니다:

* `agentOrg.github.owner`: GitHub 조직/사용자명
* `agentOrg.github.repo`: GitHub 저장소명

## Known Issues

- 대용량 그래프(1000+ 노드)에서 성능 저하 가능
- GitHub Projects v2 연동은 베타 기능

## Release Notes

### 0.1.0

Initial release:
- Knowledge Graph 시각화
- Pipeline Kanban 대시보드
- Documents/Queue TreeView
- GitHub 연동
- Global Search

---

**Enjoy organizing with AI agents!** 🤖
