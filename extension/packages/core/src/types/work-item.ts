/**
 * Pipeline stages for operational workflow
 */
export type PipelineStage = 'management' | 'research' | 'implementation' | 'quality';

/**
 * Type of work item from GitHub
 */
export type WorkItemType = 'issue' | 'pr';

/**
 * Represents a GitHub issue or PR mapped to pipeline stage
 */
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
