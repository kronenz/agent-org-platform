# ADR-001: Source of Truth Hierarchy

> **Status**: Accepted  
> **Date**: 2026-02-08  
> **Decision Makers**: Human + AI Agent Team  
> **Consulted**: Project stakeholders  

---

## Context

AI 에이전트가 대형 프로젝트를 수행할 때, 정보의 일관성 유지가 핵심 과제입니다. 
Claude Code는 세션 간 컨텍스트가 리셋되고, 긴 대화에서 초기 내용이 압축/손실됩니다.

**문제**:
- 대화 컨텍스트는 휘발성 (세션 종료 시 손실)
- 여러 에이전트가 작업할 때 정보 동기화 어려움
- "왜 이렇게 결정했는가?"에 대한 기록 부재

---

## Decision

**We will establish a 3-tier Source of Truth hierarchy.**

### Tier 1: Immutable (변경 불가)
- **ADR (Architecture Decision Records)**: 결정 기록은 영구 보존
- **Tests**: 동작 계약은 코드로 보장

### Tier 2: Mutable (변경 가능)
- **docs/**: 아키텍처, 품질 문서
- **GitHub Issues**: 요구사항, 작업 추적

### Tier 3: Volatile (휘발성)
- **session-brief.md**: 세션 상태 스냅샷
- **대화 컨텍스트**: 현재 세션 정보

---

## Rationale

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **3-tier hierarchy** | - 명확한 책임 분리<br>- 핸드오프 용이<br>- 결정 추적 가능 | - 초기 설정 비용 |
| 대화만 사용 | - 간단함 | - 세션 간 손실<br>- 추적 불가 |
| 단일 문서 | - 단순함 | - 스케일 안됨<br>- 충돌 발생 |

### Why This Option

AI 에이전트의 구조적 한계(컨텍스트 손실, 세션 분리)를 파일 기반 지속성으로 보완합니다.
각 tier가 명확한 역할을 가져 정보 충돌을 방지합니다.

---

## Consequences

### Positive

- 세션 간 정보 손실 최소화
- 결정의 이유(Why)가 영구 기록됨
- 새 에이전트/인간이 빠르게 컨텍스트 파악 가능

### Negative

- ADR 작성에 시간 소요
- 문서 유지보수 오버헤드

### Neutral

- session-brief.md는 매 세션 업데이트 필요

---

## Implementation

### Action Items

- [x] docs/00-system/source-of-truth.md 생성
- [x] docs/03-decisions/adr-template.md 생성
- [x] docs/06-status/session-brief.md 생성
- [ ] CLAUDE.md에 SoT 계층 참조 추가

### Affected Components

| Component | Change Required |
|-----------|-----------------|
| CLAUDE.md | SoT 계층 참조 추가 |
| docs/ | 새 폴더 구조 (00-system, 03-decisions, 06-status) |
| Session workflow | session-brief.md 업데이트 루틴 |

---

## Related

- **Related ADRs**: None (first ADR)
- **Related Docs**: 
  - docs/ai-agent-project-consistency-guide.md
  - docs/00-system/source-of-truth.md

---

## Notes

이 결정은 Anthropic의 "Building Effective Agents" 리서치와 
실제 Claude Code + Oh-My-ClaudeCode 운영 경험을 기반으로 합니다.
