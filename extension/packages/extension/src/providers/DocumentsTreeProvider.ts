import * as vscode from 'vscode';
import { DocumentTreeItem } from './TreeItems';
import type { IndexService } from '../services/IndexService';

interface DocumentNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children: Map<string, DocumentNode>;
}

export class DocumentsTreeProvider implements vscode.TreeDataProvider<DocumentTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<DocumentTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private rootNode: DocumentNode | null = null;

  constructor(private indexService: IndexService) {
    this.buildTree();
  }

  refresh(): void {
    this.buildTree();
    this._onDidChangeTreeData.fire();
  }

  private async buildTree(): Promise<void> {
    const artifacts = await this.indexService.getArtifacts();
    
    this.rootNode = {
      name: 'root',
      path: '',
      isDirectory: true,
      children: new Map(),
    };

    for (const artifact of artifacts) {
      const parts = artifact.path.split('/');
      let current = this.rootNode;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        if (!current.children.has(part)) {
          current.children.set(part, {
            name: part,
            path: currentPath,
            isDirectory: !isLast,
            children: new Map(),
          });
        }

        current = current.children.get(part)!;
      }
    }
  }

  getTreeItem(element: DocumentTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DocumentTreeItem): Thenable<DocumentTreeItem[]> {
    if (!this.rootNode) {
      return Promise.resolve([]);
    }

    if (!element) {
      return Promise.resolve(this.buildTreeItems(this.rootNode.children));
    }

    const node = this.findNode(element.filePath);
    if (node) {
      return Promise.resolve(this.buildTreeItems(node.children));
    }

    return Promise.resolve([]);
  }

  private buildTreeItems(children: Map<string, DocumentNode>): DocumentTreeItem[] {
    const items: DocumentTreeItem[] = [];
    
    const sorted = Array.from(children.values()).sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const node of sorted) {
      const collapsibleState = node.isDirectory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;

      items.push(new DocumentTreeItem(
        node.name,
        node.isDirectory,
        node.path,
        collapsibleState
      ));
    }

    return items;
  }

  private findNode(path: string): DocumentNode | undefined {
    if (!this.rootNode) return undefined;
    
    const parts = path.split('/');
    let current = this.rootNode;

    for (const part of parts) {
      const child = current.children.get(part);
      if (!child) return undefined;
      current = child;
    }

    return current;
  }
}
