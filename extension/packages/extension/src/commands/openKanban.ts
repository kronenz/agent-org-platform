import * as vscode from 'vscode';
import { Services } from '../services';
import { createWebviewPanel } from '../views/WebviewPanelFactory';

export async function openKanban(
  context: vscode.ExtensionContext,
  services: Services
) {
  try {
    const { panel, broker } = createWebviewPanel(context, 'kanban', 'GitHub Kanban', services);
    
    panel.webview.onDidReceiveMessage(
      async (message: any) => {
        if (message.type === 'webview-ready') {
          const workItems = await services.githubService.getWorkItems();
          broker.send(panel, {
            type: 'work-items',
            data: workItems
          });
        }
      }
    );
    
    vscode.window.showInformationMessage('GitHub Kanban opened');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open GitHub Kanban: ${error}`);
  }
}
