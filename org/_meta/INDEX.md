---
title: "Organization Index"
type: index
status: published
updated: 2026-02-08
---

# Agent Org Platform - Organization Index

## 0. Organization Overview

```
Agent Org Platform Organization
================================

Mission: AI-에이전트 네이티브 조직 운영 플랫폼 구축
Vision: 인간과 AI가 협업하는 조직 운영의 표준 제시

                    ┌─────────────────────────────────────┐
                    │        0. ORGANIZATION HEAD         │
                    │     Project Owner / Operator        │
                    └─────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. MANAGEMENT   │       │ 2. EXECUTION    │       │ 3. SUPPORT      │
│    Division     │       │    Division     │       │    Division     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
          │                           │                           │
    ┌─────┴─────┐             ┌───────┼───────┐             ┌─────┴─────┐
    │           │             │       │       │             │           │
   1.1         1.2          2.1     2.2     2.3           3.1         3.2
Strategy    Approval     Research Impl.  Quality      Knowledge   AI Agents
```

---

## 1. Management Division (경영본부)

전략적 의사결정, 승인, 로드맵 관리

### 1.1 Strategy Team (전략팀)
- **Pipeline Stage**: Management
- **Owner**: Operator
- **Responsibility**: 
  - 프로젝트 방향성 설정
  - 우선순위 결정
  - 리소스 할당
  - 로드맵 관리

### 1.2 Approval Gate (승인 게이트)
- **Function**: Human Gate 관리
- **Owner**: Operator
- **Responsibility**:
  - `need:human` 아이템 처리
  - 배포 승인
  - 예외 상황 결정

---

## 2. Execution Division (실행본부)

실제 작업 수행: 연구 → 구현 → 품질

### 2.1 Research Team (리서치팀)
- **Pipeline Stage**: Research
- **Owner**: Researcher
- **Responsibility**:
  - 요구사항 분석
  - 기술 조사
  - 설계 문서 작성
  - 아키텍처 설계

#### 2.1.1 Human Researchers
| ID | Role | Focus Area |
|----|------|------------|
| H-RES-001 | Lead Researcher | Architecture, System Design |

#### 2.1.2 AI Research Agents
| ID | Agent Type | Capability |
|----|------------|------------|
| A-RES-001 | Analysis Agent | 요구사항 분석, 경쟁사 조사 |
| A-RES-002 | Design Agent | 설계 문서 초안, 다이어그램 생성 |

### 2.2 Implementation Team (구현팀)
- **Pipeline Stage**: Implementation
- **Owner**: Builder
- **Responsibility**:
  - 코드 구현
  - 문서 작성
  - 테스트 작성
  - PR 생성

#### 2.2.1 Human Builders
| ID | Role | Focus Area |
|----|------|------------|
| H-BLD-001 | Lead Developer | Core Architecture, Integration |

#### 2.2.2 AI Builder Agents
| ID | Agent Type | Capability |
|----|------------|------------|
| A-BLD-001 | Code Agent | 코드 생성, 리팩토링 |
| A-BLD-002 | Docs Agent | 문서 작성, README 업데이트 |
| A-BLD-003 | Test Agent | 테스트 케이스 생성 |

### 2.3 Quality Team (품질팀)
- **Pipeline Stage**: Quality
- **Owner**: Reviewer
- **Responsibility**:
  - 코드 리뷰
  - QA 테스트
  - 배포 관리
  - 품질 기준 유지

#### 2.3.1 Human Reviewers
| ID | Role | Focus Area |
|----|------|------------|
| H-QA-001 | Lead QA | Final Review, Release Decision |

#### 2.3.2 AI QA Agents
| ID | Agent Type | Capability |
|----|------------|------------|
| A-QA-001 | Review Agent | 코드 리뷰, 스타일 체크 |
| A-QA-002 | Test Agent | 자동 테스트 실행, 결과 보고 |

---

## 3. Support Division (지원본부)

지식 관리 및 AI 에이전트 운영

### 3.1 Knowledge Management (지식관리팀)
- **Responsibility**:
  - 지식 베이스 유지보수
  - 문서 정합성 관리
  - Wikilink 관리

### 3.2 AI Agent Operations (AI 에이전트 운영팀)
- **Responsibility**:
  - 에이전트 레지스트리 관리
  - 에이전트 성능 모니터링
  - 에이전트 권한 관리

