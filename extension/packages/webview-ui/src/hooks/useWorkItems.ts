import { useState, useEffect } from 'react';
import { postMessage } from './useVsCodeApi';

export type PipelineStage = 'management' | 'research' | 'implementation' | 'quality';
export type WorkItemType = 'issue' | 'pr';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export interface WorkItem {
  id: number;
  number: number;
  title: string;
  description?: string;
  type: WorkItemType;
  stage: PipelineStage;
  priority?: Priority;
  assignee?: string;
  labels: string[];
  needHuman: boolean;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  stageEnteredAt?: string;
}

const SAMPLE_ITEMS: WorkItem[] = [
  { id: 1, number: 101, title: 'Sprint planning Q1', description: 'Plan the Q1 sprint goals and milestones with the team.', type: 'issue', stage: 'management', priority: 'P1', labels: ['planning'], needHuman: false, url: '#', assignee: 'PM-001', createdAt: '2026-02-01T10:00:00Z', stageEnteredAt: '2026-02-01T10:00:00Z' },
  { id: 2, number: 102, title: 'Define API specifications', description: 'Create OpenAPI specs for the new REST endpoints.', type: 'issue', stage: 'research', priority: 'P1', labels: ['design', 'api'], needHuman: false, url: '#', assignee: 'A-RES-001', createdAt: '2026-02-02T09:00:00Z', stageEnteredAt: '2026-02-03T14:00:00Z' },
  { id: 3, number: 103, title: 'Research vector database options', description: 'Compare Pinecone, Weaviate, and Milvus for our use case.', type: 'issue', stage: 'research', priority: 'P2', labels: ['research', 'database'], needHuman: false, url: '#', assignee: 'A-RES-002', createdAt: '2026-02-03T11:00:00Z', stageEnteredAt: '2026-02-04T09:00:00Z' },
  { id: 4, number: 104, title: 'Implement auth flow', description: 'Build OAuth2 authentication with GitHub provider.', type: 'pr', stage: 'implementation', priority: 'P0', labels: ['auth', 'security'], needHuman: true, url: '#', assignee: 'A-BLD-001', createdAt: '2026-02-04T08:00:00Z', stageEnteredAt: '2026-02-05T10:00:00Z' },
  { id: 5, number: 105, title: 'Build knowledge graph indexer', description: 'Parse markdown files and build graph structure.', type: 'pr', stage: 'implementation', priority: 'P1', labels: ['feature', 'core'], needHuman: false, url: '#', assignee: 'A-BLD-002', createdAt: '2026-02-05T14:00:00Z', stageEnteredAt: '2026-02-06T09:00:00Z' },
  { id: 6, number: 106, title: 'Fix graph rendering performance', description: 'Optimize canvas rendering for large graphs.', type: 'pr', stage: 'implementation', priority: 'P2', labels: ['bug', 'performance'], needHuman: false, url: '#', assignee: 'A-BLD-001', createdAt: '2026-02-06T16:00:00Z', stageEnteredAt: '2026-02-07T11:00:00Z' },
  { id: 7, number: 107, title: 'Review security audit results', description: 'Human review required for security findings.', type: 'issue', stage: 'quality', priority: 'P0', labels: ['security', 'need:human'], needHuman: true, url: '#', createdAt: '2026-02-07T09:00:00Z', stageEnteredAt: '2026-02-08T10:00:00Z' },
  { id: 8, number: 108, title: 'Approve production deployment', description: 'Final sign-off needed before production release.', type: 'issue', stage: 'quality', priority: 'P0', labels: ['deploy', 'need:human'], needHuman: true, url: '#', createdAt: '2026-02-07T15:00:00Z', stageEnteredAt: '2026-02-08T14:00:00Z' },
  { id: 9, number: 109, title: 'Integration test coverage', description: 'Increase test coverage to 80% for core modules.', type: 'issue', stage: 'quality', priority: 'P2', labels: ['testing'], needHuman: false, url: '#', assignee: 'A-QA-001', createdAt: '2026-02-08T10:00:00Z', stageEnteredAt: '2026-02-08T16:00:00Z' },
];

export function useWorkItems() {
  const [items, setItems] = useState<WorkItem[]>(SAMPLE_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let receivedData = false;
    
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'workItems') {
        receivedData = true;
        setItems(message.items);
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

  return { items, loading, error };
}
