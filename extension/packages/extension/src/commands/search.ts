import * as vscode from 'vscode';
import { Services } from '../services';
import { Artifact } from '@agent-org/core';

const SAMPLE_ARTIFACTS: Artifact[] = [
  {
    id: 'org-structure',
    path: 'org/_meta/org-structure.md',
    title: 'Organization Structure',
    frontmatter: { type: 'moc', status: 'published', domain: 'Meta' },
    content: 'AI-에이전트 네이티브 조직의 구조 정의. Teams, Pipeline Flow, Roles 정의...',
    outgoingLinks: ['roles', 'pipelines', 'management', 'research', 'implementation', 'quality']
  },
  {
    id: 'roles',
    path: 'org/_meta/roles.md',
    title: 'Roles',
    frontmatter: { type: 'concept', status: 'published', domain: 'Meta' },
    content: 'Operator, Researcher, Builder, Reviewer, AI Agent 역할 정의...',
    outgoingLinks: ['org-structure', 'pipelines']
  },
  {
    id: 'pipelines',
    path: 'org/_meta/pipelines.md',
    title: 'Pipelines',
    frontmatter: { type: 'concept', status: 'published', domain: 'Meta' },
    content: 'Management → Research → Implementation → Quality 파이프라인 정의...',
    outgoingLinks: ['org-structure', 'roles']
  },
  {
    id: 'ai-agent',
    path: 'org/knowledge/concepts/ai-agent.md',
    title: 'AI Agent',
    frontmatter: { type: 'concept', status: 'published', domain: 'Knowledge' },
    content: '자동화된 기여자로서 조직 내에서 동작하는 AI 시스템. 명시적 경계 내에서 자율적으로 작업...',
    outgoingLinks: ['roles', 'knowledge-graph', 'pipelines']
  },
  {
    id: 'knowledge-graph',
    path: 'org/knowledge/concepts/knowledge-graph.md',
    title: 'Knowledge Graph',
    frontmatter: { type: 'concept', status: 'published', domain: 'Knowledge' },
    content: '조직의 지식을 노드와 엣지로 표현한 그래프 구조. Markdown 문서와 관계를 시각화...',
    outgoingLinks: ['ai-agent', 'agent-org-platform']
  },
  {
    id: 'agent-org-platform',
    path: 'org/projects/agent-org-platform/README.md',
    title: 'Agent Org Platform',
    frontmatter: { type: 'project', status: 'review', domain: 'Projects' },
    content: 'AI-에이전트 네이티브 조직을 위한 VS Code Extension 플랫폼. Knowledge Graph, Pipeline Kanban...',
    outgoingLinks: ['org-structure', 'knowledge-graph', 'ai-agent']
  }
];

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = 'agentOrg.recentSearches';

export async function search(
  context: vscode.ExtensionContext,
  services: Services
) {
  const quickPick = vscode.window.createQuickPick<vscode.QuickPickItem & { artifact?: Artifact }>();
  quickPick.placeholder = 'Search documents...';
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;
  
  const artifacts = await services.indexService.getArtifacts();
  const searchData = artifacts.length > 0 ? artifacts : SAMPLE_ARTIFACTS;
  
  const recentSearches = context.globalState.get<string[]>(RECENT_SEARCHES_KEY, []);
  
  const showRecentSearches = (): void => {
    if (recentSearches.length === 0) {
      quickPick.items = buildQuickPickItems(searchData);
      return;
    }
    
    const recentItems: vscode.QuickPickItem[] = [
      {
        label: '$(history) Recent Searches',
        kind: vscode.QuickPickItemKind.Separator
      },
      ...recentSearches.map(query => ({
        label: `$(search) ${query}`,
        description: 'Recent search',
        alwaysShow: true
      })),
      {
        label: '$(folder) All Documents',
        kind: vscode.QuickPickItemKind.Separator
      },
      ...buildQuickPickItems(searchData)
    ];
    
    quickPick.items = recentItems;
  };
  
  const filterArtifacts = (query: string): void => {
    if (!query.trim()) {
      showRecentSearches();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = searchData.filter(artifact => {
      const titleMatch = artifact.title.toLowerCase().includes(lowerQuery);
      const contentMatch = artifact.content.toLowerCase().includes(lowerQuery);
      const pathMatch = artifact.path.toLowerCase().includes(lowerQuery);
      return titleMatch || contentMatch || pathMatch;
    });
    
    quickPick.items = buildQuickPickItems(filtered);
  };
  
  showRecentSearches();
  
  quickPick.onDidChangeValue((value: string) => {
    filterArtifacts(value);
  });
  
  quickPick.onDidAccept(() => {
    const selected = quickPick.selectedItems[0];
    if (!selected) {
      return;
    }
    
    if (selected.description === 'Recent search') {
      const query = selected.label.replace('$(search) ', '');
      quickPick.value = query;
      filterArtifacts(query);
      return;
    }
    
    const artifact = (selected as any).artifact as Artifact | undefined;
    if (artifact) {
      saveRecentSearch(context, quickPick.value);
      
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, artifact.path);
        vscode.window.showTextDocument(fileUri);
      } else {
        vscode.window.showInformationMessage(`Selected: ${artifact.title} (${artifact.path})`);
      }
      
      quickPick.hide();
    }
  });
  
  quickPick.onDidHide(() => {
    quickPick.dispose();
  });
  
  quickPick.show();
}

function buildQuickPickItems(artifacts: Artifact[]): (vscode.QuickPickItem & { artifact: Artifact })[] {
  return artifacts.map(artifact => {
    const preview = artifact.content.substring(0, 100).replace(/\n/g, ' ');
    const statusIcon = getStatusIcon(artifact.frontmatter.status);
    
    return {
      label: `${statusIcon} ${artifact.title}`,
      description: artifact.path,
      detail: preview + (artifact.content.length > 100 ? '...' : ''),
      artifact
    };
  });
}

function getStatusIcon(status?: string): string {
  switch (status) {
    case 'published':
      return '$(check)';
    case 'review':
      return '$(eye)';
    case 'draft':
      return '$(edit)';
    default:
      return '$(file)';
  }
}

function saveRecentSearch(context: vscode.ExtensionContext, query: string): void {
  if (!query.trim()) {
    return;
  }
  
  const recentSearches = context.globalState.get<string[]>(RECENT_SEARCHES_KEY, []);
  const filtered = recentSearches.filter(q => q !== query);
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  
  context.globalState.update(RECENT_SEARCHES_KEY, updated);
}
