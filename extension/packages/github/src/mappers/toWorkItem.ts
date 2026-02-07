import type { WorkItem, PipelineStage, QueueItem, QueueItemType, Priority } from 'core';
import type { GitHubIssue, GitHubPullRequest } from '../queries/index.js';

const STAGE_PATTERNS: Record<PipelineStage, string[]> = {
  management: ['management', 'planning'],
  research: ['research', 'design'],
  implementation: ['implementation', 'development'],
  quality: ['quality', 'review', 'testing'],
};

function detectStage(labels: { name: string }[]): PipelineStage {
  const labelNames = labels.map((l) => l.name.toLowerCase());

  for (const [stage, patterns] of Object.entries(STAGE_PATTERNS) as [PipelineStage, string[]][]) {
    if (labelNames.some((label) => patterns.some((pattern) => label.includes(pattern)))) {
      return stage;
    }
  }

  return 'implementation';
}

function hasNeedHumanLabel(labels: { name: string }[]): boolean {
  return labels.some((l) => l.name.toLowerCase() === 'need:human');
}

function detectPriority(labels: { name: string }[]): Priority {
  const labelNames = labels.map((l) => l.name.toLowerCase());
  if (labelNames.some((l) => l.includes('p0') || l.includes('critical'))) return 'p0';
  if (labelNames.some((l) => l.includes('p1') || l.includes('high'))) return 'p1';
  return 'p2';
}

function detectQueueItemType(labels: { name: string }[]): QueueItemType {
  const labelNames = labels.map((l) => l.name.toLowerCase());
  if (labelNames.some((l) => l.includes('approval'))) return 'approval';
  if (labelNames.some((l) => l.includes('review'))) return 'review';
  return 'decision';
}

export function mapIssueToWorkItem(issue: GitHubIssue): WorkItem {
  return {
    id: issue.number,
    number: issue.number,
    title: issue.title,
    type: 'issue',
    stage: detectStage(issue.labels),
    assignee: issue.assignees[0]?.login,
    labels: issue.labels.map((l) => l.name),
    needHuman: hasNeedHumanLabel(issue.labels),
    url: issue.url,
  };
}

export function mapPRToWorkItem(pr: GitHubPullRequest): WorkItem {
  return {
    id: pr.number,
    number: pr.number,
    title: pr.title,
    type: 'pr',
    stage: detectStage(pr.labels),
    assignee: pr.assignees[0]?.login ?? pr.author?.login,
    labels: pr.labels.map((l) => l.name),
    needHuman: hasNeedHumanLabel(pr.labels),
    url: pr.url,
  };
}

export function extractQueueItems(workItems: WorkItem[]): QueueItem[] {
  return workItems
    .filter((item) => item.needHuman)
    .map((item) => {
      const labels = item.labels.map((name: string) => ({ name }));
      return {
        id: item.id,
        title: item.title,
        type: detectQueueItemType(labels),
        priority: detectPriority(labels),
        stage: item.stage,
        waitTime: 'unknown',
        requestedBy: item.assignee ?? 'unknown',
        linkedIssue:
          item.type === 'issue'
            ? { number: String(item.number), title: item.title, url: item.url }
            : undefined,
        linkedPR:
          item.type === 'pr'
            ? { number: String(item.number), title: item.title, url: item.url }
            : undefined,
      };
    });
}
