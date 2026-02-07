---
title: "Roles"
type: concept
status: published
updated: 2026-02-07
---

# Roles

조직 내 역할 정의.

## Operator

**Owner of**: Management stage

책임:
- 우선순위 설정
- 승인 결정
- 처리량(throughput) 모니터링
- 로드맵 관리

권한:
- Human Gate 승인
- 프로젝트 생성/종료
- 팀 구성 변경

## Researcher

**Owner of**: Research stage

책임:
- 요구사항 분석
- 기술 조사
- 설계 문서 작성
- 프로토타입 검증

산출물:
- 리서치 노트
- 설계 문서
- 기술 스펙

## Builder

**Owner of**: Implementation stage

책임:
- 코드 구현
- 문서 작성
- PR 생성
- 테스트 작성

산출물:
- 소스 코드
- 기술 문서
- 테스트 케이스

## Reviewer

**Owner of**: Quality stage

책임:
- 코드 리뷰
- QA 테스트
- 배포 승인
- 품질 기준 유지

권한:
- PR 승인/반려
- 배포 트리거
- 품질 게이트 설정

## AI Agent

**Participates in**: All stages

특성:
- 자동화된 기여자
- 명시적 경계 내에서 동작
- Human Gate에서 승인 요청
- Audit trail 생성

유형:
- Research Agent: 조사, 분석
- Builder Agent: 코드 생성, 문서 작성
- QA Agent: 테스트 실행, 검증

## Related

- [[org-structure]]: 조직 구조
- [[pipelines]]: 파이프라인 정의
