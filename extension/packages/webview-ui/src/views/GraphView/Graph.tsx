import React, { useState } from 'react';
import type { GraphNode, GraphEdge } from '../../hooks/useGraphData';

const NODE_COLORS: Record<string, string> = {
  moc: '#60A5FA',
  concept: '#34D399',
  project: '#F59E0B',
  resource: '#A78BFA',
};

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}

export function Graph({ nodes, edges, selectedNodeId, onNodeClick }: GraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div style={{ 
      padding: 20, 
      background: '#1a1a2e', 
      minHeight: 400,
      borderRadius: 8,
      margin: 10
    }}>
      <div style={{ marginBottom: 16, color: '#888', fontSize: 12 }}>
        Nodes: {nodes.length} | Edges: {edges.length}
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 12,
        justifyContent: 'center'
      }}>
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              padding: '12px 16px',
              background: node.id === selectedNodeId ? '#fff' : (NODE_COLORS[node.type || ''] || '#6B7280'),
              color: node.id === selectedNodeId ? '#000' : '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transform: hoveredNode === node.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s',
              boxShadow: node.id === selectedNodeId 
                ? '0 0 0 3px ' + (NODE_COLORS[node.type || ''] || '#6B7280')
                : 'none',
            }}
          >
            {node.label}
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
              {node.type} • {node.status}
            </div>
          </div>
        ))}
      </div>

      {nodes.length === 0 && (
        <div style={{ color: '#f00', padding: 20, textAlign: 'center' }}>
          No nodes received! Data loading issue.
        </div>
      )}
    </div>
  );
}
