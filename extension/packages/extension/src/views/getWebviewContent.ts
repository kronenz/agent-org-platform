import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  viewType: 'graph' | 'kanban'
): string {
  const webviewDistPath = path.join(extensionUri.fsPath, 'webview-dist', 'assets');
  
  let scriptContent = '';
  let styleContent = '';
  
  try {
    scriptContent = fs.readFileSync(path.join(webviewDistPath, 'index.js'), 'utf8');
    styleContent = fs.readFileSync(path.join(webviewDistPath, 'index.css'), 'utf8');
  } catch (err) {
    console.error('[Agent Org] Failed to read webview assets:', err);
    return `<!DOCTYPE html>
<html><body style="background:#1a1a2e;color:#fff;padding:20px;">
<h1 style="color:#f87171;">Error loading webview assets</h1>
<pre>${err}</pre>
<p>Extension path: ${extensionUri.fsPath}</p>
<p>Assets path: ${webviewDistPath}</p>
</body></html>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline' 'unsafe-eval'; img-src data: blob:;">
  <title>${viewType === 'graph' ? 'Knowledge Graph' : 'GitHub Kanban'}</title>
  <style>${styleContent}</style>
</head>
<body>
  <div id="root" data-view-type="${viewType}"></div>
  <script>${scriptContent}</script>
</body>
</html>`;
}
