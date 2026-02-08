import * as vscode from 'vscode';
import { createServices } from './services';
import { createWebviewPanel } from './views/WebviewPanelFactory';
import { DocumentsTreeProvider } from './providers/DocumentsTreeProvider';
import { QueueTreeProvider } from './providers/QueueTreeProvider';

export async function activate(context: vscode.ExtensionContext) {
  console.log('Agent Org Platform extension activated');

  const services = createServices(context);

  await services.indexService.index();

  const documentsProvider = new DocumentsTreeProvider(services.indexService);
  const queueProvider = new QueueTreeProvider(services.indexService);

  vscode.window.registerTreeDataProvider('agent-org.documentsView', documentsProvider);
  vscode.window.registerTreeDataProvider('agent-org.queueView', queueProvider);

  const openGraph = vscode.commands.registerCommand('agentOrg.openGraph', () => {
    console.log('[Agent Org] Opening Knowledge Graph...');
    createWebviewPanel(context, 'graph', 'Knowledge Graph', services);
  });

  const openKanban = vscode.commands.registerCommand('agentOrg.openKanban', () => {
    console.log('[Agent Org] Opening Ops Dashboard...');
    createWebviewPanel(context, 'kanban', 'Pipeline Kanban', services);
  });

  const reindex = vscode.commands.registerCommand('agentOrg.reindex', async () => {
    await services.indexService.index();
    documentsProvider.refresh();
    queueProvider.refresh();
    vscode.window.showInformationMessage('Vault reindexed');
  });

  const syncGitHub = vscode.commands.registerCommand('agentOrg.syncGitHub', () => {
    vscode.window.showInformationMessage('GitHub sync coming soon');
  });

  const refreshData = vscode.commands.registerCommand('agent-org.refreshData', async () => {
    await services.indexService.index();
    documentsProvider.refresh();
    queueProvider.refresh();
    vscode.window.showInformationMessage('Data refreshed');
  });

  context.subscriptions.push(openGraph, openKanban, reindex, syncGitHub, refreshData);
}

export function deactivate() {
  console.log('Agent Org Platform extension deactivated');
}
