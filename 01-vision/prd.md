---
title: "Agent Org Platform PRD"
status: draft
updated: 2026-02-07
---

# Agent Org Platform PRD

## 1. Problem

AI agent-native teams need a shared operational plane:

- Humans need visibility: what is happening, what is blocked, what needs approval.
- Agents need structure: rules, ownership boundaries, handoff contracts.
- The system needs traceability: why decisions were made and what changed.

Today this is spread across:

- Markdown docs (rules, knowledge)
- GitHub Issues/Projects (progress)
- CI logs, n8n workflows, local scripts (execution)

## 2. Users

- Operator (Founder/PM): sets priorities, approves decisions, monitors throughput.
- Researcher: produces findings and sources.
- Builder/Writer: turns research into structured artifacts.
- Reviewer/QA: enforces quality gates and promotes to published.
- AI agents (automated contributors): generate outputs and open PRs/issues.

## 3. Core Concepts

- Workspace: an organization + one or more repositories.
- Repo Operating System: a repo-defined process spec (like TeamKnowledge `project-structure.md`).
- Artifact: a markdown file, plus extracted metadata (frontmatter, links).
- Pipeline Stage: a named stage with ownership and handoff rules.
- Human Gate: a required approval step before a stage transition.

## 4. Requirements (MVP)

### MUST-1 Repo connect (GitHub App)
- Install GitHub App to org/repo.
- Read repo contents, issues, PRs, Projects v2.

### MUST-2 Knowledge graph
- Parse markdown frontmatter.
- Extract relationships: `parent`, `related`, body `[[wikilink]]`.
- Resolve links deterministically (support full paths + vault-relative + slug).
- Render an interactive graph view (filter by domain/status/type).

### MUST-3 Ops dashboard
- Show current work by pipeline stage.
- Show WIP per stage and throughput (weekly counts).
- Surface failures: dangling links, missing frontmatter, review stuck.

### MUST-4 GitHub-native kanban
- Integrate GitHub Projects v2 as the canonical board.
- Map issues to pipeline stages via fields/labels.
- Provide a dashboard view inside the platform.

### MUST-5 Human approval queue
- A dedicated view for `need:human` items.
- Each item links to: issue, PR, and relevant artifacts.

## 5. Non-Goals (MVP)

- Full document editor (read-only is fine).
- Replacing GitHub Issues/Projects.
- Running agents inside the platform (we can start by observing + linking).

## 6. Success Metrics

- Time-to-clarity: a new team member can understand the org OS in < 15 minutes.
- Reduced handoff latency: stage-to-stage average lead time down.
- Human gate SLA: pending approvals visible and acted on.

## 7. Open Questions

- Should the OS spec be standardized (YAML/JSON) instead of markdown-only?
- How do we authenticate agents (service accounts vs GitHub App acting as bot)?
