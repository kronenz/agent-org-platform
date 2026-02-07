import type { GitHubClient } from '../client.js';

export interface GitHubIssue {
  id: string;
  number: number;
  title: string;
  url: string;
  state: 'OPEN' | 'CLOSED';
  labels: { name: string }[];
  assignees: { login: string }[];
}

interface IssueNode {
  id: string;
  number: number;
  title: string;
  url: string;
  state: 'OPEN' | 'CLOSED';
  labels: {
    nodes: Array<{ name: string }>;
  };
  assignees: {
    nodes: Array<{ login: string }>;
  };
}

interface IssuesQueryResponse {
  repository: {
    issues: {
      nodes: IssueNode[];
    };
  };
}

export const ISSUES_QUERY = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      issues(first: 50, states: OPEN) {
        nodes {
          id
          number
          title
          url
          state
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
        }
      }
    }
  }
`;

export async function fetchIssues(
  client: GitHubClient,
  owner: string,
  repo: string
): Promise<GitHubIssue[]> {
  const response = await client<IssuesQueryResponse>(ISSUES_QUERY, {
    owner,
    name: repo,
  });

  return response.repository.issues.nodes.map((node: IssueNode) => ({
    id: node.id,
    number: node.number,
    title: node.title,
    url: node.url,
    state: node.state,
    labels: node.labels.nodes,
    assignees: node.assignees.nodes,
  }));
}