---

## 4. Complete Organization Tree

```
0. Agent Org Platform Organization
│
├── 1. Management Division (경영본부)
│   ├── 1.1 Strategy Team
│   │   └── 1.1.1 Operator (H-MGT-001)
│   │
│   └── 1.2 Approval Gate
│       └── 1.2.1 Human Gate Manager (H-MGT-001)
│
├── 2. Execution Division (실행본부)
│   │
│   ├── 2.1 Research Team
│   │   ├── 2.1.1 Human Researchers
│   │   │   └── H-RES-001: Lead Researcher
│   │   │
│   │   └── 2.1.2 AI Research Agents
│   │       ├── A-RES-001: Analysis Agent
│   │       └── A-RES-002: Design Agent
│   │
│   ├── 2.2 Implementation Team
│   │   ├── 2.2.1 Human Builders
│   │   │   └── H-BLD-001: Lead Developer
│   │   │
│   │   └── 2.2.2 AI Builder Agents
│   │       ├── A-BLD-001: Code Agent
│   │       ├── A-BLD-002: Docs Agent
│   │       └── A-BLD-003: Test Agent
│   │
│   └── 2.3 Quality Team
│       ├── 2.3.1 Human Reviewers
│       │   └── H-QA-001: Lead QA
│       │
│       └── 2.3.2 AI QA Agents
│           ├── A-QA-001: Review Agent
│           └── A-QA-002: Test Agent
│
└── 3. Support Division (지원본부)
    ├── 3.1 Knowledge Management
    │   └── 3.1.1 Knowledge Base Maintainer
    │
    └── 3.2 AI Agent Operations
        └── 3.2.1 Agent Registry Manager
```

---

## 5. Pipeline Flow Integration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PIPELINE FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [1.1 Strategy]                                                          │
│       │                                                                  │
│       ▼ approved                                                         │
│  ┌─────────┐    design_ok    ┌─────────┐    pr_ready    ┌─────────┐     │
│  │   2.1   │ ───────────────▶│   2.2   │ ──────────────▶│   2.3   │     │
│  │Research │                 │  Impl.  │                │ Quality │     │
│  └─────────┘                 └─────────┘                └─────────┘     │
│       │                           │                          │           │
│       │                           │                          ▼           │
│       │                           │                     [merged]         │
│       │                           │                          │           │
│       └───────────escalate────────┴──────────────────────────┘           │
│                       │                                                  │
│                       ▼                                                  │
│                  [1.2 Approval Gate]                                     │
│                  (need:human items)                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Member Registry Summary

| Index | ID | Type | Role | Division | Team |
|-------|-------|------|------|----------|------|
| 1.1.1 | H-MGT-001 | Human | Operator | Management | Strategy |
| 2.1.1 | H-RES-001 | Human | Lead Researcher | Execution | Research |
| 2.1.2.1 | A-RES-001 | Agent | Analysis Agent | Execution | Research |
| 2.1.2.2 | A-RES-002 | Agent | Design Agent | Execution | Research |
| 2.2.1 | H-BLD-001 | Human | Lead Developer | Execution | Implementation |
| 2.2.2.1 | A-BLD-001 | Agent | Code Agent | Execution | Implementation |
| 2.2.2.2 | A-BLD-002 | Agent | Docs Agent | Execution | Implementation |
| 2.2.2.3 | A-BLD-003 | Agent | Test Agent | Execution | Implementation |
| 2.3.1 | H-QA-001 | Human | Lead QA | Execution | Quality |
| 2.3.2.1 | A-QA-001 | Agent | Review Agent | Execution | Quality |
| 2.3.2.2 | A-QA-002 | Agent | Test Agent | Execution | Quality |

---

## 7. Related Documents

| Index | Document | Path | Purpose |
|-------|----------|------|---------|
| 7.1 | Organization Structure | [[org-structure]] | 조직 구조 개요 |
| 7.2 | Roles | [[roles]] | 역할 상세 정의 |
| 7.3 | Pipelines | [[pipelines]] | 파이프라인 정의 |
| 7.4 | Agent Registry | [[agents/_registry]] | AI 에이전트 목록 |

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-08 | 1.0 | Initial organization index creation |
