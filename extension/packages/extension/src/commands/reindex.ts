import * as vscode from 'vscode';
import { Services } from '../services';

export async function reindex(
  context: vscode.ExtensionContext,
  services: Services
) {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Reindexing vault...',
      cancellable: false
    },
    async (progress: any) => {
      try {
        progress.report({ increment: 0, message: 'Scanning markdown files...' });
        
        await services.indexService.index();
        
        progress.report({ increment: 50, message: 'Building graph...' });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        progress.report({ increment: 100, message: 'Complete' });
        
        vscode.commands.executeCommand('agentOrg.refreshDocuments');
        
        vscode.window.showInformationMessage('Vault reindexing complete');
      } catch (error) {
        vscode.window.showErrorMessage(`Reindexing failed: ${error}`);
      }
    }
  );
}
