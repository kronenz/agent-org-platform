import React from 'react';
import { Column } from './Column';
import type { PipelineStage, WorkItem } from '../../hooks/useWorkItems';

const STAGES: PipelineStage[] = ['management', 'research', 'implementation', 'quality'];

interface BoardProps {
  items: WorkItem[];
  selectedItemId: number | null;
  onSelectItem: (item: WorkItem) => void;
}

export function Board({ items, selectedItemId, onSelectItem }: BoardProps) {
  const itemsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = items.filter((item) => item.stage === stage);
    return acc;
  }, {} as Record<PipelineStage, WorkItem[]>);

  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: 16,
      height: '100%',
      overflowX: 'auto',
      background: '#010409',
    }}>
      {STAGES.map((stage, idx) => (
        <React.Fragment key={stage}>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}>
            <Column 
              stage={stage} 
              items={itemsByStage[stage]}
              selectedItemId={selectedItemId}
              onSelectItem={onSelectItem}
            />
          </div>
          {idx < STAGES.length - 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#30363d',
              fontSize: 20,
              padding: '0 4px',
            }}>
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
