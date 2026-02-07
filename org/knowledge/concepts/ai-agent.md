---
title: "AI Agent"
type: concept
status: published
domain: AI
updated: 2026-02-07
---

# AI Agent

자동화된 기여자로서 조직 내에서 동작하는 AI 시스템.

## Definition

AI Agent는 명시적인 경계 내에서 자율적으로 작업을 수행하고, 필요 시 Human Gate에서 인간의 결정을 요청하는 시스템이다.

## Characteristics

- **자율성**: 정의된 범위 내 독립적 동작
- **경계 인식**: 권한 범위를 벗어나면 Human Gate 요청
- **추적성**: 모든 행동에 대한 Audit trail 생성
- **협업**: 인간 및 다른 Agent와 협업

## Types in Organization

### Research Agent
- 정보 수집 및 분석
- 리서치 노트 생성
- 기술 조사

### Builder Agent
- 코드 생성
- 문서 작성
- 테스트 케이스 생성

### QA Agent
- 테스트 실행
- 검증 리포트 생성

## Integration

```
Agent → GitHub Issues/PRs → Human Review → Merge
         ↓
    need:human label
         ↓
    Human Gate Queue
```

## Related

- [[roles#agent|AI Agent Role]]
- [[knowledge-graph]]
- [[pipelines]]
