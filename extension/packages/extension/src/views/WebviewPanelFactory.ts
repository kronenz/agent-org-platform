import * as vscode from 'vscode';
import { getWebviewContent } from './getWebviewContent';
import { WebviewBroker } from '../utils/WebviewBroker';
import { handleWebviewMessage } from './webviewMessageHandler';
import type { Services } from '../services';

export type ViewType = 'graph' | 'kanban';

export interface WebviewPanelResult {
  panel: vscode.WebviewPanel;
  broker: WebviewBroker;
}

export function createWebviewPanel(
  context: vscode.ExtensionContext,
  viewType: ViewType,
  title: string,
  services: Services
): WebviewPanelResult {
  const panel = vscode.window.createWebviewPanel(
    `agentOrg.${viewType}`,
    title,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'webview-dist'),
      ],
    }
  );
  
  panel.webview.html = getWebviewContent(
    panel.webview,
    context.extensionUri,
    viewType
  );
  
  const broker = new WebviewBroker();
  
  broker.onMessage(panel, async (message) => {
    await handleWebviewMessage(
      message,
      services,
      (response) => broker.send(panel, response)
    );
  });
  
  panel.onDidDispose(() => {
    broker.dispose();
  });
  
  return { panel, broker };
}
