import type { GitHubClient } from '../client.js';

export interface GitHubProjectItem {
  id: string;
  type: 'ISSUE' | 'PULL_REQUEST' | 'DRAFT_ISSUE' | 'REDACTED';
  status: string | null;
  content: {
    id: string;
    number: number;
    title: string;
    url: string;
  } | null;
}

interface ProjectV2QueryResponse {
  organization?: {
    projectV2: ProjectV2Data | null;
  };
  user?: {
    projectV2: ProjectV2Data | null;
  };
}

interface ProjectItemNode {
  id: string;
  type: 'ISSUE' | 'PULL_REQUEST' | 'DRAFT_ISSUE' | 'REDACTED';
  fieldValueByName: {
    __typename: string;
    name?: string;
  } | null;
  content: {
    __typename: 'Issue' | 'PullRequest' | 'DraftIssue';
    id: string;
    number?: number;
    title: string;
    url?: string;
  } | null;
}

interface ProjectV2Data {
  id: string;
  title: string;
  items: {
    nodes: ProjectItemNode[];
  };
}

export const PROJECTS_V2_QUERY = `
  query($owner: String!, $projectNumber: Int!, $isOrg: Boolean!) {
    organization(login: $owner) @include(if: $isOrg) {
      projectV2(number: $projectNumber) {
        id
        title
        items(first: 50) {
          nodes {
            id
            type
            fieldValueByName(name: "Status") {
              ... on ProjectV2ItemFieldSingleSelectValue {
                __typename
                name
              }
            }
            content {
              __typename
              ... on Issue {
                id
                number
                title
                url
              }
              ... on PullRequest {
                id
                number
                title
                url
              }
              ... on DraftIssue {
                id
                title
              }
            }
          }
        }
      }
    }
    user(login: $owner) @skip(if: $isOrg) {
      projectV2(number: $projectNumber) {
        id
        title
        items(first: 50) {
          nodes {
            id
            type
            fieldValueByName(name: "Status") {
              ... on ProjectV2ItemFieldSingleSelectValue {
                __typename
                name
              }
            }
            content {
              __typename
              ... on Issue {
                id
                number
                title
                url
              }
              ... on PullRequest {
                id
                number
                title
                url
              }
              ... on DraftIssue {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

export interface FetchProjectItemsOptions {
  isOrg?: boolean;
}

export async function fetchProjectItems(
  client: GitHubClient,
  owner: string,
  projectNumber: number,
  options: FetchProjectItemsOptions = {}
): Promise<GitHubProjectItem[]> {
  const { isOrg = true } = options;

  const response = await client<ProjectV2QueryResponse>(PROJECTS_V2_QUERY, {
    owner,
    projectNumber,
    isOrg,
  });

  const projectData = isOrg
    ? response.organization?.projectV2
    : response.user?.projectV2;

  if (!projectData) {
    return [];
  }

  return projectData.items.nodes.map((node: ProjectItemNode) => ({
    id: node.id,
    type: node.type,
    status: node.fieldValueByName?.name ?? null,
    content: node.content
      ? {
          id: node.content.id,
          number: node.content.number ?? 0,
          title: node.content.title,
          url: node.content.url ?? '',
        }
      : null,
  }));
}
