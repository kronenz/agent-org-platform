import type { GraphData, GraphNode } from './graph.js';
import type { WorkItem } from './work-item.js';
import type { Artifact } from './artifact.js';

/**
 * Messages sent from webview to extension host
 */
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'nodeClick'; nodeId: string }
  | { type: 'openDocument'; path: string }
  | { type: 'cardClick'; itemId: number }
  | { type: 'filterChange'; filters: Record<string, string[]> }
  | { type: 'search'; query: string };

/**
 * Messages sent from extension host to webview
 */
export type ExtensionMessage =
  | { type: 'graphData'; data: GraphData }
  | { type: 'workItems'; items: WorkItem[] }
  | { type: 'updateNode'; node: GraphNode }
  | { type: 'searchResults'; results: Artifact[] };
