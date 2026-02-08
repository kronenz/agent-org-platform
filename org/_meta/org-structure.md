---
title: "Organization Structure"
type: moc
status: published
updated: 2026-02-08
---

# Organization Structure

AI-에이전트 네이티브 조직의 구조 정의.

> **상세 조직도 및 인덱스**: [[INDEX]]

## Quick Overview

```
0. Agent Org Platform Organization
├── 1. Management Division (경영본부)
│   └── 1.1 Strategy Team
├── 2. Execution Division (실행본부)
│   ├── 2.1 Research Team
│   ├── 2.2 Implementation Team
│   └── 2.3 Quality Team
└── 3. Support Division (지원본부)
    ├── 3.1 Knowledge Management
    └── 3.2 AI Agent Operations
```

## Teams

| Index | Team | Pipeline Stage | Owner Role |
|-------|------|---------------|------------|
| 1.1 | [[management\|Management]] | Management | Operator |
| 2.1 | [[research\|Research]] | Research | Researcher |
| 2.2 | [[implementation\|Implementation]] | Implementation | Builder |
| 2.3 | [[quality\|Quality]] | Quality | Reviewer |

## Pipeline Flow

```
Management → Research → Implementation → Quality
     ↓           ↓            ↓             ↓
  Planning    Design      Building      Release
```

## Member Summary

| Type | Count | Active |
|------|-------|--------|
| Human | 4 | 4 |
| AI Agent | 7 | 7 |
| **Total** | **11** | **11** |

## Key Documents

| Document | Purpose |
|----------|---------|
| [[INDEX]] | 전체 조직 인덱스 및 트리 |
| [[roles]] | 역할 상세 정의 |
| [[pipelines]] | 파이프라인 정의 |
| [[agents/_registry\|Agent Registry]] | AI 에이전트 목록 |
| [[agent-org-platform/GOALS\|Project Goals]] | 목표 및 마일스톤 |

## Related

- [[pipelines]]: 파이프라인 상세 정의
- [[roles]]: 역할 상세 정의
- [[INDEX]]: 전체 조직 인덱스
