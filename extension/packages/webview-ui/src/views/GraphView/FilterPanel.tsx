import React from 'react';
import { useGraphStore, useFilters } from '../../stores/graphStore';
import type { GraphNode } from '../../hooks/useGraphData';

const TYPES = ['moc', 'concept', 'project', 'resource'] as const;
const STATUSES = ['draft', 'review', 'published'] as const;

interface FilterPanelProps {
  nodes: GraphNode[];
}

export function FilterPanel({ nodes }: FilterPanelProps) {
  const { setFilters, clearFilters } = useGraphStore();
  const filters = useFilters();

  const domains = [...new Set(nodes.map((n) => n.domain).filter(Boolean))] as string[];

  const toggleFilter = (category: 'types' | 'statuses' | 'domains', value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ [category]: updated });
  };

  const hasActiveFilters =
    filters.types.length > 0 || filters.statuses.length > 0 || filters.domains.length > 0;

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <span className="filter-group-label">Type</span>
        <div className="filter-options">
          {TYPES.map((type) => (
            <label key={type} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => toggleFilter('types', type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-label">Status</span>
        <div className="filter-options">
          {STATUSES.map((status) => (
            <label key={status} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.statuses.includes(status)}
                onChange={() => toggleFilter('statuses', status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {domains.length > 0 && (
        <div className="filter-group">
          <span className="filter-group-label">Domain</span>
          <div className="filter-options">
            {domains.map((domain) => (
              <label key={domain} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.domains.includes(domain)}
                  onChange={() => toggleFilter('domains', domain)}
                />
                {domain}
              </label>
            ))}
          </div>
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
