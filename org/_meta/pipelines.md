---
title: "Pipelines"
type: concept
status: published
updated: 2026-02-07
---

# Pipelines

파이프라인 스테이지 정의 및 핸드오프 규칙.

## Pipeline Stages

### Management

```yaml
stage: management
owner_role: operator
entry_condition: new_initiative OR escalation
exit_condition: approved_and_assigned
```

활동:
- 이니셔티브 정의
- 우선순위 결정
- 리소스 할당
- 승인

### Research

```yaml
stage: research
owner_role: researcher
entry_condition: assigned_from_management
exit_condition: design_approved
```

활동:
- 요구사항 분석
- 기술 조사
- 설계 문서 작성
- 프로토타입

### Implementation

```yaml
stage: implementation
owner_role: builder
entry_condition: design_approved
exit_condition: pr_ready_for_review
```

활동:
- 코드 구현
- 문서 작성
- 테스트 작성
- PR 생성

### Quality

```yaml
stage: quality
owner_role: reviewer
entry_condition: pr_submitted
exit_condition: merged_and_deployed
```

활동:
- 코드 리뷰
- QA 테스트
- 배포 승인
- 릴리스

## Human Gates

Human Gate는 자동화된 프로세스가 멈추고 인간의 결정을 요구하는 지점.

| Gate | Trigger | Required Action |
|------|---------|-----------------|
| `need:human` 라벨 | Agent가 결정 불가 | Operator 결정 |
| PR 승인 | PR 생성 완료 | Reviewer 승인 |
| 배포 승인 | QA 통과 | Operator 승인 |

## Stage Transitions

```
┌─────────────┐
│ Management  │ ──approved──▶ ┌──────────┐
└─────────────┘               │ Research │
       ▲                      └──────────┘
       │                            │
   escalate                    design_ok
       │                            ▼
┌──────────┐                 ┌────────────────┐
│ Quality  │ ◀──pr_ready──── │ Implementation │
└──────────┘                 └────────────────┘
       │
   merged
       ▼
   [Done]
```

## Related

- [[org-structure]]: 조직 구조
- [[roles]]: 역할 정의
