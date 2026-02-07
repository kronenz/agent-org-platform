/**
 * Types of relationships between artifacts
 */
export type EdgeType = 'parent' | 'related' | 'wikilink';

/**
 * Represents a directed edge in the knowledge graph
 */
export interface Edge {
  source: string;       // Artifact ID
  target: string;       // Artifact ID
  type: EdgeType;
}
