import * as vscode from 'vscode';
import { DocumentTreeItem } from './TreeItems';

interface DocumentNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: DocumentNode[];
}

const SAMPLE_ORG_DATA: DocumentNode = {
  name: 'org',
  path: 'org',
  isDirectory: true,
  children: [
    {
      name: '_meta',
      path: 'org/_meta',
      isDirectory: true,
      children: [
        { name: 'org-structure.md', path: 'org/_meta/org-structure.md', isDirectory: false },
        { name: 'roles.md', path: 'org/_meta/roles.md', isDirectory: false },
        { name: 'pipelines.md', path: 'org/_meta/pipelines.md', isDirectory: false }
      ]
    },
    {
      name: 'teams',
      path: 'org/teams',
      isDirectory: true,
      children: [
        { name: 'management', path: 'org/teams/management', isDirectory: true, children: [
          { name: 'README.md', path: 'org/teams/management/README.md', isDirectory: false }
        ]},
        { name: 'research', path: 'org/teams/research', isDirectory: true, children: [
          { name: 'README.md', path: 'org/teams/research/README.md', isDirectory: false }
        ]},
        { name: 'implementation', path: 'org/teams/implementation', isDirectory: true, children: [
          { name: 'README.md', path: 'org/teams/implementation/README.md', isDirectory: false }
        ]},
        { name: 'quality', path: 'org/teams/quality', isDirectory: true, children: [
          { name: 'README.md', path: 'org/teams/quality/README.md', isDirectory: false }
        ]}
      ]
    },
    {
      name: 'projects',
      path: 'org/projects',
      isDirectory: true,
      children: [
        { name: 'agent-org-platform', path: 'org/projects/agent-org-platform', isDirectory: true, children: [
          { name: 'README.md', path: 'org/projects/agent-org-platform/README.md', isDirectory: false }
        ]}
      ]
    },
    {
      name: 'knowledge',
      path: 'org/knowledge',
      isDirectory: true,
      children: [
        { name: 'concepts', path: 'org/knowledge/concepts', isDirectory: true, children: [
          { name: 'ai-agent.md', path: 'org/knowledge/concepts/ai-agent.md', isDirectory: false },
          { name: 'knowledge-graph.md', path: 'org/knowledge/concepts/knowledge-graph.md', isDirectory: false }
        ]}
      ]
    },
    {
      name: 'agents',
      path: 'org/agents',
      isDirectory: true,
      children: [
        { name: '_registry.md', path: 'org/agents/_registry.md', isDirectory: false }
      ]
    }
  ]
};

export class DocumentsTreeProvider implements vscode.TreeDataProvider<DocumentTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<DocumentTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private rootNode: DocumentNode = SAMPLE_ORG_DATA;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DocumentTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DocumentTreeItem): Thenable<DocumentTreeItem[]> {
    if (!element) {
      return Promise.resolve(this.buildTreeItems(this.rootNode.children || []));
    }

    const node = this.findNode(element.filePath);
    if (node && node.children) {
      return Promise.resolve(this.buildTreeItems(node.children));
    }

    return Promise.resolve([]);
  }

  private buildTreeItems(nodes: DocumentNode[]): DocumentTreeItem[] {
    return nodes.map(node => {
      const collapsibleState = node.isDirectory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;

      return new DocumentTreeItem(
        node.name,
        node.isDirectory,
        node.path,
        collapsibleState
      );
    });
  }

  private findNode(path: string, node: DocumentNode = this.rootNode): DocumentNode | undefined {
    if (node.path === path) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.findNode(path, child);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }
}
