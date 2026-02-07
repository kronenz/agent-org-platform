import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

console.log('[Webview] main.tsx executing...');

const rootEl = document.getElementById('root');
if (rootEl) {
  console.log('[Webview] Found root element, mounting React...');
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('[Webview] React mounted successfully');
  } catch (err) {
    console.error('[Webview] React mount error:', err);
    rootEl.innerHTML = `<div style="color:red;padding:20px;">React Error: ${err}</div>`;
  }
} else {
  console.error('[Webview] Root element not found!');
}
