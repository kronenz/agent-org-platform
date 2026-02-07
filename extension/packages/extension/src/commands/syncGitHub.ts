import * as vscode from 'vscode';
import { Services } from '../services';
import { StatusBarItems } from '../views/StatusBar';

let statusBarItems: StatusBarItems | undefined;

export function setStatusBarItems(items: StatusBarItems) {
  statusBarItems = items;
}

export async function syncGitHub(
  context: vscode.ExtensionContext,
  services: Services
) {
  if (statusBarItems) {
    statusBarItems.updateSyncStatus('syncing');
  }
  
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Syncing with GitHub...',
      cancellable: false
    },
    async (progress: any) => {
      try {
        progress.report({ increment: 0, message: 'Authenticating...' });
        
        const authenticated = await services.githubService.authenticate();
        
        if (!authenticated) {
          vscode.window.showWarningMessage(
            'GitHub authentication required. Please configure your GitHub token in settings.'
          );
          if (statusBarItems) {
            statusBarItems.updateSyncStatus('error');
          }
          return;
        }
        
        progress.report({ increment: 30, message: 'Fetching work items...' });
        
        await services.githubService.getWorkItems();
        
        progress.report({ increment: 60, message: 'Fetching queue items...' });
        
        await services.githubService.getQueueItems();
        
        progress.report({ increment: 100, message: 'Complete' });
        
        const syncTime = new Date();
        if (statusBarItems) {
          statusBarItems.updateSyncStatus('idle', syncTime);
        }
        
        vscode.commands.executeCommand('agentOrg.refreshQueue');
        
        vscode.window.showInformationMessage('GitHub sync complete');
      } catch (error) {
        if (statusBarItems) {
          statusBarItems.updateSyncStatus('error');
        }
        vscode.window.showErrorMessage(`GitHub sync failed: ${error}`);
      }
    }
  );
}
