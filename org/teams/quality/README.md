---
title: "Quality Team"
type: team
status: published
updated: 2026-02-08
index: "2.3"
pipeline_stage: quality
---

# 2.3 Quality Team (품질팀)

품질 검증 및 릴리스를 담당하는 팀.

## Team Overview

| Attribute | Value |
|-----------|-------|
| **Index** | 2.3 |
| **Division** | Execution Division |
| **Pipeline Stage** | Quality |
| **Owner Role** | Reviewer |

## Pipeline Stage

Management → Research → Implementation → **Quality**

## Team Members

### 2.3.1 Human Reviewers

| ID | Role | Focus Area | Status |
|----|------|------------|--------|
| H-QA-001 | Lead QA | Final Review, Release Decision | Active |

### 2.3.2 AI QA Agents

| ID | Agent Type | Capability | Status |
|----|------------|------------|--------|
| A-QA-001 | Review Agent | 코드 리뷰, 스타일 체크, 보안 스캔 | Active |
| A-QA-002 | Test Agent | 자동 테스트, 회귀 테스트 | Active |

## Responsibilities

- 코드 리뷰
- QA 테스트
- 배포 승인
- 품질 기준 유지

## Entry/Exit Conditions

```yaml
entry_condition: pr_submitted
exit_condition: merged_and_deployed
```

## Quality Gates

| Gate | Criteria | Enforced By |
|------|----------|-------------|
| Lint | No errors | CI |
| Type Check | tsc pass | CI |
| Tests | All pass | CI |
| Coverage | >= 80% | CI |
| Code Review | Approved | H-QA-001 |
| Security | No critical | A-QA-001 |

## Related

- [[INDEX#23-quality-team]]
- [[roles#reviewer]]
- [[pipelines#quality]]
