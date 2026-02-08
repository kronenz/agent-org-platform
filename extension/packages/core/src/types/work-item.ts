/**
 * Pipeline stages for operational workflow
 */
export type PipelineStage = 'management' | 'research' | 'implementation' | 'quality';

/**
 * Type of work item from GitHub
 */
export type WorkItemType = 'issue' | 'pr';

/**
 * Priority levels
 */
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

/**
 * Represents a GitHub issue or PR mapped to pipeline stage
 */
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
