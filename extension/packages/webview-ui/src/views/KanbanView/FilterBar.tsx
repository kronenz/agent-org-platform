import React from 'react';
import { useKanbanStore, useKanbanFilters } from '../../stores/kanbanStore';
import type { PipelineStage, WorkItem } from '../../hooks/useWorkItems';

const STAGES: { value: PipelineStage; label: string }[] = [
  { value: 'management', label: 'Management' },
  { value: 'research', label: 'Research' },
  { value: 'implementation', label: 'Implementation' },
  { value: 'quality', label: 'Quality' },
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
    <div className="filter-panel">
      <div className="filter-group">
        <span className="filter-group-label">Stage</span>
        <div className="filter-options">
          {STAGES.map(({ value, label }) => (
            <label key={value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.stages.includes(value)}
                onChange={() => toggleStage(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-label">Priority</span>
        <div className="filter-options">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.needHumanOnly}
              onChange={() => setFilters({ needHumanOnly: !filters.needHumanOnly })}
            />
            Need Human Only
          </label>
        </div>
      </div>

      {assignees.length > 0 && (
        <div className="filter-group">
          <span className="filter-group-label">Assignee</span>
          <select
            value={filters.assignee || ''}
            onChange={(e) => setFilters({ assignee: e.target.value || null })}
            style={{
              background: 'var(--vscode-input-background)',
              color: 'var(--vscode-input-foreground)',
              border: '1px solid var(--vscode-input-border)',
              padding: '4px 8px',
              borderRadius: 4,
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
        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear
        </button>
      )}
    </div>
  );
}
