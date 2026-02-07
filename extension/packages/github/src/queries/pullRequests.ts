import type { GitHubClient } from '../client.js';

export interface GitHubPullRequest {
  id: string;
  number: number;
  title: string;
  url: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  isDraft: boolean;
  labels: { name: string }[];
  assignees: { login: string }[];
  author: { login: string } | null;
}

interface PRNode {
  id: string;
  number: number;
  title: string;
  url: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  isDraft: boolean;
  labels: {
    nodes: Array<{ name: string }>;
  };
  assignees: {
    nodes: Array<{ login: string }>;
  };
  author: { login: string } | null;
}

interface PRsQueryResponse {
  repository: {
    pullRequests: {
      nodes: PRNode[];
    };
  };
}

export const PRS_QUERY = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 50, states: OPEN) {
        nodes {
          id
          number
          title
          url
          state
          isDraft
          labels(first: 10) {
            nodes {
              name
            }
          }
          assignees(first: 5) {
            nodes {
              login
            }
          }
          author {
            login
          }
        }
      }
    }
  }
`;

export async function fetchPullRequests(
  client: GitHubClient,
  owner: string,
  repo: string
): Promise<GitHubPullRequest[]> {
  const response = await client<PRsQueryResponse>(PRS_QUERY, {
    owner,
    name: repo,
  });

  return response.repository.pullRequests.nodes.map((node: PRNode) => ({
    id: node.id,
    number: node.number,
    title: node.title,
    url: node.url,
    state: node.state,
    isDraft: node.isDraft,
    labels: node.labels.nodes,
    assignees: node.assignees.nodes,
    author: node.author,
  }));
}
