# Claude Code Architecture Guide

> **Version**: 1.0  
> **Last Updated**: 2026-02-08  
> **Author**: Agent Org Platform Team

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Structure](#2-file-structure)
3. [Configuration Loading Order](#3-configuration-loading-order)
4. [Hook System](#4-hook-system)
5. [Agent System](#5-agent-system)
6. [Skill System](#6-skill-system)
7. [Execution Flow](#7-execution-flow)
8. [Delegation Mechanism](#8-delegation-mechanism)
9. [Persistence Modes](#9-persistence-modes)
10. [Integration with org/ Structure](#10-integration-with-org-structure)

---

## 1. Overview

### 1.1 What is Claude Code?

Claude Code는 Anthropic의 공식 CLI 도구로, AI 에이전트가 코드베이스에서 자율적으로 작업할 수 있게 합니다.

### 1.2 What is Oh-My-ClaudeCode (OMC)?

Oh-My-ClaudeCode는 Claude Code 위에 구축된 **멀티 에이전트 오케스트레이션 시스템**입니다:

| Feature | Description |
|---------|-------------|
| **32 Agents** | 전문화된 에이전트 (architect, executor, explorer 등) |
| **3-Tier Routing** | 복잡도 기반 모델 선택 (Haiku/Sonnet/Opus) |
| **40+ Skills** | 자동 활성화되는 작업 모드 (autopilot, ralph 등) |
| **Hook System** | 11개 이벤트 타입의 확장 가능한 훅 |

### 1.3 Core Philosophy

```
"You are a CONDUCTOR, not a performer."
```

- **Orchestrator**: 작업을 직접 수행하지 않고 전문 에이전트에게 위임
- **Delegation-First**: 코드 변경은 항상 executor 에이전트에게 위임
- **Verification-Required**: 완료 전 반드시 architect 검증 필요

---

## 2. File Structure

### 2.1 Global Configuration (~/.claude/)

```
~/.claude/
├── CLAUDE.md                    # ⭐ 전역 시스템 프롬프트 (OMC 프로토콜)
├── settings.json                # 플러그인 활성화, HUD 설정
├── .credentials.json            # OAuth 토큰 (민감)
├── history.jsonl                # 세션 히스토리
│
├── plugins/
│   ├── installed_plugins.json   # 설치된 플러그인 메타데이터
│   ├── known_marketplaces.json  # 마켓플레이스 목록
│   │
│   └── cache/omc/oh-my-claudecode/
│       └── {version}/           # 현재 활성 OMC 버전
│           ├── agents/          # 32개 에이전트 프롬프트
│           │   ├── architect.md
│           │   ├── executor.md
│           │   ├── explore.md
│           │   └── ...
│           │
│           ├── skills/          # 40+ 스킬 정의
│           │   ├── autopilot/SKILL.md
│           │   ├── ralph/SKILL.md
│           │   ├── ultrawork/SKILL.md
│           │   └── ...
│           │
│           ├── hooks/
│           │   └── hooks.json   # 훅 이벤트 매핑
│           │
│           ├── scripts/         # 훅 스크립트
│           │   ├── keyword-detector.mjs
│           │   ├── skill-injector.mjs
│           │   ├── pre-tool-enforcer.mjs
│           │   ├── post-tool-verifier.mjs
│           │   ├── persistent-mode.cjs
│           │   └── ...
│           │
│           └── src/             # TypeScript 소스
│               ├── agents/definitions.ts
│               ├── hooks/bridge.ts
│               └── features/
│
├── hud/
│   └── omc-hud.mjs              # HUD 상태바 스크립트
│
├── todos/                       # 세션별 TODO
├── projects/                    # 프로젝트별 세션
└── transcripts/                 # 대화 기록
```

### 2.2 Project Configuration

```
/project/
├── CLAUDE.md                    # ⭐ 프로젝트 로컬 규칙
├── AGENT.md                     # 프로젝트 지식 베이스
│
└── .omc/                        # OMC 로컬 상태
    └── state/
        ├── ralph-state.json
        ├── autopilot-state.json
        ├── ultrawork-state.json
        └── ...
```

### 2.3 Key Files Explained

| File | Scope | Purpose | Who Modifies |
|------|-------|---------|--------------|
| `~/.claude/CLAUDE.md` | Global | OMC 오케스트레이션 프로토콜 | OMC 자동 업데이트 |
| `~/.claude/settings.json` | Global | 플러그인 활성화/비활성화 | 사용자 |
| `project/CLAUDE.md` | Local | 프로젝트별 코딩 규칙 | 사용자 |
| `project/AGENT.md` | Local | 프로젝트 아키텍처/지식 | 사용자 |
| `.omc/state/*.json` | Session | 실행 모드 상태 | OMC 자동 |

---

## 3. Configuration Loading Order

설정은 다음 순서로 로드되며, 나중에 로드된 것이 높은 우선순위를 가집니다:

```
┌─────────────────────────────────────────┐
│  Priority 1 (Lowest)                    │
│  Claude Code 기본값                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Priority 2                             │
│  ~/.claude/settings.json                │
│  (플러그인 활성화)                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Priority 3                             │
│  ~/.claude/CLAUDE.md                    │
│  (OMC 전역 프로토콜)                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Priority 4                             │
│  project/CLAUDE.md                      │
│  (프로젝트 로컬 규칙)                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Priority 5                             │
│  project/AGENT.md                       │
│  (프로젝트 지식 베이스)                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Priority 6                             │
│  Runtime Skill Injection                │
│  (keyword-detector → skill-injector)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Priority 7 (Highest)                   │
│  Explicit Commands                      │
│  (/oh-my-claudecode:autopilot 등)       │
└─────────────────────────────────────────┘
```

---

## 4. Hook System

### 4.1 Hook Events

OMC는 Claude Code의 라이프사이클 이벤트를 가로채 처리합니다:

| Hook Event | Trigger | Scripts |
|------------|---------|---------|
| `SessionStart` | 세션 시작 시 | `session-start.mjs`, `project-memory-session.mjs` |
| `UserPromptSubmit` | 사용자 입력 시 | `keyword-detector.mjs`, `skill-injector.mjs` |
| `PreToolUse` | 도구 사용 전 | `pre-tool-enforcer.mjs` |
| `PermissionRequest` | Bash 권한 요청 시 | `permission-handler.mjs` |
| `PostToolUse` | 도구 사용 후 | `post-tool-verifier.mjs`, `project-memory-posttool.mjs` |
| `SubagentStart` | 서브에이전트 시작 | `subagent-tracker.mjs start` |
| `SubagentStop` | 서브에이전트 종료 | `subagent-tracker.mjs stop` |
| `PreCompact` | 컨텍스트 압축 전 | `pre-compact.mjs`, `project-memory-precompact.mjs` |
| `Stop` | 응답 완료 시 | `persistent-mode.cjs` |
| `SessionEnd` | 세션 종료 시 | `session-end.mjs` |

### 4.2 hooks.json Structure

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/keyword-detector.mjs\"",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

### 4.3 Hook Processing Flow

```
사용자 입력
    ↓
UserPromptSubmit Hook
    ├─ keyword-detector.mjs
    │   └─ 매직 키워드 감지 (autopilot, ralph, ulw 등)
    │
    └─ skill-injector.mjs
        └─ SKILL.md 내용을 시스템 프롬프트에 주입
    ↓
Claude 처리
    ↓
PreToolUse Hook
    └─ pre-tool-enforcer.mjs
        └─ 위임 정책 검증, 모델 강제 주입
    ↓
도구 실행
    ↓
PostToolUse Hook
    └─ post-tool-verifier.mjs
        └─ 결과 검증, 오류 복구
    ↓
Stop Hook
    └─ persistent-mode.cjs
        └─ 지속 모드 체크 (계속 실행할지 결정)
```

---

## 5. Agent System

### 5.1 Agent Categories

| Category | Agents | Purpose |
|----------|--------|---------|
| **Exploration** | explore, explore-medium, explore-high | 코드베이스 탐색 |
| **Analysis** | architect, architect-medium, architect-low | 아키텍처/디버깅 |
| **Execution** | executor, executor-low, executor-high | 코드 구현 |
| **Research** | researcher, researcher-low | 외부 문서 조사 |
| **Design** | designer, designer-low, designer-high | UI/UX |
| **QA** | qa-tester, qa-tester-high | 테스트 |
| **Data** | scientist, scientist-low, scientist-high | 데이터 분석 |
| **Security** | security-reviewer, security-reviewer-low | 보안 감사 |
| **Build** | build-fixer, build-fixer-low | 빌드 오류 수정 |
| **TDD** | tdd-guide, tdd-guide-low | 테스트 주도 개발 |
| **Review** | code-reviewer, code-reviewer-low | 코드 리뷰 |
| **Orchestration** | planner, analyst, critic | 계획/분석/검토 |
| **Utility** | writer, vision | 문서/시각 분석 |

### 5.2 3-Tier Model Routing

```
┌─────────────────┬─────────────┬──────────────────────────────┐
│ Tier            │ Model       │ Use Cases                    │
├─────────────────┼─────────────┼──────────────────────────────┤
│ LOW             │ Haiku       │ 빠른 조회, 간단한 수정        │
│ MEDIUM          │ Sonnet      │ 표준 구현, 분석               │
│ HIGH            │ Opus        │ 복잡한 아키텍처, 깊은 디버깅  │
└─────────────────┴─────────────┴──────────────────────────────┘
```

### 5.3 Agent Definition Structure

```typescript
interface AgentConfig {
  name: string;           // "executor"
  description: string;    // 언제 사용할지 설명
  prompt: string;         // agents/{name}.md 내용
  tools: string[];        // ["Read", "Write", "Edit", "Bash", ...]
  model?: ModelType;      // "haiku" | "sonnet" | "opus"
}
```

### 5.4 Agent Matrix (32 Agents)

```
                    LOW (Haiku)      MEDIUM (Sonnet)     HIGH (Opus)
                    ─────────────    ───────────────     ────────────
Explore             explore          explore-medium      explore-high
Architect           architect-low    architect-medium    architect
Executor            executor-low     executor            executor-high
Researcher          researcher-low   researcher          -
Designer            designer-low     designer            designer-high
Scientist           scientist-low    scientist           scientist-high
Security            security-        -                   security-
                    reviewer-low                         reviewer
Build               build-fixer-low  build-fixer         -
TDD                 tdd-guide-low    tdd-guide           -
Code Review         code-reviewer-   -                   code-reviewer
                    low
QA                  -                qa-tester           qa-tester-high
Writing             writer           -                   -
Vision              -                vision              -
Planning            -                -                   planner, critic,
                                                         analyst
```

---

## 6. Skill System

### 6.1 Skill Types

| Skill | Trigger Keywords | Purpose |
|-------|------------------|---------|
| `autopilot` | "autopilot", "build me", "I want a" | 완전 자동 실행 |
| `ralph` | "ralph", "don't stop", "must complete" | 지속 실행 모드 |
| `ultrawork` | "ulw", "ultrawork" | 병렬 에이전트 활용 |
| `ecomode` | "eco", "ecomode", "budget" | 토큰 효율 모드 |
| `ultrapilot` | "ultrapilot", "parallel build" | 병렬 오토파일럿 |
| `plan` | "plan this", "plan the" | 계획 인터뷰 |
| `frontend-ui-ux` | UI 작업 감지 | 디자인 감각 활성화 |
| `git-master` | Git 작업 감지 | Git 전문가 모드 |

### 6.2 SKILL.md Structure

```markdown
---
name: autopilot
description: Full autonomous execution from idea to working code
---

# Autopilot Skill

## Overview
Autopilot is the ultimate hands-off mode...

## Phases
### Phase 0: Expansion
...

## Usage
/oh-my-claudecode:autopilot <your idea>
```

### 6.3 Skill Injection Flow

```
사용자 입력: "build me a todo app"
        ↓
keyword-detector.mjs
        ├─ "build me" 감지
        └─ autopilot 모드 활성화
        ↓
skill-injector.mjs
        ├─ skills/autopilot/SKILL.md 로드
        └─ 시스템 프롬프트에 스킬 지시 주입
        ↓
Claude는 autopilot 프로토콜에 따라 작업 수행
```

---

## 7. Execution Flow

### 7.1 Complete Flow Diagram

```
╔════════════════════════════════════════════════════════════════════════╗
║  PHASE 1: INITIALIZATION                                               ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  Claude Code Launch                                                    ║
║       ↓                                                                ║
║  settings.json 로드 → 플러그인 활성화 확인                              ║
║       ↓                                                                ║
║  OMC Plugin 로드                                                       ║
║       ├─ hooks/hooks.json 파싱                                         ║
║       ├─ agents/*.md 에이전트 정의 로드                                 ║
║       └─ skills/*/SKILL.md 스킬 등록                                   ║
║       ↓                                                                ║
║  SessionStart Hook 실행                                                ║
║       ├─ session-start.mjs                                             ║
║       └─ project-memory-session.mjs                                    ║
║       ↓                                                                ║
║  시스템 프롬프트 구성                                                   ║
║       ├─ ~/.claude/CLAUDE.md (전역)                                    ║
║       ├─ project/CLAUDE.md (로컬)                                      ║
║       └─ project/AGENT.md (지식)                                       ║
║                                                                        ║
╠════════════════════════════════════════════════════════════════════════╣
║  PHASE 2: USER INPUT PROCESSING                                        ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  사용자 입력: "autopilot: build me a todo app"                         ║
║       ↓                                                                ║
║  UserPromptSubmit Hook                                                 ║
║       ├─ keyword-detector.mjs                                          ║
║       │   ├─ "autopilot" 감지 → autopilot 활성화                       ║
║       │   └─ .omc/state/autopilot-state.json 생성                      ║
║       │                                                                ║
║       └─ skill-injector.mjs                                            ║
║           └─ autopilot/SKILL.md 주입                                   ║
║                                                                        ║
╠════════════════════════════════════════════════════════════════════════╣
║  PHASE 3: ORCHESTRATION                                                ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  Claude (Sisyphus Orchestrator)                                        ║
║       ↓                                                                ║
║  작업 분석 및 분해                                                      ║
║       ├─ 요구사항 분석 → analyst 에이전트                               ║
║       ├─ 설계 → architect 에이전트                                     ║
║       ├─ 구현 → executor 에이전트                                      ║
║       └─ 검증 → qa-tester 에이전트                                     ║
║                                                                        ║
╠════════════════════════════════════════════════════════════════════════╣
║  PHASE 4: AGENT DELEGATION                                             ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  delegate_task(category="quick", prompt="...")                         ║
║       ↓                                                                ║
║  PreToolUse Hook                                                       ║
║       └─ pre-tool-enforcer.mjs                                         ║
║           ├─ category → ComplexityTier 매핑                            ║
║           └─ 모델 강제 주입                                             ║
║       ↓                                                                ║
║  SubagentStart Hook                                                    ║
║       └─ subagent-tracker.mjs start                                    ║
║       ↓                                                                ║
║  에이전트 실행                                                          ║
║       ├─ 프롬프트: agents/{name}.md                                    ║
║       ├─ 도구 제한: tools[]                                            ║
║       └─ 모델: haiku/sonnet/opus                                       ║
║       ↓                                                                ║
║  SubagentStop Hook                                                     ║
║       └─ subagent-tracker.mjs stop                                     ║
║       ↓                                                                ║
║  PostToolUse Hook                                                      ║
║       └─ post-tool-verifier.mjs                                        ║
║                                                                        ║
╠════════════════════════════════════════════════════════════════════════╣
║  PHASE 5: PERSISTENCE & VERIFICATION                                   ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  Stop Hook                                                             ║
║       └─ persistent-mode.cjs                                           ║
║           ├─ Ralph: TODO 확인 → pending 있으면 계속                     ║
║           ├─ Autopilot: Phase 확인 → 다음 Phase로 진행                  ║
║           └─ Ultrawork: 병렬 작업 완료 확인                             ║
║       ↓                                                                ║
║  ┌─────────────────────┬─────────────────────┐                         ║
║  │ continue: true      │ continue: false     │                         ║
║  │ → 다음 작업 진행    │ → 완료              │                         ║
║  └─────────────────────┴─────────────────────┘                         ║
║                                ↓                                       ║
║  PreCompact Hook (완료 시)                                             ║
║       └─ 중요 정보 저장, 체크포인트 생성                                ║
║       ↓                                                                ║
║  SessionEnd Hook                                                       ║
║       └─ 메트릭 기록, 상태 정리                                        ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 8. Delegation Mechanism

### 8.1 Delegation Categories

| Category | Tier | Model | Temperature | Use For |
|----------|------|-------|-------------|---------|
| `visual-engineering` | HIGH | Opus | 0.7 | UI/UX, 디자인 시스템 |
| `ultrabrain` | HIGH | Opus | 0.3 | 복잡한 아키텍처, 디버깅 |
| `artistry` | MEDIUM | Sonnet | 0.9 | 창의적 문제 해결 |
| `quick` | LOW | Haiku | 0.1 | 간단한 조회, 수정 |
| `writing` | MEDIUM | Sonnet | 0.5 | 문서 작성 |

### 8.2 delegate_task() Usage

```python
# Category-based delegation
delegate_task(
    category="quick",
    load_skills=["git-master"],
    prompt="Fix the typo in README.md",
    run_in_background=false
)

# Agent-based delegation
delegate_task(
    subagent_type="oh-my-claudecode:executor",
    prompt="Implement the login feature",
    run_in_background=true
)
```

### 8.3 Model Enforcement

```
delegate_task(category="quick", ...)
        ↓
pre-tool-enforcer.mjs
        ↓
enforceModel()
        ├─ category: "quick"
        ├─ → ComplexityTier: LOW
        ├─ → Model: "haiku"
        └─ 모델 파라미터 강제 주입
```

---

## 9. Persistence Modes

### 9.1 Available Modes

| Mode | Description | State File |
|------|-------------|------------|
| `autopilot` | 아이디어 → 작동 코드 완전 자동화 | `autopilot-state.json` |
| `ralph` | 완료될 때까지 지속 실행 | `ralph-state.json` |
| `ultrawork` | 병렬 에이전트 활용 | `ultrawork-state.json` |
| `ultrapilot` | 병렬 오토파일럿 | `ultrapilot-state.json` |
| `ecomode` | 토큰 효율적 병렬 실행 | `ecomode-state.json` |
| `ultraqa` | QA 사이클: 테스트 → 수정 → 반복 | `ultraqa-state.json` |
| `swarm` | N개 에이전트 조율 | `swarm-state.json` |
| `pipeline` | 순차 에이전트 체이닝 | `pipeline-state.json` |

### 9.2 Persistence Logic

```javascript
// persistent-mode.cjs
function processStopContinuation() {
  const mode = detectActiveMode();
  
  if (mode === "ralph") {
    const todos = readTodoList();
    if (todos.pending > 0) {
      return { continue: true, message: "Continue working..." };
    }
    
    const verified = checkArchitectVerification();
    if (!verified) {
      return { continue: true, message: "Requesting verification..." };
    }
  }
  
  if (mode === "autopilot") {
    const phase = getCurrentPhase();
    if (phase !== "complete") {
      return { continue: true, nextPhase: getNextPhase(phase) };
    }
  }
  
  return { continue: false };
}
```

---

## 10. Integration with org/ Structure

### 10.1 Current org/ Structure

```
org/
├── _meta/
│   ├── org-structure.md    # 조직 구조 개요
│   ├── INDEX.md            # 전체 인덱스
│   ├── pipelines.md        # 4-stage 파이프라인
│   └── roles.md            # 역할 정의
│
├── agents/
│   └── _registry.md        # 7개 에이전트 정의
│
├── teams/
│   ├── management/
│   ├── research/
│   ├── implementation/
│   └── quality/
│
└── projects/
```

### 10.2 Mapping to Claude Code Agents

| org/ Agent | Claude Code Agent | Model |
|------------|-------------------|-------|
| A-RES-001 (Analysis) | researcher | Sonnet |
| A-RES-002 (Design) | architect | Opus |
| A-BLD-001 (Code) | executor | Sonnet |
| A-BLD-002 (Docs) | writer | Haiku |
| A-BLD-003 (Test) | tdd-guide | Sonnet |
| A-QA-001 (Review) | code-reviewer | Opus |
| A-QA-002 (Test) | qa-tester | Sonnet |

### 10.3 Recommended Integration

**Option A: CLAUDE.md에 매핑 추가**

```markdown
<!-- project/CLAUDE.md에 추가 -->

## AI Agent Team Mapping

이 프로젝트는 org/ 디렉토리에 정의된 AI 에이전트 팀 구조를 따릅니다.

| Pipeline Stage | org/ Agent | Claude Agent | Model |
|----------------|------------|--------------|-------|
| Research | A-RES-001 | researcher | Sonnet |
| Research | A-RES-002 | architect | Opus |
| Implementation | A-BLD-001 | executor | Sonnet |
| Implementation | A-BLD-002 | writer | Haiku |
| Implementation | A-BLD-003 | tdd-guide | Sonnet |
| Quality | A-QA-001 | code-reviewer | Opus |
| Quality | A-QA-002 | qa-tester | Sonnet |

### Human Gates

`need:human` 라벨이 있는 작업은 인간 승인이 필요합니다.
```

**Option B: 실행 가능한 스펙 추가**

```yaml
# org/agents/definitions/code-agent.yaml
id: A-BLD-001
name: Code Agent
team: implementation
pipeline_stage: implementation

# Claude Code 매핑
claude_agent: "oh-my-claudecode:executor"
model_tier: "MEDIUM"  # Sonnet

# 도구
tools:
  - Read
  - Write
  - Edit
  - Bash
  - lsp_diagnostics

# 경계 (실행 규칙)
boundaries:
  - rule: "config 파일 변경 시 need:human"
    pattern: "*.config.*"
    action: "add_label('need:human')"
```

---

## Appendix A: Quick Reference

### A.1 Common Commands

| Command | Description |
|---------|-------------|
| `/oh-my-claudecode:autopilot` | 완전 자동 실행 시작 |
| `/oh-my-claudecode:ralph` | 지속 실행 모드 |
| `/oh-my-claudecode:cancel` | 현재 모드 취소 |
| `/oh-my-claudecode:help` | 도움말 표시 |

### A.2 Magic Keywords

| Keyword | Activates |
|---------|-----------|
| `autopilot`, `build me`, `I want a` | autopilot |
| `ralph`, `don't stop`, `must complete` | ralph |
| `ulw`, `ultrawork`, `parallel` | ultrawork |
| `eco`, `ecomode`, `budget` | ecomode |
| `cancelomc`, `stopomc` | cancel |

### A.3 State File Locations

| State | Path |
|-------|------|
| Ralph | `.omc/state/ralph-state.json` |
| Autopilot | `.omc/state/autopilot-state.json` |
| Ultrawork | `.omc/state/ultrawork-state.json` |
| TODO List | `~/.claude/todos/{sessionId}.json` |

---

## Appendix B: Troubleshooting

### B.1 Plugin Not Loading

```bash
# 설치 상태 확인
cat ~/.claude/plugins/installed_plugins.json

# 활성화 상태 확인
cat ~/.claude/settings.json
```

### B.2 Mode Not Activating

```bash
# 상태 파일 확인
ls -la .omc/state/

# 상태 초기화
rm .omc/state/*.json
```

### B.3 Agent Not Delegating

- `~/.claude/CLAUDE.md`에서 위임 규칙 확인
- `pre-tool-enforcer.mjs` 로그 확인

---

## References

- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic: Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Claude Agent SDK Documentation](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Oh-My-ClaudeCode GitHub](https://github.com/Yeachan-Heo/oh-my-claudecode)
