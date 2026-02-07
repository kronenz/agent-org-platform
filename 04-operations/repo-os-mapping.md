---
title: "Repo OS Mapping (TeamKnowledge as Reference)"
status: draft
updated: 2026-02-07
---

# Repo OS Mapping

This platform assumes the repo defines an "operating system" for humans + agents.

For TeamKnowledge, the OS is described in `project-structure.md`:

- Pipeline: Management -> Research -> Implementation -> Quality
- Output: `vault/` (published knowledge)
- Ownership boundaries: each team writes only to its folder

## What we index

- `vault/**/*.md`: knowledge artifacts
- `management/*.md`, `research/findings/*.md`, `implementation/tasks.md`, `quality/reports/*.md`: ops artifacts

## How we derive progress

- Artifact lifecycle from frontmatter `status`
- Handoff readiness by presence of required files (e.g., research findings exist)
- Quality gate from reports presence + status transitions

## How we sync to GitHub

- Each artifact can have a linked issue id in frontmatter (future)
- Until then, we use conventions + labels
