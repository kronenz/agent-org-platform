import React from 'react';
import type { WorkItem, PipelineStage } from '../../hooks/useWorkItems';

interface StatsBarProps {
  items: WorkItem[];
}

const STAGE_COLORS: Record<PipelineStage, string> = {
  management: '#3B82F6',
  research: '#8B5CF6',
  implementation: '#10B981',
  quality: '#F59E0B',
};

export function StatsBar({ items }: StatsBarProps) {
  const total = items.length;
  const byStage = {
    management: items.filter((i) => i.stage === 'management').length,
    research: items.filter((i) => i.stage === 'research').length,
    implementation: items.filter((i) => i.stage === 'implementation').length,
    quality: items.filter((i) => i.stage === 'quality').length,
  };
  const needHuman = items.filter((i) => i.needHuman).length;
  const prCount = items.filter((i) => i.type === 'pr').length;
  const issueCount = items.filter((i) => i.type === 'issue').length;

  return (
    <div style={{
      padding: '10px 16px',
      borderTop: '1px solid #21262d',
      background: '#0d1117',
      display: 'flex',
      gap: 24,
      fontSize: 12,
      color: '#8b949e',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>Total:</span>
        <span style={{ fontWeight: 600, color: '#e6edf3' }}>{total}</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Pipeline:</span>
        {(['management', 'research', 'implementation', 'quality'] as PipelineStage[]).map((stage) => (
          <span
            key={stage}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              background: STAGE_COLORS[stage] + '20',
              color: STAGE_COLORS[stage],
              fontWeight: 500,
            }}
          >
            {stage.charAt(0).toUpperCase()}:{byStage[stage]}
          </span>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          padding: '2px 8px',
          borderRadius: 4,
          background: '#23863620',
          color: '#238636',
        }}>
          {prCount} PRs
        </span>
        <span style={{
          padding: '2px 8px',
          borderRadius: 4,
          background: '#1f6feb20',
          color: '#1f6feb',
        }}>
          {issueCount} Issues
        </span>
      </div>
      
      {needHuman > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginLeft: 'auto',
        }}>
          <span style={{
            padding: '2px 10px',
            borderRadius: 4,
            background: '#EF444420',
            color: '#EF4444',
            fontWeight: 600,
            border: '1px solid #EF444450',
          }}>
            ⚠ {needHuman} needs human attention
          </span>
        </div>
      )}
    </div>
  );
}
