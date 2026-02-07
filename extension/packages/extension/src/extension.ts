import * as vscode from 'vscode';
import { createServices } from './services';
import { createWebviewPanel } from './views/WebviewPanelFactory';

export function activate(context: vscode.ExtensionContext) {
  console.log('Agent Org Platform extension activated');

  const services = createServices(context);

  // Command IDs must match package.json "contributes.commands"
  const openGraph = vscode.commands.registerCommand('agentOrg.openGraph', () => {
    console.log('[Agent Org] Opening Knowledge Graph...');
    createWebviewPanel(context, 'graph', 'Knowledge Graph', services);
  });

  const openKanban = vscode.commands.registerCommand('agentOrg.openKanban', () => {
    console.log('[Agent Org] Opening Ops Dashboard...');
    createWebviewPanel(context, 'kanban', 'Pipeline Kanban', services);
  });

  const search = vscode.commands.registerCommand('agentOrg.search', () => {
    vscode.window.showQuickPick(['Search coming soon...'], { placeHolder: 'Search documents' });
  });

  const reindex = vscode.commands.registerCommand('agentOrg.reindex', async () => {
    await services.indexService.index();
    vscode.window.showInformationMessage('Vault reindexed');
  });

  const syncGitHub = vscode.commands.registerCommand('agentOrg.syncGitHub', () => {
    vscode.window.showInformationMessage('GitHub sync coming soon');
  });

  context.subscriptions.push(openGraph, openKanban, search, reindex, syncGitHub);
}

export function deactivate() {
  console.log('Agent Org Platform extension deactivated');
}
