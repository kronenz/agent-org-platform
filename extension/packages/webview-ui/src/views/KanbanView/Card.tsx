import React, { useState } from 'react';
import { postMessage } from '../../hooks/useVsCodeApi';
import type { WorkItem, PipelineStage, Priority } from '../../hooks/useWorkItems';

interface CardProps {
  item: WorkItem;
  isSelected?: boolean;
  onSelect?: (item: WorkItem) => void;
}

const STAGE_COLORS: Record<PipelineStage, string> = {
  management: '#3B82F6',
  research: '#8B5CF6',
  implementation: '#10B981',
  quality: '#F59E0B',
};

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; label: string }> = {
  P0: { color: '#EF4444', bg: '#EF444420', label: 'P0 Critical' },
  P1: { color: '#F59E0B', bg: '#F59E0B20', label: 'P1 High' },
  P2: { color: '#3B82F6', bg: '#3B82F620', label: 'P2 Medium' },
  P3: { color: '#6B7280', bg: '#6B728020', label: 'P3 Low' },
};

const LABEL_COLORS: Record<string, string> = {
  bug: '#EF4444',
  feature: '#10B981',
  security: '#F59E0B',
  'need:human': '#EF4444',
  planning: '#3B82F6',
  design: '#8B5CF6',
  api: '#06B6D4',
  auth: '#F59E0B',
  testing: '#10B981',
  deploy: '#EC4899',
  research: '#8B5CF6',
  database: '#6366F1',
  performance: '#F97316',
  core: '#14B8A6',
};

export function Card({ item, isSelected, onSelect }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
    postMessage({ type: 'cardClick', itemId: item.id });
  };

  const stageColor = STAGE_COLORS[item.stage];
  const priorityConfig = item.priority ? PRIORITY_CONFIG[item.priority] : null;
  
  const getLabelColor = (label: string): string => {
    const lowerLabel = label.toLowerCase();
    for (const [key, color] of Object.entries(LABEL_COLORS)) {
      if (lowerLabel.includes(key)) return color;
    }
    return '#6B7280';
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isSelected ? '#1c2128' : (isHovered ? '#21262d' : '#161b22'),
        border: isSelected ? `2px solid ${stageColor}` : '1px solid #30363d',
        borderLeft: item.needHuman ? '3px solid #EF4444' : `3px solid ${stageColor}${isSelected ? '' : '40'}`,
        borderRadius: 8,
        padding: 12,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isSelected 
          ? `0 0 0 1px ${stageColor}40, 0 4px 12px rgba(0,0,0,0.3)` 
          : (isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'),
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        flexWrap: 'wrap',
      }}>
        {priorityConfig && (
          <span style={{
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 700,
            background: priorityConfig.bg,
            color: priorityConfig.color,
            border: `1px solid ${priorityConfig.color}50`,
          }}>
            {item.priority}
          </span>
        )}
        
        {item.needHuman && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 6px',
            background: '#EF444420',
            border: '1px solid #EF4444',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            color: '#EF4444',
          }}>
            ⚠ HUMAN
          </span>
        )}
      </div>
      
      <div style={{
        fontSize: 13,
        fontWeight: 500,
        color: '#e6edf3',
        marginBottom: 8,
        lineHeight: 1.4,
      }}>
        {item.title}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        color: '#8b949e',
        marginBottom: item.labels.length > 0 ? 8 : 0,
        flexWrap: 'wrap',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 6px',
          background: item.type === 'pr' ? '#238636' : '#1f6feb',
          borderRadius: 4,
          color: '#fff',
          fontWeight: 500,
        }}>
          {item.type === 'pr' ? (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>
              </svg>
              PR
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
              </svg>
              Issue
            </>
          )}
        </span>
        
        <span style={{ color: '#6e7681' }}>#{item.number}</span>
        
        {item.assignee && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: stageColor + '40',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              color: stageColor,
              fontWeight: 600,
            }}>
              {item.assignee.charAt(0).toUpperCase()}
            </span>
            {item.assignee}
          </span>
        )}
      </div>
      
      {item.labels.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
        }}>
          {item.labels.slice(0, 3).map((label) => {
            const color = getLabelColor(label);
            return (
              <span
                key={label}
                style={{
                  padding: '2px 6px',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 500,
                  background: color + '20',
                  color: color,
                }}
              >
                {label}
              </span>
            );
          })}
          {item.labels.length > 3 && (
            <span style={{
              padding: '2px 6px',
              borderRadius: 10,
              fontSize: 10,
              color: '#6e7681',
            }}>
              +{item.labels.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
