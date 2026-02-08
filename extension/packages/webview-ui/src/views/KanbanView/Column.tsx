import React from 'react';
import { Card } from './Card';
import type { PipelineStage, WorkItem } from '../../hooks/useWorkItems';

const STAGE_CONFIG: Record<PipelineStage, { color: string; icon: string; label: string }> = {
  management: { color: '#3B82F6', icon: '◆', label: 'Management' },
  research: { color: '#8B5CF6', icon: '◉', label: 'Research' },
  implementation: { color: '#10B981', icon: '⚙', label: 'Implementation' },
  quality: { color: '#F59E0B', icon: '✓', label: 'Quality' },
};

interface ColumnProps {
  stage: PipelineStage;
  items: WorkItem[];
  selectedItemId: number | null;
  onSelectItem: (item: WorkItem) => void;
}

export function Column({ stage, items, selectedItemId, onSelectItem }: ColumnProps) {
  const config = STAGE_CONFIG[stage];
  const needHumanCount = items.filter(i => i.needHuman).length;
  const p0Count = items.filter(i => i.priority === 'P0').length;
  
  return (
    <div style={{
      background: '#0d1117',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 280,
      border: '1px solid #21262d',
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: `3px solid ${config.color}`,
        background: `linear-gradient(180deg, ${config.color}10 0%, transparent 100%)`,
        borderRadius: '12px 12px 0 0',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: config.color + '25',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              color: config.color,
            }}>
              {config.icon}
            </span>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#e6edf3',
            }}>
              {config.label}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 6 }}>
            {p0Count > 0 && (
              <span style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                background: '#EF444420',
                color: '#EF4444',
              }}>
                P0: {p0Count}
              </span>
            )}
            {needHumanCount > 0 && (
              <span style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                background: '#F59E0B20',
                color: '#F59E0B',
              }}>
                ⚠ {needHumanCount}
              </span>
            )}
            <span style={{
              padding: '2px 10px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              background: config.color + '20',
              color: config.color,
            }}>
              {items.length}
            </span>
          </div>
        </div>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {items.length === 0 ? (
          <div style={{
            padding: 20,
            textAlign: 'center',
            color: '#484f58',
            fontSize: 12,
          }}>
            No items in this stage
          </div>
        ) : (
          items.map((item) => (
            <Card 
              key={item.id} 
              item={item}
              isSelected={item.id === selectedItemId}
              onSelect={onSelectItem}
            />
          ))
        )}
      </div>
    </div>
  );
}
