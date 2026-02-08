import React, { useState, useEffect, useCallback } from 'react';
import { useGraphData, GraphNode } from '../../hooks/useGraphData';
import { postMessage } from '../../hooks/useVsCodeApi';
import { Graph } from './Graph';
import { NodeDetailPanel } from './NodeDetailPanel';

const NODE_COLORS: Record<string, string> = {
  moc: '#60A5FA',
  concept: '#34D399',
  project: '#F59E0B',
  resource: '#A78BFA',
  team: '#EC4899',
  agent: '#14B8A6',
};

export function GraphView() {
  const { data, loading, error } = useGraphData();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = selectedNodeId 
    ? data.nodes.find(n => n.id === selectedNodeId) 
    : null;

  const handleDeselect = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleNodeDoubleClick = useCallback((node: GraphNode) => {
    if (node.path) {
      postMessage({ type: 'openDocument', path: node.path });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDeselect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeselect]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh',
        background: '#0d1117',
        color: '#fff'
      }}>
        Loading graph data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: '#f87171', background: '#0d1117', minHeight: '100vh' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      background: '#0d1117',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #30363d',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontWeight: 600 }}>Knowledge Graph</span>
          <span style={{ marginLeft: 12, fontSize: 12, color: '#8b949e' }}>
            {data.nodes.length} nodes / {data.edges.length} edges
          </span>
          <span style={{ marginLeft: 12, fontSize: 11, color: '#6e7681' }}>
            Double-click to open
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              <span style={{ color: '#8b949e' }}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{ 
          flex: 1,
          minWidth: 0,
          position: 'relative',
          transition: 'all 0.2s ease',
        }}>
          <Graph
            nodes={data.nodes}
            edges={data.edges}
            selectedNodeId={selectedNodeId}
            onNodeClick={(nodeId) => {
              console.log('[GraphView] Node clicked:', nodeId);
              setSelectedNodeId(nodeId);
            }}
            onNodeDoubleClick={handleNodeDoubleClick}
            onBackgroundClick={handleDeselect}
          />
          
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            padding: '4px 8px',
            background: selectedNodeId ? '#22c55e20' : '#6b728020',
            border: `1px solid ${selectedNodeId ? '#22c55e' : '#6b7280'}`,
            borderRadius: 4,
            fontSize: 11,
            color: selectedNodeId ? '#22c55e' : '#6b7280',
            zIndex: 10,
          }}>
            {selectedNodeId ? `Selected: ${selectedNodeId}` : 'Click a node to select'}
          </div>
        </div>

        {selectedNode && (
          <div style={{
            width: 340,
            flexShrink: 0,
            height: '100%',
            zIndex: 20,
          }}>
            <NodeDetailPanel
              node={selectedNode}
              edges={data.edges}
              allNodes={data.nodes}
              onClose={() => setSelectedNodeId(null)}
              onNodeSelect={setSelectedNodeId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
