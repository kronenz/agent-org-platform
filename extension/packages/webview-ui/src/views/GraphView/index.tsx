import React from 'react';
import { useGraphData } from '../../hooks/useGraphData';

const NODE_COLORS: Record<string, string> = {
  moc: '#60A5FA',
  concept: '#34D399',
  project: '#F59E0B',
  resource: '#A78BFA',
};

export function GraphView() {
  const { data, loading, error } = useGraphData();

  return (
    <div style={{ padding: 20, background: '#1e1e1e', minHeight: '100vh', color: '#fff' }}>
      <h2 style={{ marginBottom: 16 }}>Knowledge Graph</h2>
      
      <div style={{ padding: 10, background: '#333', marginBottom: 16, borderRadius: 4 }}>
        <strong>Status:</strong> {loading ? 'Loading...' : 'Loaded'}<br/>
        <strong>Nodes:</strong> {data.nodes.length}<br/>
        <strong>Edges:</strong> {data.edges.length}<br/>
        {error && <span style={{ color: 'red' }}>Error: {error}</span>}
      </div>

      {!loading && data.nodes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.nodes.map((node) => (
            <div
              key={node.id}
              style={{
                padding: '10px 14px',
                background: NODE_COLORS[node.type || ''] || '#666',
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              <strong>{node.label}</strong>
              <div style={{ fontSize: 10, opacity: 0.8 }}>{node.type}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && data.nodes.length === 0 && (
        <div style={{ color: '#f66', padding: 20 }}>
          No nodes! Data not loaded properly.
        </div>
      )}
    </div>
  );
}
