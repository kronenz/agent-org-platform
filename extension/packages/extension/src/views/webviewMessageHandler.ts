import * as vscode from 'vscode';
import { WebviewMessage, ExtensionMessage } from '@agent-org/core';
import type { Services } from '../services';

export async function handleWebviewMessage(
  message: WebviewMessage,
  services: Services,
  sendResponse: (msg: ExtensionMessage) => void
): Promise<void> {
  switch (message.type) {
    case 'ready': {
      console.log('[Webview] Ready message received, fetching data...');
      
      const graphData = await services.indexService.getGraphData();
      console.log(`[Webview] Sending graph: ${graphData.nodes.length} nodes, ${graphData.edges.length} edges`);
      sendResponse({
        type: 'graphData',
        data: graphData,
      });
      
      const workItems = await services.indexService.getWorkItems();
      console.log(`[Webview] Sending workItems: ${workItems.length} items`);
      sendResponse({
        type: 'workItems',
        items: workItems,
      });
      break;
    }
    
    case 'nodeClick': {
      console.log(`[Webview] Node clicked: ${message.nodeId}`);
      break;
    }
    
    case 'openDocument': {
      console.log(`[Webview] Opening document: ${message.path}`);
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders && workspaceFolders.length > 0) {
        const filePath = vscode.Uri.joinPath(workspaceFolders[0].uri, message.path);
        try {
          const document = await vscode.workspace.openTextDocument(filePath);
          await vscode.window.showTextDocument(document, {
            viewColumn: vscode.ViewColumn.One,
            preserveFocus: false,
          });
        } catch (err) {
          console.error(`[Webview] Failed to open document: ${err}`);
          vscode.window.showErrorMessage(`Failed to open: ${message.path}`);
        }
      }
      break;
    }
    
    case 'cardClick': {
      console.log(`[Webview] Card clicked: ${message.itemId}`);
      break;
    }
    
    case 'filterChange': {
      console.log('[Webview] Filters changed:', message.filters);
      break;
    }
    
    case 'search': {
      console.log(`[Webview] Search query: ${message.query}`);
      const results = await services.indexService.search(message.query);
      sendResponse({
        type: 'searchResults',
        results,
      });
      break;
    }
    
    default: {
      const _exhaustive: never = message;
      console.warn('[Webview] Unknown message type:', _exhaustive);
    }
  }
}
