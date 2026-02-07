import { WebviewMessage, ExtensionMessage, GraphData } from '@agent-org/core';
import type { Services } from '../services';

const SAMPLE_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'org-structure', label: 'Organization Structure', type: 'moc', status: 'published', domain: 'Meta' },
    { id: 'roles', label: 'Roles', type: 'concept', status: 'published', domain: 'Meta' },
    { id: 'pipelines', label: 'Pipelines', type: 'concept', status: 'published', domain: 'Meta' },
    { id: 'management', label: 'Management Team', type: 'moc', status: 'published', domain: 'Teams' },
    { id: 'research', label: 'Research Team', type: 'moc', status: 'published', domain: 'Teams' },
    { id: 'implementation', label: 'Implementation Team', type: 'moc', status: 'published', domain: 'Teams' },
    { id: 'quality', label: 'Quality Team', type: 'moc', status: 'published', domain: 'Teams' },
    { id: 'agent-org-platform', label: 'Agent Org Platform', type: 'project', status: 'review', domain: 'Projects' },
    { id: 'ai-agent', label: 'AI Agent', type: 'concept', status: 'published', domain: 'Knowledge' },
    { id: 'knowledge-graph', label: 'Knowledge Graph', type: 'concept', status: 'published', domain: 'Knowledge' },
  ],
  edges: [
    { source: 'org-structure', target: 'roles', type: 'wikilink' },
    { source: 'org-structure', target: 'pipelines', type: 'wikilink' },
    { source: 'org-structure', target: 'management', type: 'wikilink' },
    { source: 'org-structure', target: 'research', type: 'wikilink' },
    { source: 'org-structure', target: 'implementation', type: 'wikilink' },
    { source: 'org-structure', target: 'quality', type: 'wikilink' },
    { source: 'management', target: 'pipelines', type: 'related' },
    { source: 'research', target: 'pipelines', type: 'related' },
    { source: 'agent-org-platform', target: 'org-structure', type: 'parent' },
    { source: 'ai-agent', target: 'roles', type: 'wikilink' },
    { source: 'knowledge-graph', target: 'ai-agent', type: 'related' },
  ],
};

export async function handleWebviewMessage(
  message: WebviewMessage,
  services: Services,
  sendResponse: (msg: ExtensionMessage) => void
): Promise<void> {
  switch (message.type) {
    case 'ready': {
      sendResponse({
        type: 'graphData',
        data: SAMPLE_GRAPH_DATA,
      });
      break;
    }
    
    case 'nodeClick': {
      console.log(`Node clicked: ${message.nodeId}`);
      break;
    }
    
    case 'cardClick': {
      console.log(`Card clicked: ${message.itemId}`);
      break;
    }
    
    case 'filterChange': {
      console.log('Filters changed:', message.filters);
      break;
    }
    
    case 'search': {
      console.log(`Search query: ${message.query}`);
      
      const results = await services.indexService.search(message.query);
      
      sendResponse({
        type: 'searchResults',
        results,
      });
      break;
    }
    
    default: {
      const _exhaustive: never = message;
      console.warn('Unknown message type:', _exhaustive);
    }
  }
}
