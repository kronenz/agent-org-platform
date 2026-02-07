import React from 'react';
import { Card } from './Card';
import type { PipelineStage, WorkItem } from '../../hooks/useWorkItems';

const STAGE_COLORS: Record<PipelineStage, string> = {
  management: '#3B82F6',
  research: '#8B5CF6',
  implementation: '#10B981',
  quality: '#F59E0B',
};

const STAGE_NAMES: Record<PipelineStage, string> = {
  management: 'Management',
  research: 'Research',
  implementation: 'Implementation',
  quality: 'Quality',
};

interface ColumnProps {
  stage: PipelineStage;
  items: WorkItem[];
}

export function Column({ stage, items }: ColumnProps) {
  return (
    <div className="kanban-column">
      <div
        className="kanban-column-header"
        style={{ borderColor: STAGE_COLORS[stage] }}
      >
        <h3>{STAGE_NAMES[stage]}</h3>
        <span className="kanban-column-count">{items.length}</span>
      </div>
      <div className="kanban-column-cards">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
