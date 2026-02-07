import { useState, useEffect } from 'react';
import { postMessage } from './useVsCodeApi';

export type PipelineStage = 'management' | 'research' | 'implementation' | 'quality';
export type WorkItemType = 'issue' | 'pr';

export interface WorkItem {
  id: number;
  number: number;
  title: string;
  type: WorkItemType;
  stage: PipelineStage;
  assignee?: string;
  labels: string[];
  needHuman: boolean;
  url: string;
}

const SAMPLE_ITEMS: WorkItem[] = [
  { id: 1, number: 101, title: 'Design system architecture', type: 'issue', stage: 'research', labels: ['design'], needHuman: false, url: '#', assignee: 'alice' },
  { id: 2, number: 102, title: 'Implement auth flow', type: 'pr', stage: 'implementation', labels: ['auth', 'security'], needHuman: true, url: '#', assignee: 'bob' },
  { id: 3, number: 103, title: 'Review security audit', type: 'issue', stage: 'quality', labels: ['security', 'need:human'], needHuman: true, url: '#' },
  { id: 4, number: 104, title: 'Sprint planning Q1', type: 'issue', stage: 'management', labels: ['planning'], needHuman: false, url: '#', assignee: 'charlie' },
  { id: 5, number: 105, title: 'API documentation', type: 'issue', stage: 'research', labels: ['docs'], needHuman: false, url: '#' },
  { id: 6, number: 106, title: 'Fix graph rendering bug', type: 'pr', stage: 'implementation', labels: ['bug', 'ui'], needHuman: false, url: '#', assignee: 'alice' },
  { id: 7, number: 107, title: 'Approve deployment', type: 'issue', stage: 'quality', labels: ['deploy', 'need:human'], needHuman: true, url: '#' },
];

export function useWorkItems() {
  const [items, setItems] = useState<WorkItem[]>(SAMPLE_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'workItems') {
        setItems(message.items);
        setLoading(false);
      } else if (message.type === 'error') {
        setError(message.message);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    postMessage({ type: 'ready' });

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  return { items, loading, error };
}
