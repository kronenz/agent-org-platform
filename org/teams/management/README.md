---
title: "Management Team"
type: team
status: published
updated: 2026-02-08
index: "1.1"
pipeline_stage: management
---

# 1.1 Management Team (경영팀)

조직의 우선순위, 승인, 로드맵을 관리하는 팀.

## Team Overview

| Attribute | Value |
|-----------|-------|
| **Index** | 1.1 |
| **Division** | Management Division |
| **Pipeline Stage** | Management |
| **Owner Role** | Operator |

## Pipeline Stage

**Management** → Research → Implementation → Quality

## Team Members

### 1.1.1 Human Members

| ID | Role | Focus Area | Status |
|----|------|------------|--------|
| H-MGT-001 | Operator | Strategy, Approval, Roadmap | Active |

## Responsibilities

- 이니셔티브 정의 및 우선순위 결정
- 리소스 할당 및 팀 조율
- Human Gate 승인
- 처리량(throughput) 모니터링

## Entry/Exit Conditions

```yaml
entry_condition: new_initiative OR escalation
exit_condition: approved_and_assigned
```

## Handoff Rules

| From | To | Condition |
|------|----|-----------|
| External | Management | New initiative |
| Any Team | Management | Escalation (need:human) |
| Management | Research | Approved and assigned |

## Related

- [[INDEX#1-management-division]]
- [[roles#operator]]
- [[pipelines#management]]
