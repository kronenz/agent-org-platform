---
title: "Data Model (Graph + Ops)"
status: draft
updated: 2026-02-07
---

# Data Model

## Graph entities

- Artifact
  - id: canonical path (e.g., `vault/strategy/value-creation/ai-fast-revenue-models`)
  - title, type, status, domain, tags, difficulty
  - updated_at (from git)

- Edge
  - from_artifact_id
  - to_artifact_id
  - type: `parent` | `related` | `mentions` | `moc_contains`

## Ops entities

- PipelineStage
  - key: `management|research|implementation|quality`
  - owner_role
  - entry_condition
  - exit_condition

- WorkItem
  - source: `github_issue|github_pr|artifact`
  - stage_key
  - status: `todo|in_progress|blocked|done`
  - need_human: bool
  - links: issue/pr/artifacts

## Link resolution rules (important)

- Canonical node id = repo-relative path without `.md`.
- For wikilinks:
  - If target starts with `vault/` -> treat as canonical
  - If target contains `/` -> prefix with `vault/`
  - If bare slug -> resolve via `vault/**/{slug}.md` if unique

## Lints

- Dangling link: target not found
- Ambiguous slug: 2+ matches
- Missing required frontmatter: title/type/status/domain/summary
