import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import type { GraphNode, GraphEdge } from '../../hooks/useGraphData';

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

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onBackgroundClick?: () => void;
}

interface GraphNodeData extends GraphNode {
  neighbors?: GraphNodeData[];
  links?: GraphLinkData[];
}

interface GraphLinkData {
  source: string | GraphNodeData;
  target: string | GraphNodeData;
  type: string;
}

const DOUBLE_CLICK_DELAY = 300;

export function Graph({ nodes, edges, selectedNodeId, onNodeClick, onNodeDoubleClick, onBackgroundClick }: GraphProps) {
  const fgRef = useRef<ForceGraphMethods<GraphNodeData, GraphLinkData>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const lastClickRef = useRef<{ nodeId: string; time: number } | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, []);

  const graphData = useMemo(() => {
    const nodeMap = new Map<string, GraphNodeData>();
    
    const graphNodes: GraphNodeData[] = nodes.map(n => {
      const node: GraphNodeData = { ...n, neighbors: [], links: [] };
      nodeMap.set(n.id, node);
      return node;
    });

    const graphLinks: GraphLinkData[] = edges
      .filter(e => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map(e => ({
        source: e.source,
        target: e.target,
        type: e.type,
      }));

    graphLinks.forEach(link => {
      const sourceNode = nodeMap.get(link.source as string);
      const targetNode = nodeMap.get(link.target as string);
      if (sourceNode && targetNode) {
        sourceNode.neighbors?.push(targetNode);
        targetNode.neighbors?.push(sourceNode);
        sourceNode.links?.push(link);
        targetNode.links?.push(link);
      }
    });

    return { nodes: graphNodes, links: graphLinks };
  }, [nodes, edges]);

  const handleNodeClick = useCallback((node: GraphNodeData) => {
    const now = Date.now();
    const lastClick = lastClickRef.current;
    
    if (lastClick && lastClick.nodeId === node.id && now - lastClick.time < DOUBLE_CLICK_DELAY) {
      lastClickRef.current = null;
      if (onNodeDoubleClick) {
        onNodeDoubleClick(node);
      }
      return;
    }
    
    lastClickRef.current = { nodeId: node.id, time: now };
    
    onNodeClick(node.id);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 500);
      fgRef.current.zoom(2, 500);
    }
  }, [onNodeClick, onNodeDoubleClick]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    
    const connected = new Set<string>([selectedNodeId]);
    edges.forEach(e => {
      if (e.source === selectedNodeId) connected.add(e.target);
      if (e.target === selectedNodeId) connected.add(e.source);
    });
    return connected;
  }, [selectedNodeId, edges]);

  const nodeCanvasObject = useCallback((node: GraphNodeData, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label || node.id;
    const fontSize = Math.max(12 / globalScale, 4);
    const nodeColor = NODE_COLORS[node.type || ''] || '#6B7280';
    const isSelected = node.id === selectedNodeId;
    const isConnected = connectedNodeIds.has(node.id);
    const hasSelection = selectedNodeId !== null;
    
    const isDimmed = hasSelection && !isConnected;
    const nodeSize = isSelected ? 12 : isConnected ? 8 : 6;
    const alpha = isDimmed ? 0.15 : 1;
    
    ctx.globalAlpha = alpha;
    
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, nodeSize + 6, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(
        node.x || 0, node.y || 0, nodeSize,
        node.x || 0, node.y || 0, nodeSize + 6
      );
      gradient.addColorStop(0, nodeColor + '80');
      gradient.addColorStop(1, nodeColor + '00');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor;
    ctx.fill();
    
    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    } else if (isConnected && hasSelection) {
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    if (!isDimmed || isSelected) {
      ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isSelected ? '#fff' : (isConnected ? '#e6edf3' : '#8b949e');
      ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + 3);
    }
    
    ctx.globalAlpha = 1;
  }, [selectedNodeId, connectedNodeIds]);

  const linkCanvasObject = useCallback((link: GraphLinkData, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const source = link.source as GraphNodeData;
    const target = link.target as GraphNodeData;
    if (!source.x || !target.x) return;
    
    const sourceId = typeof link.source === 'string' ? link.source : source.id;
    const targetId = typeof link.target === 'string' ? link.target : target.id;
    
    const isConnectedToSelected = selectedNodeId === sourceId || selectedNodeId === targetId;
    const hasSelection = selectedNodeId !== null;
    const isDimmed = hasSelection && !isConnectedToSelected;
    
    let color: string;
    switch (link.type) {
      case 'parent': color = '#F59E0B'; break;
      case 'related': color = '#34D399'; break;
      case 'moc_contains': 
      case 'contains': color = '#60A5FA'; break;
      case 'member_of': color = '#14B8A6'; break;
      case 'pipeline_next':
      case 'pipeline_prev': color = '#EC4899'; break;
      case 'supervised_by': color = '#8B5CF6'; break;
      default: color = '#4B5563';
    }
    
    ctx.globalAlpha = isDimmed ? 0.08 : (isConnectedToSelected ? 1 : 0.6);
    ctx.strokeStyle = color;
    ctx.lineWidth = isConnectedToSelected ? 2.5 : 1.5;
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y || 0);
    
    const midX = (source.x + target.x) / 2;
    const midY = ((source.y || 0) + (target.y || 0)) / 2;
    const dx = target.x - source.x;
    const dy = (target.y || 0) - (source.y || 0);
    const curvature = 0.1;
    const cpX = midX - dy * curvature;
    const cpY = midY + dx * curvature;
    
    ctx.quadraticCurveTo(cpX, cpY, target.x, target.y || 0);
    ctx.stroke();
    
    if (!isDimmed) {
      const angle = Math.atan2((target.y || 0) - cpY, target.x - cpX);
      const arrowLen = 6;
      const arrowX = target.x - Math.cos(angle) * 8;
      const arrowY = (target.y || 0) - Math.sin(angle) * 8;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLen * Math.cos(angle - Math.PI / 6),
        arrowY - arrowLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - arrowLen * Math.cos(angle + Math.PI / 6),
        arrowY - arrowLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }, [selectedNodeId]);

  if (nodes.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        minHeight: 400,
        color: '#888'
      }}>
        No nodes to display
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: 500, background: '#0d1117' }}
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeId="id"
        nodeLabel={(node: GraphNodeData) => `${node.label}\n(${node.type || 'unknown'})`}
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={(node: GraphNodeData, color, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, 12, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkCanvasObject={linkCanvasObject}
        linkPointerAreaPaint={(link: GraphLinkData, color, ctx) => {
          const source = link.source as GraphNodeData;
          const target = link.target as GraphNodeData;
          if (!source.x || !target.x) return;
          ctx.strokeStyle = color;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(source.x, source.y || 0);
          ctx.lineTo(target.x, target.y || 0);
          ctx.stroke();
        }}
        onNodeClick={handleNodeClick}
        onBackgroundClick={onBackgroundClick}
        backgroundColor="#0d1117"
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
