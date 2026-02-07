import * as vscode from 'vscode';
import { QueueItem, QueueItemType, Priority } from '@agent-org/core';
import { QueueTreeItem } from './TreeItems';

const SAMPLE_QUEUE_DATA: QueueItem[] = [
  {
    id: 1,
    title: 'Approve architecture decision: GraphQL vs REST',
    type: 'approval',
    priority: 'p0',
    stage: 'Research',
    waitTime: '2h 15m',
    requestedBy: 'architect-agent',
    linkedIssue: {
      number: '42',
      title: 'Design API layer',
      url: 'https://github.com/org/repo/issues/42'
    }
  },
  {
    id: 2,
    title: 'Review knowledge graph schema changes',
    type: 'review',
    priority: 'p1',
    stage: 'Implementation',
    waitTime: '45m',
    requestedBy: 'implementation-agent',
    linkedPR: {
      number: '128',
      title: 'Add edge type validation',
      url: 'https://github.com/org/repo/pull/128'
    },
    linkedArtifact: {
      path: 'vault/02-architecture/data-model.md',
      title: 'Data Model'
    }
  },
  {
    id: 3,
    title: 'Decide on deployment strategy',
    type: 'decision',
    priority: 'p1',
    stage: 'Management',
    waitTime: '1h 30m',
    requestedBy: 'planning-agent'
  },
  {
    id: 4,
    title: 'Approve budget allocation for cloud resources',
    type: 'approval',
    priority: 'p0',
    stage: 'Management',
    waitTime: '3h 45m',
    requestedBy: 'ops-agent',
    linkedIssue: {
      number: '89',
      title: 'Infrastructure setup',
      url: 'https://github.com/org/repo/issues/89'
    }
  },
  {
    id: 5,
    title: 'Review test coverage report',
    type: 'review',
    priority: 'p2',
    stage: 'Quality',
    waitTime: '20m',
    requestedBy: 'qa-agent',
    linkedPR: {
      number: '145',
      title: 'Add integration tests',
      url: 'https://github.com/org/repo/pull/145'
    }
  }
];

export class QueueTreeProvider implements vscode.TreeDataProvider<QueueTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<QueueTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private queueItems: QueueItem[] = SAMPLE_QUEUE_DATA;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: QueueTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: QueueTreeItem): Thenable<QueueTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    const sortedItems = this.sortByPriority(this.queueItems);
    return Promise.resolve(sortedItems.map(item => new QueueTreeItem(item)));
  }

  private sortByPriority(items: QueueItem[]): QueueItem[] {
    const priorityOrder: Record<Priority, number> = {
      'p0': 0,
      'p1': 1,
      'p2': 2
    };

    return [...items].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.id - b.id;
    });
  }

  getQueueItem(id: number): QueueItem | undefined {
    return this.queueItems.find(item => item.id === id);
  }

  removeQueueItem(id: number): void {
    this.queueItems = this.queueItems.filter(item => item.id !== id);
    this.refresh();
  }
}
