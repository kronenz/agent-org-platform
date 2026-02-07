import React from 'react';
import { useGraphStore, useSelectedNode } from '../../stores/graphStore';
import { postMessage } from '../../hooks/useVsCodeApi';
import type { GraphNode, GraphEdge } from '../../hooks/useGraphData';

interface NodeDetailProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function NodeDetail({ nodes, edges }: NodeDetailProps) {
  const selectedNodeId = useSelectedNode();
  const { selectNode } = useGraphStore();

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const outgoingLinks = edges
    .filter((e) => e.source === selectedNodeId)
    .map((e) => {
      const target = nodes.find((n) => n.id === e.target);
      return target ? { id: e.target, label: target.label, type: e.type } : null;
    })
    .filter(Boolean);

  const incomingLinks = edges
    .filter((e) => e.target === selectedNodeId)
    .map((e) => {
      const source = nodes.find((n) => n.id === e.source);
      return source ? { id: e.source, label: source.label, type: e.type } : null;
    })
    .filter(Boolean);

  const handleOpenInEditor = () => {
    postMessage({ type: 'openDocument', nodeId: selectedNodeId });
  };

  return (
    <div className="node-detail">
      <div className="node-detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h2 className="node-detail-title">{node.label}</h2>
          <button className="btn btn-secondary" onClick={() => selectNode(null)}>×</button>
        </div>
        <div className="node-detail-badges">
          {node.type && <span className={`badge badge-${node.type}`}>{node.type}</span>}
          {node.status && <span className={`badge badge-${node.status}`}>{node.status}</span>}
        </div>
      </div>

      {node.domain && (
        <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--vscode-descriptionForeground)' }}>
          Domain: {node.domain}
        </div>
      )}

      {outgoingLinks.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--vscode-descriptionForeground)', marginBottom: 4 }}>
            Links to
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {outgoingLinks.map((link: any) => (
              <li
                key={link.id}
                style={{ padding: '4px 0', cursor: 'pointer', fontSize: 13 }}
                onClick={() => selectNode(link.id)}
              >
                → {link.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {incomingLinks.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--vscode-descriptionForeground)', marginBottom: 4 }}>
            Linked from
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {incomingLinks.map((link: any) => (
              <li
                key={link.id}
                style={{ padding: '4px 0', cursor: 'pointer', fontSize: 13 }}
                onClick={() => selectNode(link.id)}
              >
                ← {link.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn" onClick={handleOpenInEditor}>
        Open in Editor
      </button>
    </div>
  );
}
