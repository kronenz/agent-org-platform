import type { PipelineStage } from './work-item.js';

export type NodeType = 
  | 'moc' 
  | 'concept' 
  | 'project' 
  | 'resource'
  | 'team'
  | 'agent'
  | 'index'
  | 'registry';

export type NodeStatus = 'draft' | 'review' | 'published' | 'active' | 'inactive';

export interface Frontmatter {
  title?: string;
  type?: NodeType;
  status?: NodeStatus;
  domain?: string;
  parent?: string;
  related?: string[];
  
  pipelineStage?: PipelineStage;
  indexNumber?: string;
  division?: string;
  teamId?: string;
  agentId?: string;
  capabilities?: string[];
  supervisedBy?: string;
  members?: string[];
  
  [key: string]: unknown;
}

/**
 * Represents a markdown document artifact from the vault
 */
export interface Artifact {
  id: string;           // Unique identifier (slug from path)
  path: string;         // Relative path from vault root
  title: string;        // From frontmatter or first heading
  frontmatter: Frontmatter;
  content: string;      // Raw markdown content
  outgoingLinks: string[]; // Wikilinks found in content
}
