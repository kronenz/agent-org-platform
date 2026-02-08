---
title: "Research Team"
type: team
status: published
updated: 2026-02-08
index: "2.1"
pipeline_stage: research
---

# 2.1 Research Team (리서치팀)

조사, 설계, 분석을 담당하는 팀.

## Team Overview

| Attribute | Value |
|-----------|-------|
| **Index** | 2.1 |
| **Division** | Execution Division |
| **Pipeline Stage** | Research |
| **Owner Role** | Researcher |

## Pipeline Stage

Management → **Research** → Implementation → Quality

## Team Members

### 2.1.1 Human Researchers

| ID | Role | Focus Area | Status |
|----|------|------------|--------|
| H-RES-001 | Lead Researcher | Architecture, System Design | Active |

### 2.1.2 AI Research Agents

| ID | Agent Type | Capability | Status |
|----|------------|------------|--------|
| A-RES-001 | Analysis Agent | 요구사항 분석, 경쟁사 조사 | Active |
| A-RES-002 | Design Agent | 설계 문서 초안, 다이어그램 | Active |

## Responsibilities

- 요구사항 분석
- 기술 조사 및 검증
- 설계 문서 작성
- 프로토타입 개발

## Entry/Exit Conditions

```yaml
entry_condition: assigned_from_management
exit_condition: design_approved
```

## Deliverables

| Output | Format | Quality Gate |
|--------|--------|--------------|
| Requirements Spec | Markdown | Reviewed |
| Architecture Doc | Markdown + Diagrams | Approved |
| Technical Spec | Markdown | Implementation Ready |

## Related

- [[INDEX#21-research-team]]
- [[roles#researcher]]
- [[pipelines#research]]
