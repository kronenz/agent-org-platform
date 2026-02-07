import React from 'react';
import type { WorkItem } from '../../hooks/useWorkItems';

interface StatsBarProps {
  items: WorkItem[];
}

export function StatsBar({ items }: StatsBarProps) {
  const total = items.length;
  const byStage = {
    management: items.filter((i) => i.stage === 'management').length,
    research: items.filter((i) => i.stage === 'research').length,
    implementation: items.filter((i) => i.stage === 'implementation').length,
    quality: items.filter((i) => i.stage === 'quality').length,
  };
  const needHuman = items.filter((i) => i.needHuman).length;

  return (
    <div className="stats-bar">
      <div className="stats-item">
        Total: <span className="stats-value">{total}</span>
      </div>
      <div className="stats-item">
        WIP: <span className="stats-value">
          M:{byStage.management} R:{byStage.research} I:{byStage.implementation} Q:{byStage.quality}
        </span>
      </div>
      <div className="stats-item">
        Need Human: <span className="stats-value" style={{ color: needHuman > 0 ? '#EF4444' : undefined }}>
          {needHuman}
        </span>
      </div>
    </div>
  );
}
