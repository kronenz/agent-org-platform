---
title: "Knowledge Graph"
type: concept
status: published
domain: Platform
updated: 2026-02-07
---

# Knowledge Graph

조직의 지식을 노드와 엣지로 표현한 그래프 구조.

## Definition

Knowledge Graph는 Markdown 문서와 그들 간의 관계(wikilink, parent, related)를 시각화한 인터랙티브 그래프다.

## Components

### Nodes (Artifacts)

| Type | Description | Color |
|------|-------------|-------|
| moc | Map of Content | Blue |
| concept | 개념 정의 | Green |
| project | 프로젝트 | Amber |
| resource | 리소스/참조 | Purple |

### Edges (Relationships)

| Type | Source | Description |
|------|--------|-------------|
| parent | frontmatter | 상위 문서 |
| related | frontmatter | 관련 문서 |
| wikilink | body | [[링크]] |
d
## Features

- **필터링**: Type, Status, Domain별 필터
- **선택**: 노드 클릭 시 상세 정보
- **탐색**: 줌/팬, 연결된 노드 탐색
- **검색**: 노드 검색 및 하이라이트

## Implementation

```
Markdown Files
     ↓ (IndexService)
Artifacts + Edges
     ↓ (GraphData)
react-force-graph-2d
```

## Related

- [[ai-agent]]
- [[agent-org-platform]]
