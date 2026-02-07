import * as vscode from 'vscode';
import { Services } from '../services';
import { createWebviewPanel } from '../views/WebviewPanelFactory';

export async function openGraph(
  context: vscode.ExtensionContext,
  services: Services
) {
  try {
    const { panel, broker } = createWebviewPanel(context, 'graph', 'Knowledge Graph', services);
    
    panel.webview.onDidReceiveMessage(
      async (message: any) => {
        if (message.type === 'webview-ready') {
          const graphData = await services.indexService.getGraphData();
          broker.send(panel, {
            type: 'graph-data',
            data: graphData
          });
        }
      }
    );
    
    vscode.window.showInformationMessage('Knowledge Graph opened');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open Knowledge Graph: ${error}`);
  }
}
