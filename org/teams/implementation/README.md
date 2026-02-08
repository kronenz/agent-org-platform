---
title: "Implementation Team"
type: team
status: published
updated: 2026-02-08
index: "2.2"
pipeline_stage: implementation
---

# 2.2 Implementation Team (구현팀)

코드 구현 및 개발을 담당하는 팀.

## Team Overview

| Attribute | Value |
|-----------|-------|
| **Index** | 2.2 |
| **Division** | Execution Division |
| **Pipeline Stage** | Implementation |
| **Owner Role** | Builder |

## Pipeline Stage

Management → Research → **Implementation** → Quality

## Team Members

### 2.2.1 Human Builders

| ID | Role | Focus Area | Status |
|----|------|------------|--------|
| H-BLD-001 | Lead Developer | Core Architecture, Integration | Active |

### 2.2.2 AI Builder Agents

| ID | Agent Type | Capability | Status |
|----|------------|------------|--------|
| A-BLD-001 | Code Agent | 코드 생성, 리팩토링, 버그 수정 | Active |
| A-BLD-002 | Docs Agent | 문서 작성, README 업데이트 | Active |
| A-BLD-003 | Test Agent | 테스트 케이스 생성 | Active |

## Responsibilities

- 코드 구현
- 기술 문서 작성
- 테스트 작성
- PR 생성

## Entry/Exit Conditions

```yaml
entry_condition: design_approved
exit_condition: pr_ready_for_review
```

## Deliverables

| Output | Format | Quality Gate |
|--------|--------|--------------|
| Source Code | TypeScript/React | Lint + Type Check |
| Tests | Jest/Vitest | Coverage >= 80% |
| Documentation | Markdown | Accurate |
| Pull Request | GitHub PR | Ready for Review |

## Code Standards

- TypeScript strict mode
- No `any`, no `@ts-ignore`
- Conventional Commits

## Related

- [[INDEX#22-implementation-team]]
- [[roles#builder]]
- [[pipelines#implementation]]
