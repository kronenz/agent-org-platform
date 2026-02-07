---
title: "Agent Org Platform"
type: project
status: review
domain: platform
updated: 2026-02-07
parent: org-structure
---

# Agent Org Platform

AI-에이전트 네이티브 조직을 위한 VS Code Extension 플랫폼.

## Overview

인간과 AI 에이전트가 함께 운영하는 조직을 위한 운영 플랫폼:
- Knowledge Graph 시각화
- Pipeline Kanban 대시보드
- Human Gate Queue
- GitHub 연동

## Status

**Current Phase**: MVP Implementation

## Features

### Implemented

- [x] Extension 모노레포 구조
- [x] Knowledge Graph (react-force-graph)
- [x] Pipeline Kanban (4 stages)
- [x] Documents TreeView
- [x] Need Human Queue TreeView
- [x] GitHub GraphQL 연동
- [x] Global Search (QuickPick)

### Planned

- [ ] 실시간 파일 감시
- [ ] 증분 인덱싱
- [ ] AI 기반 검색

## Tech Stack

- VS Code Extension API
- React + TypeScript
- Vite + esbuild
- react-force-graph-2d
- Zustand
- Octokit GraphQL

## Links

- [[prd|PRD]]
- [[architecture|Architecture]]
- [[data-model|Data Model]]

## Team

- **Stage**: Implementation → Quality
- **Builders**: AI Agents + Human reviewers
