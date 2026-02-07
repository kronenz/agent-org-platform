# Reference Copy: TeamKnowledge CLAUDE.md

Source: `CLAUDE.md`
Copied on: 2026-02-07

---

# TeamKnowledge — AI-Driven Knowledge Vault

## 이 프로젝트는 무엇인가

AI가 촉발하는 가치 창출의 **모든 측면** — 사고방식, 전략, 실행, 제품 개발, 산업 파괴, 인간-AI 시너지, 문화 변혁 — 에 관한 인사이트를 체계적으로 정리하는 **지식 저장소(Knowledge Vault)**. 사람과 AI 에이전트 모두가 소비하도록 설계되었다.

## 필수 참조 문서

구조, 규칙, 작성법의 상세 정의:

**[project-structure.md](./project-structure.md)**

## 핵심 규칙 요약

1. **팀 폴더 소유권**: `management/`, `research/`, `implementation/`, `quality/` 각 팀은 자기 폴더에만 쓰기 가능. 다른 팀 폴더는 읽기 전용.
2. **파이프라인**: Management(방향 설정) → Research(조사·수집) → Implementation(구조화·집필) → Quality(검증·리뷰).
3. **Vault**: 지식 콘텐츠는 `vault/` 폴더에 7개 도메인별로 저장. Implementation이 집필, Quality가 리뷰 후 게시.
4. **7 도메인**: Mindset(사고) · Strategy(전략) · Execution(실행) · Building(빌딩) · Industries(산업) · Human-AI(인간-AI) · Ecosystem(생태계).
5. **버전 관리**: 중대한 수정 시 `versions/` 폴더에 아카이브 후 갱신.
6. **참조 방향**: 하위 팀은 상위 팀 문서를 참조하되 직접 수정하지 않는다.
7. **라이프사이클**: 아티클은 `draft → review → published` 순서. Quality 리뷰 없이 published 전환 금지.
8. **핸드오프**: 팀 간 전달은 명시적 트리거와 전달 조건을 충족해야 한다. 상세 규칙은 project-structure.md §2.4 참조.

## Vault 아티클 작성 시 반드시 지킬 것

- 모든 아티클에 **YAML frontmatter** 필수 (title, type, status, summary, tags, domain, difficulty, related)
- **하나의 문서 = 하나의 개념** (Atomic Notes)
- **각 H2 섹션은 독립적으로 의미 전달** 가능해야 함 (RAG chunking 대응)
- **`<!-- CONTEXT: ... -->`** 주석으로 긴 문서의 중간 섹션에 맥락 보존
- `_templates/` 폴더의 템플릿을 참고하여 작성

## AI 에이전트 탐색 가이드

- 전체 구조 파악: `vault/_index.md` (Master MOC)
- 도메인별 탐색: `vault/{domain}/_index.md`
- 필터링: frontmatter의 `tags`, `domain`, `summary` 활용
- 관계 탐색: `related`, `parent` 필드 및 `[[wikilink]]`
- `status: published` 문서만 신뢰할 것 (draft는 미완성)
