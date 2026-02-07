import * as vscode from 'vscode';

export interface StatusBarItems {
  repoItem: vscode.StatusBarItem;
  syncItem: vscode.StatusBarItem;
  updateSyncStatus: (status: 'idle' | 'syncing' | 'error', lastSync?: Date) => void;
  dispose: () => void;
}

export function createStatusBarItems(context: vscode.ExtensionContext): StatusBarItems {
  // Repo status bar item (left side)
  const repoItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  repoItem.command = 'workbench.action.openSettings';
  repoItem.tooltip = 'Click to configure repository';
  
  // Get configured repo from settings
  const config = vscode.workspace.getConfiguration('agentOrg');
  const repoName = config.get<string>('repository') || 'No repo configured';
  repoItem.text = `$(repo) ${repoName}`;
  repoItem.show();
  
  // Sync status bar item (left side, next to repo)
  const syncItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  syncItem.command = 'agentOrg.syncGitHub';
  syncItem.tooltip = 'Click to sync with GitHub';
  syncItem.text = '$(sync) Never synced';
  syncItem.show();
  
  // Store last sync time in global state
  const lastSyncTime = context.globalState.get<string>('lastSyncTime');
  if (lastSyncTime) {
    const lastSync = new Date(lastSyncTime);
    syncItem.text = `$(sync) ${formatSyncTime(lastSync)}`;
  }
  
  const updateSyncStatus = (status: 'idle' | 'syncing' | 'error', lastSync?: Date) => {
    switch (status) {
      case 'syncing':
        syncItem.text = '$(sync~spin) Syncing...';
        syncItem.tooltip = 'Syncing with GitHub...';
        break;
      case 'error':
        syncItem.text = '$(error) Sync failed';
        syncItem.tooltip = 'Failed to sync with GitHub. Click to retry.';
        break;
      case 'idle':
        if (lastSync) {
          context.globalState.update('lastSyncTime', lastSync.toISOString());
          syncItem.text = `$(sync) ${formatSyncTime(lastSync)}`;
          syncItem.tooltip = `Last synced: ${lastSync.toLocaleString()}. Click to sync again.`;
        } else {
          syncItem.text = '$(sync) Never synced';
          syncItem.tooltip = 'Click to sync with GitHub';
        }
        break;
    }
  };
  
  const dispose = () => {
    repoItem.dispose();
    syncItem.dispose();
  };
  
  context.subscriptions.push(repoItem, syncItem);
  
  return {
    repoItem,
    syncItem,
    updateSyncStatus,
    dispose
  };
}

function formatSyncTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffMins / 1440);
    return `${days}d ago`;
  }
}
