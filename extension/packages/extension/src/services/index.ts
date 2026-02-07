import * as vscode from 'vscode';
import { IndexService, IndexServiceImpl } from './IndexService';
import { GitHubService, GitHubServiceImpl } from './GitHubService';
import { CacheService, CacheServiceImpl } from './CacheService';

export interface Services {
  indexService: IndexService;
  githubService: GitHubService;
  cacheService: CacheService;
}

export function createServices(context: vscode.ExtensionContext): Services {
  const cacheService = new CacheServiceImpl(context);
  const indexService = new IndexServiceImpl(cacheService);
  const githubService = new GitHubServiceImpl(cacheService);
  
  return {
    indexService,
    githubService,
    cacheService,
  };
}
