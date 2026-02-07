/**
 * Types of items requiring human attention
 */
export type QueueItemType = 'approval' | 'review' | 'decision';

/**
 * Priority levels for queue items
 */
export type Priority = 'p0' | 'p1' | 'p2';

/**
 * Represents an item in the human gate queue
 */
export interface QueueItem {
  id: number;
  title: string;
  type: QueueItemType;
  priority: Priority;
  stage: string;
  waitTime: string;
  requestedBy: string;
  linkedIssue?: { number: string; title: string; url: string };
  linkedPR?: { number: string; title: string; url: string };
  linkedArtifact?: { path: string; title: string };
}
