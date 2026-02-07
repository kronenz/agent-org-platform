# Reference Copy: TeamKnowledge project-structure.md

Source: `project-structure.md`
Copied on: 2026-02-07

---

NOTE: This is a snapshot copy. Keep the canonical source in the TeamKnowledge repo.

---

# Project Structure — TeamKnowledge Vault

> Last Updated: 2026-02-06
> Version: 4

---

## 1. Overview

TeamKnowledge는 **AI-Driven** 세계에서 가치를 창출하는 데 필요한 모든 지식을 체계적으로 정리하는 **지식 저장소(Knowledge Vault)** 이다.

소프트웨어 개발에 국한되지 않는다. AI가 촉발하는 **사고방식의 전환, 전략 수립, 실행 프레임워크, 산업 파괴, 인간-AI 시너지, 문화 변혁** — 이 모든 것을 포괄한다.

**핵심 철학:**
> "AI가 90%를 해준다면, 나머지 10%의 고유한 인간 가치는 무엇이고 — 그것을 어떻게 극대화할 것인가?"

**두 가지 소비자:**
1. **사람** — 팀원이 AI 시대의 지식을 빠르게 찾고 활용
2. **AI 에이전트** — RAG, 프롬프트 주입, 에이전트 메모리 등으로 소비

---

## 2. Team Workflow (운영 파이프라인)

### 2.1 전체 흐름

지식은 4개 팀의 파이프라인을 순서대로 흐른다. 각 팀은 자기 폴더에만 쓰기 권한을 가진다.

```
┌────────────┐     ┌──────────┐     ┌────────────────┐     ┌─────────┐
│ Management │────▶│ Research │────▶│ Implementation │────▶│ Quality │
│  방향 설정  │     │ 조사·수집 │     │  구조화·집필    │     │ 검증·리뷰│
└────────────┘     └──────────┘     └───────┬────────┘     └────┬────┘
                                            │                   │
                                            ▼                   │
                                      ┌──────────┐             │
                                      │  vault/  │◀────────────┘
                                      │ (게시됨)  │  승인 → status: published
                                      └──────────┘  반려 → Implementation으로 반환
```

### 2.2 팀별 상세 역할

#### ① Management — 방향 설정

| 항목 | 내용 |
|------|------|
| **미션** | vault에 어떤 지식을 담을지 **방향과 우선순위**를 결정한다 |
| **입력** | 외부 트렌드, 팀 피드백, 비즈니스 요구 |
| **산출물** | `goals.md`, `roadmap.md`, `decisions.md` |
| **완료 조건** | goals.md에 구체적 주제 + 우선순위(P0/P1/P2)가 명시됨 |
| **트리거** | 분기 시작, 중대 이벤트 발생, Research로부터 방향 확인 요청 |

**구체적 책임:**
- 다음 주기에 다룰 주제 목록 확정 (P0 = 반드시, P1 = 가능하면, P2 = 여유 시)
- Research 팀이 참조할 수 있도록 goals.md에 **왜 이 주제가 중요한지** 맥락 기술
- 주기별 로드맵 갱신 (진행 상황 반영)
- 도메인 간 균형 확인 (한 도메인에 편중되지 않도록)

#### ② Research — 조사·수집

| 항목 | 내용 |
|------|------|
| **미션** | Management가 정한 주제에 대해 **원천 자료를 탐색하고 검증**한다 |
| **입력** | `management/goals.md`, `management/roadmap.md` |
| **산출물** | `sources.md`, `findings/{topic-slug}.md`, `spikes/{topic-slug}.md` |
| **완료 조건** | findings 문서에 검증된 소스 3개 이상 + 핵심 인사이트 요약 존재 |
| **트리거** | Management가 goals.md를 갱신한 시점 |

**구체적 책임:**
- goals.md의 P0 주제부터 조사 착수
- 소스별 신뢰도 평가 (공식 문서 > 기업 리포트 > 블로그 > 소셜미디어)
- findings 문서에는 **원문 인용 + 출처 URL** 필수
- 기술 검증이 필요한 주장은 spikes/에 PoC 기록
- 조사 중 발견한 새로운 주제는 Management에 **제안** (직접 goals.md 수정 불가)

#### ③ Implementation — 구조화·집필

| 항목 | 내용 |
|------|------|
| **미션** | Research의 조사 결과를 **vault 아티클로 정제·구조화**하여 집필한다 |
| **입력** | `research/findings/`, `research/spikes/`, `_templates/` |
| **산출물** | `vault/{domain}/{slug}.md` (status: draft), `tasks.md`, `logs/` |
| **완료 조건** | 아티클이 `_templates/` 형식 준수 + frontmatter 100% + self-contained 섹션 |
| **트리거** | Research가 findings 문서를 완성한 시점 |

**구체적 책임:**
- findings를 기반으로 vault 아티클 초안 작성 (`status: draft`)
- 반드시 `_templates/`의 해당 type 템플릿을 기반으로 작성
- frontmatter 필드 100% 채움 (title, type, status, summary, tags, domain, difficulty, related, parent)
- 각 H2 섹션이 독립적으로 의미 전달하는지 자가 검증
- 초안 완성 시 `status: review`로 변경하여 Quality에 전달
- tasks.md에 진행 상태 기록

#### ④ Quality — 검증·리뷰

| 항목 | 내용 |
|------|------|
| **미션** | vault 아티클의 **정확성, 완성도, 일관성을 검증**하고 게시 여부를 결정한다 |
| **입력** | `vault/{domain}/{slug}.md` (status: review), `implementation/style-guide.md` |
| **산출물** | `reports/{YYYY-MM-DD}-{slug}.md`, `issues.md` 갱신 |
| **완료 조건** | 리뷰 체크리스트 전 항목 통과 또는 명시적 예외 기록 |
| **트리거** | vault 아티클의 status가 `review`로 변경된 시점 |

**구체적 책임:**
- review-checklist.md 기반 체계적 검증 수행
- **승인** → `status: published`로 변경 (게시 확정)
- **반려** → `status: draft`로 되돌리고 issues.md에 수정 사항 기록
- 반려 사유는 **구체적으로** 기술 (막연한 "다시 작성" 금지)
- 매 주기 끝에 리뷰 리포트 작성 (통과율, 주요 이슈 패턴)

### 2.3 아티클 라이프사이클

아티클은 아래 상태를 순서대로 거친다. **역방향 전이는 반려 시에만 허용.**

```
            Implementation              Quality              Quality
                작성                     리뷰                 승인
  ┌───────┐  ────────▶  ┌────────┐  ────────▶  ┌───────────┐  ────────▶  ┌───────────┐
  │ (없음) │            │ draft  │             │  review   │             │ published │
  └───────┘             └────┬───┘             └─────┬─────┘             └─────┬─────┘
                             ▲                       │                        │
                             │      반려              │                        │
                             └───────────────────────┘                        │
                                                                              │
                                                                 중대 수정 시  │
                                                                    ┌─────────▼──────────┐
                                                                    │ archived (versions/)│
                                                                    └────────────────────┘
```

| 상태 | 의미 | 변경 권한 | 전이 조건 |
|------|------|----------|----------|
| `draft` | 초안 작성 중 | Implementation | Implementation이 생성 |
| `review` | 리뷰 대기 | Implementation→Quality | Implementation이 frontmatter 100% 채운 후 전환 |
| `published` | 게시 확정 — **신뢰 가능** | Quality만 | Quality가 체크리스트 전 항목 통과 확인 |
| `archived` | 역사적 참고용 | 해당 없음 | 중대 수정 시 versions/로 이동 |

---

## 3. Folder Structure

See the canonical source for the full tree.
