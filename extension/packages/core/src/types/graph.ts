import type { NodeType, NodeStatus } from './artifact.js';
import type { PipelineStage } from './work-item.js';
import type { Edge } from './edge.js';

export interface GraphNode {
  id: string;
  label: string;
  type?: NodeType;
  status?: NodeStatus;
  domain?: string;
  path?: string;
  
  indexNumber?: string;
  division?: string;
  pipelineStage?: PipelineStage;
  
  agentId?: string;
  capabilities?: string[];
  supervisedBy?: string;
  
  teamId?: string;
  members?: string[];
  
  x?: number;
  y?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: Edge[];
}
