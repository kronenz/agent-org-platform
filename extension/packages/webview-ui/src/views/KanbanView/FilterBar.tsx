import React from 'react';
import { useKanbanStore, useKanbanFilters } from '../../stores/kanbanStore';
import type { PipelineStage, WorkItem } from '../../hooks/useWorkItems';

const STAGE_CONFIG: { value: PipelineStage; label: string; color: string }[] = [
  { value: 'management', label: 'Management', color: '#3B82F6' },
  { value: 'research', label: 'Research', color: '#8B5CF6' },
  { value: 'implementation', label: 'Implementation', color: '#10B981' },
  { value: 'quality', label: 'Quality', color: '#F59E0B' },
];

interface FilterBarProps {
  items: WorkItem[];
}

export function FilterBar({ items }: FilterBarProps) {
  const { setFilters, clearFilters } = useKanbanStore();
  const filters = useKanbanFilters();

  const assignees = [...new Set(items.map((i) => i.assignee).filter(Boolean))] as string[];

  const toggleStage = (stage: PipelineStage) => {
    const current = filters.stages;
    const updated = current.includes(stage)
      ? current.filter((s) => s !== stage)
      : [...current, stage];
    setFilters({ stages: updated });
  };

  const hasActiveFilters =
    filters.stages.length > 0 || filters.needHumanOnly || filters.assignee !== null;

  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid #21262d',
      background: '#0d1117',
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase' }}>Stage</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {STAGE_CONFIG.map(({ value, label, color }) => {
            const isActive = filters.stages.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleStage(value)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${isActive ? color : '#30363d'}`,
                  background: isActive ? color + '25' : 'transparent',
                  color: isActive ? color : '#8b949e',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setFilters({ needHumanOnly: !filters.needHumanOnly })}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: `1px solid ${filters.needHumanOnly ? '#EF4444' : '#30363d'}`,
            background: filters.needHumanOnly ? '#EF444425' : 'transparent',
            color: filters.needHumanOnly ? '#EF4444' : '#8b949e',
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ⚠ Need Human Only
        </button>
      </div>

      {assignees.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase' }}>Assignee</span>
          <select
            value={filters.assignee || ''}
            onChange={(e) => setFilters({ assignee: e.target.value || null })}
            style={{
              background: '#161b22',
              color: '#e6edf3',
              border: '1px solid #30363d',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <option value="">All</option>
            {assignees.map((a) => (
              <option key={a} value={a}>@{a}</option>
            ))}
          </select>
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #30363d',
            background: 'transparent',
            color: '#8b949e',
            fontSize: 12,
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
