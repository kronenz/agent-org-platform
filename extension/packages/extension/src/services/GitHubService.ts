import { WorkItem, HumanQueueItem } from '@agent-org/core';

export interface GitHubService {
  /**
   * Authenticate with GitHub (OAuth or PAT)
   */
  authenticate(): Promise<boolean>;
  
  /**
   * Get work items from GitHub Issues and Projects v2
   */
  getWorkItems(): Promise<WorkItem[]>;
  
  /**
   * Get human queue items (issues with need:human label)
   */
  getQueueItems(): Promise<HumanQueueItem[]>;
}

export class GitHubServiceImpl implements GitHubService {
  constructor(private cacheService: any) {}
  
  async authenticate(): Promise<boolean> {
    // TODO (Task 6): Implement GitHub authentication
    // - Check for stored token
    // - If not found, prompt user for PAT or OAuth
    // - Validate token
    console.log('GitHubService.authenticate() - stub');
    return false;
  }
  
  async getWorkItems(): Promise<WorkItem[]> {
    // TODO (Task 6): Implement GitHub GraphQL query
    // - Fetch issues from configured repo
    // - Fetch Projects v2 data
    // - Map to WorkItem type
    console.log('GitHubService.getWorkItems() - stub');
    return [];
  }
  
  async getQueueItems(): Promise<HumanQueueItem[]> {
    // TODO (Task 6): Implement need:human filtering
    // - Fetch issues with need:human label
    // - Map to HumanQueueItem type
    console.log('GitHubService.getQueueItems() - stub');
    return [];
  }
}
