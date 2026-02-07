# Agent Org Platform

This folder is a seed for a separate repository.

Goal: build a platform that lets humans and AI agents co-run an "AI-agent-native" organization.
It visualizes:

1) Knowledge graphs (markdown vault + relationships)
2) Operational graphs (pipeline stage, handoffs, approvals)
3) GitHub-native progress dashboards (Issues + Projects v2)

This folder contains:

- `01-vision/`: product vision and PRD
- `02-architecture/`: system architecture + data model + GitHub integration
- `03-mvp/`: MVP scope and user flows
- `04-operations/`: how the platform maps to a repo's operating system (like TeamKnowledge)
- `05-backlog/`: epics and initial backlog
- `reference/`: copies of the source repo docs this project references

## Why this exists

The TeamKnowledge repository already operates as a pipeline-driven AI-native knowledge vault:

- A strict 4-team pipeline: Management -> Research -> Implementation -> Quality
- A structured knowledge base under `vault/` with frontmatter and wikilinks
- Clear handoff rules and lifecycle states (draft/review/published)

The platform we are designing here should let a team:

- See the whole system as a graph (docs, dependencies, handoffs)
- Track progress in GitHub (issues/projects/prs)
- Surface "need:human" decisions and approvals
- Keep agents accountable via audit logs

## MVP: what we ship first

- Repo ingest (GitHub App install)
- Markdown graph builder (frontmatter + wikilinks)
- GitHub Issues/Projects v2 dashboard (kanban + filters)
- A single "Need Human" queue view

## Next steps

Start with `01-vision/prd.md`.
