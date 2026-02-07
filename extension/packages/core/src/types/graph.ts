import type { Frontmatter } from './artifact.js';
import type { Edge } from './edge.js';

/**
 * Node representation for graph visualization
 */
export interface GraphNode {
  id: string;
  label: string;
  type: Frontmatter['type'];
  status: Frontmatter['status'];
  domain?: string;
  x?: number;
  y?: number;
}

/**
 * Complete graph data structure for visualization
 */
export interface GraphData {
  nodes: GraphNode[];
  edges: Edge[];
}
