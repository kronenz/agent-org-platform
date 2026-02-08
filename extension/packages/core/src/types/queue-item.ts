import type { Priority, PipelineStage } from './work-item.js';

export type QueueItemType = 'approval' | 'review' | 'decision';

export interface QueueItem {
  id: number;
  title: string;
  type: QueueItemType;
  priority: Priority;
  stage: PipelineStage;
  waitTime: string;
  requestedBy: string;
  linkedIssue?: { number: string; title: string; url: string };
  linkedPR?: { number: string; title: string; url: string };
  linkedArtifact?: { path: string; title: string };
}

export type { Priority, PipelineStage };
