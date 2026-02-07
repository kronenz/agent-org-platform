import { useState, useEffect } from 'react';
import { postMessage } from './useVsCodeApi';

export interface GraphNode {
  id: string;
  label: string;
  type?: 'moc' | 'concept' | 'project' | 'resource';
  status?: 'draft' | 'review' | 'published';
  domain?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'parent' | 'related' | 'wikilink';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const SAMPLE_DATA: GraphData = {
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
    { id: 'agent-registry', label: 'Agent Registry', type: 'moc', status: 'published', domain: 'Agents' },
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
    { source: 'implementation', target: 'pipelines', type: 'related' },
    { source: 'quality', target: 'pipelines', type: 'related' },
    { source: 'agent-org-platform', target: 'org-structure', type: 'parent' },
    { source: 'ai-agent', target: 'roles', type: 'wikilink' },
    { source: 'knowledge-graph', target: 'ai-agent', type: 'related' },
    { source: 'agent-registry', target: 'roles', type: 'related' },
  ],
};

export function useGraphData() {
  const [data, setData] = useState<GraphData>(SAMPLE_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('[useGraphData] Current state - loading:', loading, 'nodes:', data.nodes.length);

  useEffect(() => {
    console.log('[useGraphData] Effect running, sending ready message');
    
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      console.log('[useGraphData] Received message:', message.type, message);
      
      if (message.type === 'graphData') {
        console.log('[useGraphData] Setting graph data, nodes:', message.data?.nodes?.length);
        setData(message.data);
        setLoading(false);
      } else if (message.type === 'error') {
        setError(message.message);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    postMessage({ type: 'ready' });

    const timeout = setTimeout(() => {
      console.log('[useGraphData] Timeout reached, setting loading=false');
      setLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  return { data, loading, error };
}
