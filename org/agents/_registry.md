---
title: "Agent Registry"
type: registry
status: published
updated: 2026-02-08
---

# AI Agent Registry

조직 내 등록된 AI Agent 목록 및 권한 정의.

## Agent Index

```
3.2 AI Agent Operations
│
├── 2.1.2 Research Agents
│   ├── A-RES-001: Analysis Agent
│   └── A-RES-002: Design Agent
│
├── 2.2.2 Builder Agents
│   ├── A-BLD-001: Code Agent
│   ├── A-BLD-002: Docs Agent
│   └── A-BLD-003: Test Agent
│
└── 2.3.2 QA Agents
    ├── A-QA-001: Review Agent
    └── A-QA-002: Test Agent
```

---

## Research Agents (2.1.2)

### A-RES-001: Analysis Agent

| Attribute | Value |
|-----------|-------|
| **ID** | A-RES-001 |
| **Index** | 2.1.2.1 |
| **Team** | Research |
| **Role** | Researcher |
| **Status** | Active |

**Capabilities:**
- 요구사항 분석 및 명세
- 경쟁사/시장 조사
- 기술 트렌드 분석
- 데이터 수집 및 정리

**Boundaries:**
- 최종 결정은 Human Researcher 승인 필요
- 외부 API 호출 시 사전 승인 필요

### A-RES-002: Design Agent

| Attribute | Value |
|-----------|-------|
| **ID** | A-RES-002 |
| **Index** | 2.1.2.2 |
| **Team** | Research |
| **Role** | Researcher |
| **Status** | Active |

**Capabilities:**
- 설계 문서 초안 작성
- 아키텍처 다이어그램 생성
- 기술 스펙 작성
- 프로토타입 제안

**Boundaries:**
- 설계 승인은 Lead Researcher
- 아키텍처 변경은 Operator 승인

---

## Builder Agents (2.2.2)

### A-BLD-001: Code Agent (Claude Code)

| Attribute | Value |
|-----------|-------|
| **ID** | A-BLD-001 |
| **Index** | 2.2.2.1 |
| **Team** | Implementation |
| **Role** | Builder |
| **Status** | Active |
| **Implementation** | Claude Code |

**Capabilities:**
- 코드 생성 및 구현
- 코드 리팩토링
- 버그 수정
- PR 생성

**Boundaries:**
- PR 머지는 Human 승인 필요
- 설정 파일 변경은 승인 필요
- 삭제 작업은 확인 필요

### A-BLD-002: Docs Agent

| Attribute | Value |
|-----------|-------|
| **ID** | A-BLD-002 |
| **Index** | 2.2.2.2 |
| **Team** | Implementation |
| **Role** | Builder |
| **Status** | Active |

**Capabilities:**
- README 작성 및 업데이트
- API 문서 생성
- 코드 주석 개선
- 변경 이력 정리

**Boundaries:**
- 기존 문서 대폭 변경 시 확인
- 외부 공개 문서는 승인 필요

### A-BLD-003: Test Agent

| Attribute | Value |
|-----------|-------|
| **ID** | A-BLD-003 |
| **Index** | 2.2.2.3 |
| **Team** | Implementation |
| **Role** | Builder |
| **Status** | Active |

**Capabilities:**
- 테스트 케이스 생성
- 테스트 커버리지 분석
- 테스트 실행 및 보고

**Boundaries:**
- 테스트 삭제는 불가
- 테스트 skip은 승인 필요

---

## QA Agents (2.3.2)

### A-QA-001: Review Agent

| Attribute | Value |
|-----------|-------|
| **ID** | A-QA-001 |
| **Index** | 2.3.2.1 |
| **Team** | Quality |
| **Role** | Reviewer |
| **Status** | Active |

**Capabilities:**
- 코드 리뷰 및 피드백
- 스타일 가이드 체크
- 보안 취약점 스캔
- Best practice 제안

**Boundaries:**
- PR 승인/반려는 Human Reviewer
- 보안 이슈 발견 시 즉시 에스컬레이션

### A-QA-002: Test Agent

| Attribute | Value |
|-----------|-------|
| **ID** | A-QA-002 |
| **Index** | 2.3.2.2 |
| **Team** | Quality |
| **Role** | Reviewer |
| **Status** | Active |

**Capabilities:**
- 자동 테스트 실행
- 회귀 테스트 수행
- 테스트 결과 보고
- 커버리지 리포트

**Boundaries:**
- 배포 승인은 Human 결정
- 테스트 실패 시 자동 블로킹

---

## Human Gate Rules

모든 Agent는 다음 상황에서 `need:human` 라벨 추가:

| Situation | Action |
|-----------|--------|
| 권한 범위 외 작업 요청 | Escalate to Operator |
| 불확실한 결정 | Escalate to Team Lead |
| 중요 변경 (삭제, 설정) | Require explicit approval |
| 보안 관련 발견 | Immediate escalation |
| 외부 서비스 연동 | Require approval |

---

## Agent Registration Process

1. `definitions/` 폴더에 Agent 정의 파일 생성
2. 이 레지스트리에 추가
3. 팀 README에 등록
4. 권한 및 경계 명시
5. Operator 승인

---

## Related

- [[INDEX#32-ai-agent-operations]]
- [[roles#agent]]
- [[pipelines]]
