# Agent Org Platform - VS Code Extension

VS Code extension for AI-agent-native organization management.

## Features

- **Knowledge Graph** - Interactive visualization of markdown vault with react-force-graph
- **Pipeline Kanban** - 4-stage board (Management → Research → Implementation → Quality)
- **Documents TreeView** - Browse vault file structure
- **Need Human Queue** - Items requiring human attention
- **GitHub Integration** - Issues, PRs, and Projects v2 sync
- **Global Search** - Quick document search (Cmd+Shift+K)

## Development Setup

### Prerequisites

- Node.js 18+
- VS Code 1.85+

### Install Dependencies

```bash
cd extension
npm install
```

### Build

```bash
npm run build
```

### Run in VS Code Dev Mode

1. Open `extension/packages/extension` in VS Code
2. Press F5 to launch Extension Development Host
3. Extension activates when `vault/*.md` files are detected

## Project Structure

```
extension/
├── packages/
│   ├── extension/     # VS Code extension host
│   │   ├── src/
│   │   │   ├── commands/    # Command implementations
│   │   │   ├── providers/   # TreeView providers
│   │   │   ├── services/    # IndexService, GitHubService, CacheService
│   │   │   └── views/       # Webview infrastructure
│   │   └── package.json     # Extension manifest
│   │
│   ├── webview-ui/    # React webviews
│   │   └── src/
│   │       ├── views/GraphView/   # Knowledge graph
│   │       ├── views/KanbanView/  # Pipeline kanban
│   │       ├── hooks/             # useVsCodeApi, useGraphData
│   │       └── stores/            # Zustand state
│   │
│   ├── core/          # Shared TypeScript types
│   │   └── src/types/ # Artifact, Edge, WorkItem, Messages
│   │
│   └── github/        # GitHub GraphQL client
│       └── src/
│           ├── queries/   # Issues, PRs, Projects v2
│           └── mappers/   # GitHub → WorkItem conversion
```

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| Agent Org: Open Knowledge Graph | Cmd+Shift+G | Open graph visualization |
| Agent Org: Search Documents | Cmd+Shift+K | Quick document search |
| Agent Org: Open Ops Dashboard | - | Open pipeline kanban |
| Agent Org: Reindex Vault | - | Rebuild document index |
| Agent Org: Sync GitHub | - | Fetch latest from GitHub |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Extension                     │
├─────────────────────────────────────────────────────────┤
│  Extension Host                                          │
│  ├── Commands (openGraph, search, syncGitHub...)        │
│  ├── Services (Index, GitHub, Cache)                    │
│  ├── TreeViews (Documents, Queue)                       │
│  └── WebviewPanels (Graph, Kanban)                      │
├─────────────────────────────────────────────────────────┤
│  Webview UI (React)                                      │
│  ├── GraphView (react-force-graph-2d)                   │
│  └── KanbanView (4-column board)                        │
├─────────────────────────────────────────────────────────┤
│  Communication: postMessage ↔ WebviewBroker             │
└─────────────────────────────────────────────────────────┘
```

## License

MIT
