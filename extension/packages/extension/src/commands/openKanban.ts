import * as vscode from 'vscode';
import { Services } from '../services';
import { createWebviewPanel } from '../views/WebviewPanelFactory';

export async function openKanban(
  context: vscode.ExtensionContext,
  services: Services
) {
  try {
    createWebviewPanel(context, 'kanban', 'Pipeline Kanban', services);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open Pipeline Kanban: ${error}`);
  }
}
