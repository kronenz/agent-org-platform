import { useState, useEffect } from 'react';
import { postMessage } from './useVsCodeApi';

export type NodeType = 
  | 'moc' 
  | 'concept' 
  | 'project' 
  | 'resource'
  | 'team'
  | 'agent'
  | 'index'
  | 'registry';

export type NodeStatus = 'draft' | 'review' | 'published' | 'active' | 'inactive';

export type PipelineStage = 'management' | 'research' | 'implementation' | 'quality';

export type EdgeType = 
  | 'parent' 
  | 'related' 
  | 'mentions' 
  | 'moc_contains' 
  | 'wikilink'
  | 'contains'
  | 'member_of'
  | 'supervised_by'
  | 'owns'
  | 'pipeline_next'
  | 'pipeline_prev';

export interface GraphNode {
  id: string;
  label: string;
  type?: NodeType;
  status?: NodeStatus;
  domain?: string;
  path?: string;
  
  indexNumber?: string;
  division?: string;
  pipelineStage?: PipelineStage;
  
  agentId?: string;
  capabilities?: string[];
  supervisedBy?: string;
  
  teamId?: string;
  members?: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const SAMPLE_DATA: GraphData = {
  nodes: [
    { id: 'org-structure', label: 'Organization Structure', type: 'index', status: 'published', domain: 'Meta' },
    { id: 'roles', label: 'Roles', type: 'concept', status: 'published', domain: 'Meta' },
    { id: 'pipelines', label: 'Pipelines', type: 'concept', status: 'published', domain: 'Meta' },
    { id: 'management', label: 'Management Team', type: 'team', status: 'active', domain: 'Teams', pipelineStage: 'management', indexNumber: '1.1' },
    { id: 'research', label: 'Research Team', type: 'team', status: 'active', domain: 'Teams', pipelineStage: 'research', indexNumber: '2.1', members: ['A-RES-001', 'A-RES-002'] },
    { id: 'implementation', label: 'Implementation Team', type: 'team', status: 'active', domain: 'Teams', pipelineStage: 'implementation', indexNumber: '2.2', members: ['A-BLD-001', 'A-BLD-002', 'A-BLD-003'] },
    { id: 'quality', label: 'Quality Team', type: 'team', status: 'active', domain: 'Teams', pipelineStage: 'quality', indexNumber: '2.3', members: ['A-QA-001', 'A-QA-002'] },
    { id: 'agent-org-platform', label: 'Agent Org Platform', type: 'project', status: 'review', domain: 'Projects' },
    { id: 'ai-agent', label: 'AI Agent', type: 'concept', status: 'published', domain: 'Knowledge' },
    { id: 'knowledge-graph', label: 'Knowledge Graph', type: 'concept', status: 'published', domain: 'Knowledge' },
    { id: 'agent-registry', label: 'Agent Registry', type: 'registry', status: 'published', domain: 'Agents' },
    { id: 'member:a-bld-001', label: 'A-BLD-001', type: 'agent', status: 'active', agentId: 'A-BLD-001', teamId: 'implementation', capabilities: ['Code generation', 'Refactoring'] },
    { id: 'member:a-bld-002', label: 'A-BLD-002', type: 'agent', status: 'active', agentId: 'A-BLD-002', teamId: 'implementation', capabilities: ['Documentation'] },
  ],
  edges: [
    { source: 'org-structure', target: 'roles', type: 'wikilink' },
    { source: 'org-structure', target: 'pipelines', type: 'wikilink' },
    { source: 'org-structure', target: 'management', type: 'contains' },
    { source: 'org-structure', target: 'research', type: 'contains' },
    { source: 'org-structure', target: 'implementation', type: 'contains' },
    { source: 'org-structure', target: 'quality', type: 'contains' },
    { source: 'management', target: 'research', type: 'pipeline_next' },
    { source: 'research', target: 'implementation', type: 'pipeline_next' },
    { source: 'implementation', target: 'quality', type: 'pipeline_next' },
    { source: 'agent-org-platform', target: 'org-structure', type: 'parent' },
    { source: 'member:a-bld-001', target: 'implementation', type: 'member_of' },
    { source: 'member:a-bld-002', target: 'implementation', type: 'member_of' },
    { source: 'knowledge-graph', target: 'ai-agent', type: 'related' },
    { source: 'agent-registry', target: 'roles', type: 'related' },
  ],
};

export function useGraphData() {
  const [data, setData] = useState<GraphData>(SAMPLE_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let receivedData = false;
    
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      
      if (message.type === 'graphData') {
        receivedData = true;
        setData(message.data);
        setLoading(false);
        setError(null);
      } else if (message.type === 'error') {
        setError(message.message);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    postMessage({ type: 'ready' });

    const timeout = setTimeout(() => {
      if (!receivedData) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  return { data, loading, error };
}
