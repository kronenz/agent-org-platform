import * as vscode from 'vscode';
import { WebviewMessage, ExtensionMessage } from '@agent-org/core';

export type MessageHandler = (message: WebviewMessage) => void | Promise<void>;

export class WebviewBroker {
  private disposables: vscode.Disposable[] = [];
  
  /**
   * Send a typed message from extension to webview
   */
  send(panel: vscode.WebviewPanel, message: ExtensionMessage): void {
    panel.webview.postMessage(message);
  }
  
  /**
   * Listen for typed messages from webview
   */
  onMessage(panel: vscode.WebviewPanel, handler: MessageHandler): vscode.Disposable {
    const disposable = panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => {
        handler(message);
      }
    );
    
    this.disposables.push(disposable);
    return disposable;
  }
  
  /**
   * Clean up all message listeners
   */
  dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }
}
