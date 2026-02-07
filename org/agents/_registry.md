---
title: "Agent Registry"
type: moc
status: published
updated: 2026-02-07
---

# Agent Registry

조직 내 등록된 AI Agent 목록.

## Active Agents

| Agent | Type | Owner | Status |
|-------|------|-------|--------|
| Claude Code | Builder | System | Active |
| Research Bot | Researcher | System | Planned |
| QA Bot | Reviewer | System | Planned |

## Agent Definitions

각 Agent의 상세 정의는 `definitions/` 폴더에 저장.

### Claude Code

- **Role**: Builder
- **Capabilities**: 코드 생성, 문서 작성, 리팩토링
- **Boundaries**: PR 생성까지, 머지는 Human 승인 필요

## Registration

새 Agent 등록 시:
1. `definitions/` 폴더에 Agent 정의 파일 생성
2. 이 레지스트리에 추가
3. 권한 및 경계 명시

## Human Gate Rules

모든 Agent는 다음 상황에서 Human Gate 요청:
- 권한 범위 외 작업
- 불확실한 결정
- 중요한 변경 (삭제, 설정 변경 등)

## Related

- [[roles#agent]]
- [[pipelines]]
