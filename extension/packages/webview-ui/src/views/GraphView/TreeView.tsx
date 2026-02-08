import React, { useState } from 'react';
import type { GraphNode, GraphEdge, NodeType, PipelineStage } from '../../hooks/useGraphData';

interface TreeViewProps {
  node: GraphNode;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  onNodeSelect: (nodeId: string) => void;
}

interface TreeItemProps {
  label: string;
  icon?: string;
  iconColor?: string;
  depth?: number;
  isExpandable?: boolean;
  defaultExpanded?: boolean;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const COLORS: Record<string, string> = {
  moc: '#60A5FA',
  concept: '#34D399',
  project: '#F59E0B',
  resource: '#A78BFA',
  team: '#EC4899',
  agent: '#14B8A6',
  index: '#F472B6',
  registry: '#8B5CF6',
};

const ICONS: Record<string, string> = {
  moc: '★',
  concept: '◆',
  project: '◉',
  resource: '◇',
  team: '◈',
  agent: '⚙',
  index: '▣',
  registry: '▤',
  pipeline: '▶',
  member: '○',
  link: '→',
  reference: '←',
};

function TreeItem({ 
  label, 
  icon, 
  iconColor, 
  depth = 0, 
  isExpandable, 
  defaultExpanded = true,
  badge,
  badgeColor,
  onClick,
  children 
}: TreeItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = React.Children.count(children) > 0;
  const showExpander = isExpandable ?? hasChildren;

  return (
    <div>
      <div
        onClick={() => {
          if (onClick) onClick();
          else if (showExpander) setExpanded(!expanded);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 8px',
          paddingLeft: 8 + depth * 16,
          cursor: onClick || showExpander ? 'pointer' : 'default',
          borderRadius: 4,
          fontSize: 13,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          if (onClick || showExpander) {
            e.currentTarget.style.background = '#21262d';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {showExpander && (
          <span style={{ 
            color: '#6e7681', 
            fontSize: 10, 
            width: 12,
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}>
            ▶
          </span>
        )}
        {!showExpander && <span style={{ width: 12 }} />}
        
        {icon && (
          <span style={{ color: iconColor || '#8b949e', fontSize: 12 }}>
            {icon}
          </span>
        )}
        
        <span style={{ color: '#e6edf3', flex: 1 }}>{label}</span>
        
        {badge && (
          <span style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 10,
            background: (badgeColor || '#6e7681') + '20',
            color: badgeColor || '#6e7681',
          }}>
            {badge}
          </span>
        )}
      </div>
      
      {expanded && hasChildren && (
        <div>{children}</div>
      )}
    </div>
  );
}

function PipelineView({ currentStage }: { currentStage: PipelineStage }) {
  const stages: PipelineStage[] = ['management', 'research', 'implementation', 'quality'];
  const labels: Record<PipelineStage, string> = {
    management: 'Management',
    research: 'Research', 
    implementation: 'Implementation',
    quality: 'Quality',
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 4, 
      padding: '8px 12px',
      background: '#21262d',
      borderRadius: 6,
      marginTop: 4,
      marginLeft: 36,
      marginRight: 8,
    }}>
      {stages.map((stage, idx) => (
        <React.Fragment key={stage}>
          {idx > 0 && <span style={{ color: '#484f58', fontSize: 10 }}>→</span>}
          <span style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 4,
            background: stage === currentStage ? '#EC4899' : 'transparent',
            color: stage === currentStage ? '#fff' : '#6e7681',
            fontWeight: stage === currentStage ? 600 : 400,
          }}>
            {labels[stage]}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export function TreeView({ node, edges, allNodes, onNodeSelect }: TreeViewProps) {
  const nodeType = node.type || 'resource';
  const getNode = (id: string) => allNodes.find(n => n.id === id);
  
  const incomingEdges = edges.filter(e => e.target === node.id);
  const outgoingEdges = edges.filter(e => e.source === node.id);
  
  const memberEdges = incomingEdges.filter(e => e.type === 'member_of');
  const containsEdges = outgoingEdges.filter(e => e.type === 'contains' || e.type === 'moc_contains');
  const pipelineNextEdges = outgoingEdges.filter(e => e.type === 'pipeline_next');
  const pipelinePrevEdges = incomingEdges.filter(e => e.type === 'pipeline_next');
  const linkEdges = outgoingEdges.filter(e => 
    !['contains', 'moc_contains', 'pipeline_next', 'member_of'].includes(e.type)
  );
  const referencedByEdges = incomingEdges.filter(e => 
    !['pipeline_next', 'member_of'].includes(e.type)
  );

  const members = node.members?.map(memberId => {
    const memberNode = allNodes.find(n => n.label === memberId || n.agentId === memberId);
    return memberNode || { id: `member:${memberId.toLowerCase()}`, label: memberId, type: 'agent' as NodeType };
  }) || [];

  const parentTeam = node.teamId ? getNode(node.teamId) : null;

  return (
    <div style={{ fontSize: 13 }}>
      <TreeItem 
        label={node.label} 
        icon={ICONS[nodeType]}
        iconColor={COLORS[nodeType]}
        badge={node.status}
        badgeColor={node.status === 'active' || node.status === 'published' ? '#34D399' : '#6e7681'}
        defaultExpanded={true}
      >
        {node.indexNumber && (
          <TreeItem 
            label={`Index: ${node.indexNumber}`} 
            icon="＃"
            iconColor="#6e7681"
            depth={1}
          />
        )}

        {node.domain && (
          <TreeItem 
            label={`Domain: ${node.domain}`} 
            icon="◎"
            iconColor="#6e7681"
            depth={1}
          />
        )}

        {nodeType === 'team' && node.pipelineStage && (
          <TreeItem 
            label="Pipeline Stage" 
            icon={ICONS.pipeline}
            iconColor="#EC4899"
            depth={1}
            defaultExpanded={true}
          >
            <PipelineView currentStage={node.pipelineStage} />
          </TreeItem>
        )}

        {nodeType === 'team' && members.length > 0 && (
          <TreeItem 
            label="Members" 
            icon="◈"
            iconColor="#14B8A6"
            depth={1}
            badge={String(members.length)}
            badgeColor="#14B8A6"
            defaultExpanded={true}
          >
            {members.map(member => (
              <TreeItem
                key={member.id}
                label={member.label}
                icon={ICONS.agent}
                iconColor={COLORS.agent}
                depth={2}
                onClick={() => onNodeSelect(member.id)}
              />
            ))}
          </TreeItem>
        )}

        {nodeType === 'agent' && parentTeam && (
          <TreeItem 
            label="Team" 
            icon="◈"
            iconColor="#EC4899"
            depth={1}
            defaultExpanded={true}
          >
            <TreeItem
              label={parentTeam.label}
              icon={ICONS.team}
              iconColor={COLORS.team}
              depth={2}
              onClick={() => onNodeSelect(parentTeam.id)}
            />
          </TreeItem>
        )}

        {nodeType === 'agent' && node.capabilities && node.capabilities.length > 0 && (
          <TreeItem 
            label="Capabilities" 
            icon="◆"
            iconColor="#F59E0B"
            depth={1}
            badge={String(node.capabilities.length)}
            badgeColor="#F59E0B"
            defaultExpanded={true}
          >
            {node.capabilities.map((cap, idx) => (
              <TreeItem
                key={idx}
                label={cap}
                icon="•"
                iconColor="#F59E0B"
                depth={2}
              />
            ))}
          </TreeItem>
        )}

        {(nodeType === 'moc' || nodeType === 'index') && containsEdges.length > 0 && (
          <TreeItem 
            label="Contains" 
            icon="▼"
            iconColor="#60A5FA"
            depth={1}
            badge={String(containsEdges.length)}
            badgeColor="#60A5FA"
            defaultExpanded={true}
          >
            {containsEdges.slice(0, 15).map(edge => {
              const target = getNode(edge.target);
              if (!target) return null;
              return (
                <TreeItem
                  key={edge.target}
                  label={target.label}
                  icon={ICONS[target.type || 'resource']}
                  iconColor={COLORS[target.type || 'resource']}
                  depth={2}
                  onClick={() => onNodeSelect(edge.target)}
                />
              );
            })}
            {containsEdges.length > 15 && (
              <TreeItem
                label={`... and ${containsEdges.length - 15} more`}
                icon="..."
                iconColor="#6e7681"
                depth={2}
              />
            )}
          </TreeItem>
        )}

        {linkEdges.length > 0 && (
          <TreeItem 
            label="Links To" 
            icon={ICONS.link}
            iconColor="#34D399"
            depth={1}
            badge={String(linkEdges.length)}
            badgeColor="#34D399"
            defaultExpanded={linkEdges.length <= 5}
          >
            {linkEdges.slice(0, 10).map(edge => {
              const target = getNode(edge.target);
              if (!target) return null;
              return (
                <TreeItem
                  key={edge.target}
                  label={target.label}
                  icon={ICONS[target.type || 'resource']}
                  iconColor={COLORS[target.type || 'resource']}
                  badge={edge.type}
                  badgeColor="#6e7681"
                  depth={2}
                  onClick={() => onNodeSelect(edge.target)}
                />
              );
            })}
          </TreeItem>
        )}

        {referencedByEdges.length > 0 && (
          <TreeItem 
            label="Referenced By" 
            icon={ICONS.reference}
            iconColor="#A78BFA"
            depth={1}
            badge={String(referencedByEdges.length)}
            badgeColor="#A78BFA"
            defaultExpanded={referencedByEdges.length <= 5}
          >
            {referencedByEdges.slice(0, 10).map(edge => {
              const source = getNode(edge.source);
              if (!source) return null;
              return (
                <TreeItem
                  key={edge.source}
                  label={source.label}
                  icon={ICONS[source.type || 'resource']}
                  iconColor={COLORS[source.type || 'resource']}
                  badge={edge.type}
                  badgeColor="#6e7681"
                  depth={2}
                  onClick={() => onNodeSelect(edge.source)}
                />
              );
            })}
          </TreeItem>
        )}
      </TreeItem>
    </div>
  );
}
