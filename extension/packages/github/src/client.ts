import { graphql } from '@octokit/graphql';
import { getAccessToken } from './auth.js';

export type GitHubClient = ReturnType<typeof graphql.defaults>;

export async function createGitHubClient(): Promise<GitHubClient | undefined> {
  const token = await getAccessToken();
  if (!token) {
    return undefined;
  }

  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}
