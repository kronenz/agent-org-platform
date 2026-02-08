import * as vscode from 'vscode';
import { QueueItem, Priority } from '@agent-org/core';
import { QueueTreeItem } from './TreeItems';
import type { IndexService } from '../services/IndexService';

export class QueueTreeProvider implements vscode.TreeDataProvider<QueueTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<QueueTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private queueItems: QueueItem[] = [];

  constructor(private indexService: IndexService) {
    this.buildQueue();
  }

  refresh(): void {
    this.buildQueue();
    this._onDidChangeTreeData.fire();
  }

  private async buildQueue(): Promise<void> {
    const artifacts = await this.indexService.getArtifacts();
    this.queueItems = [];
    
    let id = 1;
    for (const artifact of artifacts) {
      const fm = artifact.frontmatter;
      
      const needHuman = fm.need_human === true || 
                        fm.need_human === 'true' ||
                        fm.needHuman === true ||
                        fm.needHuman === 'true';
      
      if (needHuman) {
        const priority = this.extractPriority(fm);
        const stage = this.extractStage(artifact.path, fm);
        
        this.queueItems.push({
          id: id++,
          title: artifact.title,
          type: this.extractType(fm),
          priority,
          stage,
          waitTime: this.calculateWaitTime(fm),
          requestedBy: fm.requested_by as string || fm.requestedBy as string || 'unknown',
          linkedArtifact: {
            path: artifact.path,
            title: artifact.title,
          },
        });
      }
    }
  }

  private extractPriority(fm: Record<string, unknown>): Priority {
    const priority = fm.priority as string;
    if (priority === 'p0' || priority === 'high' || priority === 'critical') return 'p0';
    if (priority === 'p1' || priority === 'medium') return 'p1';
    return 'p2';
  }

  private extractStage(path: string, fm: Record<string, unknown>): string {
    if (fm.pipeline_stage) return fm.pipeline_stage as string;
    if (fm.stage) return fm.stage as string;
    
    if (path.includes('/teams/management')) return 'Management';
    if (path.includes('/teams/research')) return 'Research';
    if (path.includes('/teams/implementation')) return 'Implementation';
    if (path.includes('/teams/quality')) return 'Quality';
    
    return 'Unknown';
  }

  private extractType(fm: Record<string, unknown>): 'approval' | 'review' | 'decision' {
    const type = fm.queue_type as string || fm.type as string;
    if (type === 'approval') return 'approval';
    if (type === 'review') return 'review';
    if (type === 'decision') return 'decision';
    return 'decision';
  }

  private calculateWaitTime(fm: Record<string, unknown>): string {
    const created = fm.created as string || fm.created_at as string;
    if (!created) return 'Unknown';
    
    try {
      const createdDate = new Date(created);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 24) {
        const days = Math.floor(diffHours / 24);
        return `${days}d ${diffHours % 24}h`;
      }
      return `${diffHours}h ${diffMinutes}m`;
    } catch {
      return 'Unknown';
    }
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
