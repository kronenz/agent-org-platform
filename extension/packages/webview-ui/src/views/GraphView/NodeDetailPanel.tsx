import React from 'react';
import type { GraphNode, GraphEdge } from '../../hooks/useGraphData';
import { TreeView } from './TreeView';

interface NodeDetailPanelProps {
  node: GraphNode;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  onClose: () => void;
  onNodeSelect: (nodeId: string) => void;
}

const NODE_COLORS: Record<string, string> = {
  moc: '#60A5FA',
  concept: '#34D399',
  project: '#F59E0B',
  resource: '#A78BFA',
  team: '#EC4899',
  agent: '#14B8A6',
  index: '#F472B6',
  registry: '#8B5CF6',
};

const NODE_ICONS: Record<string, string> = {
  moc: '★',
  concept: '◆',
  project: '◉',
  resource: '◇',
  team: '◈',
  agent: '⚙',
  index: '▣',
  registry: '▤',
};

export function NodeDetailPanel({ node, edges, allNodes, onClose, onNodeSelect }: NodeDetailPanelProps) {
  const nodeType = node.type || 'resource';
  const nodeColor = NODE_COLORS[nodeType] || '#6B7280';
  const nodeIcon = NODE_ICONS[nodeType] || '○';
  
  const incomingCount = edges.filter(e => e.target === node.id).length;
  const outgoingCount = edges.filter(e => e.source === node.id).length;
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderLeft: `2px solid ${nodeColor}`,
      background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        padding: '16px',
        background: `linear-gradient(135deg, ${nodeColor}15 0%, transparent 60%)`,
        borderBottom: '1px solid #30363d',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${nodeColor}25`,
              border: `1px solid ${nodeColor}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: nodeColor,
            }}>
              {nodeIcon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: 15, 
                fontWeight: 600, 
                color: '#e6edf3',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {node.label}
              </div>
              <div style={{ 
                fontSize: 11, 
                color: nodeColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: 2,
              }}>
                {nodeType}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b949e',
              cursor: 'pointer',
              fontSize: 18,
              padding: 4,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#21262d'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ×
          </button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginTop: 12,
          padding: '8px 0',
        }}>
          <div style={{
            flex: 1,
            padding: '8px 12px',
            background: '#21262d',
            borderRadius: 6,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#A78BFA' }}>{incomingCount}</div>
            <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2 }}>Incoming</div>
          </div>
          <div style={{
            flex: 1,
            padding: '8px 12px',
            background: '#21262d',
            borderRadius: 6,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#34D399' }}>{outgoingCount}</div>
            <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2 }}>Outgoing</div>
          </div>
          {node.status && (
            <div style={{
              flex: 1,
              padding: '8px 12px',
              background: '#21262d',
              borderRadius: 6,
              textAlign: 'center',
            }}>
              <div style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                color: node.status === 'active' || node.status === 'published' ? '#34D399' : '#F59E0B',
                textTransform: 'uppercase',
              }}>
                {node.status}
              </div>
              <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2 }}>Status</div>
            </div>
          )}
        </div>
        
        <div style={{ fontSize: 10, color: '#6e7681', marginTop: 8, textAlign: 'center' }}>
          Press ESC or click background to close
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '8px 0',
      }}>
        <TreeView
          node={node}
          edges={edges}
          allNodes={allNodes}
          onNodeSelect={onNodeSelect}
        />
      </div>
    </div>
  );
}
