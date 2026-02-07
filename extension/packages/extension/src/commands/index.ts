import * as vscode from 'vscode';
import { Services } from '../services';
import { openGraph } from './openGraph';
import { openKanban } from './openKanban';
import { search } from './search';
import { reindex } from './reindex';
import { syncGitHub, setStatusBarItems } from './syncGitHub';
import { StatusBarItems } from '../views/StatusBar';

export function registerCommands(
  context: vscode.ExtensionContext,
  services: Services,
  statusBar?: StatusBarItems
) {
  if (statusBar) {
    setStatusBarItems(statusBar);
  }
  
  context.subscriptions.push(
    vscode.commands.registerCommand('agentOrg.openGraph', () => openGraph(context, services)),
    vscode.commands.registerCommand('agentOrg.openKanban', () => openKanban(context, services)),
    vscode.commands.registerCommand('agentOrg.search', () => search(context, services)),
    vscode.commands.registerCommand('agentOrg.reindex', () => reindex(context, services)),
    vscode.commands.registerCommand('agentOrg.syncGitHub', () => syncGitHub(context, services))
  );
}
