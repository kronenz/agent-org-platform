---
title: "GitHub Integration (Issues + Projects v2)"
status: draft
updated: 2026-02-07
---

# GitHub Integration

## Why Projects v2

We want kanban + fields + views. Projects v2 is GraphQL-first.

## Minimum integration

- Issues: list, labels, assignees, state
- PRs: status checks, files changed, review state
- Projects v2: items + field values (Status, Stage, Priority)

## Recommended conventions

### Labels
- `team:management|research|implementation|quality`
- `need:human`
- `handoff:blocked`
- `type:decision|type:bug|type:content`

### Project fields
- `Stage` (single select): Management/Research/Implementation/Quality
- `Status` (single select): Todo/In Progress/Blocked/Done
- `Priority` (single select): P0/P1/P2

## Auth model

Use a GitHub App:

- Installation token for org/repo access
- Webhook secret for event verification
