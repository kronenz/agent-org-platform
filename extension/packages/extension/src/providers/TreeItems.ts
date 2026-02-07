import * as vscode from 'vscode';
import { QueueItem, Priority } from '@agent-org/core';

/**
 * Tree item representing a document or folder in the vault
 */
export class DocumentTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly isDirectory: boolean,
    public readonly filePath: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    
    this.tooltip = filePath;
    this.contextValue = isDirectory ? 'folder' : 'document';
    
    if (!isDirectory) {
      this.command = {
        command: 'agentOrg.openDocument',
        title: 'Open Document',
        arguments: [filePath]
      };
      this.iconPath = new vscode.ThemeIcon('file');
    } else {
      this.iconPath = new vscode.ThemeIcon('folder');
    }
  }
}

/**
 * Tree item representing a queue item requiring human attention
 */
export class QueueTreeItem extends vscode.TreeItem {
  constructor(public readonly queueItem: QueueItem) {
    super(queueItem.title, vscode.TreeItemCollapsibleState.None);
    
    this.description = `${queueItem.waitTime} • ${queueItem.requestedBy}`;
    this.tooltip = this.buildTooltip();
    this.contextValue = 'queueItem';
    this.iconPath = this.getIconForPriority(queueItem.priority);
    
    // Add command to open details
    this.command = {
      command: 'agentOrg.showQueueItemDetails',
      title: 'Show Queue Item Details',
      arguments: [queueItem]
    };
  }
  
  private buildTooltip(): string {
    const { title, type, priority, stage, waitTime, requestedBy, linkedIssue, linkedPR } = this.queueItem;
    
    let tooltip = `${title}\n\n`;
    tooltip += `Type: ${type}\n`;
    tooltip += `Priority: ${priority}\n`;
    tooltip += `Stage: ${stage}\n`;
    tooltip += `Wait Time: ${waitTime}\n`;
    tooltip += `Requested By: ${requestedBy}`;
    
    if (linkedIssue) {
      tooltip += `\n\nLinked Issue: #${linkedIssue.number} - ${linkedIssue.title}`;
    }
    
    if (linkedPR) {
      tooltip += `\n\nLinked PR: #${linkedPR.number} - ${linkedPR.title}`;
    }
    
    return tooltip;
  }
  
  private getIconForPriority(priority: Priority): vscode.ThemeIcon {
    switch (priority) {
      case 'p0':
        return new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'));
      case 'p1':
        return new vscode.ThemeIcon('warning', new vscode.ThemeColor('editorWarning.foreground'));
      case 'p2':
        return new vscode.ThemeIcon('info', new vscode.ThemeColor('editorInfo.foreground'));
      default:
        return new vscode.ThemeIcon('circle-outline');
    }
  }
}
