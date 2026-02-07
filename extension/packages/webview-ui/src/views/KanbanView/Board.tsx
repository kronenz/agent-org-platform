import React from 'react';
import { Column } from './Column';
import type { PipelineStage, WorkItem } from '../../hooks/useWorkItems';

const STAGES: PipelineStage[] = ['management', 'research', 'implementation', 'quality'];

interface BoardProps {
  items: WorkItem[];
}

export function Board({ items }: BoardProps) {
  const itemsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = items.filter((item) => item.stage === stage);
    return acc;
  }, {} as Record<PipelineStage, WorkItem[]>);

  return (
    <div className="kanban-board">
      {STAGES.map((stage) => (
        <Column key={stage} stage={stage} items={itemsByStage[stage]} />
      ))}
    </div>
  );
}
