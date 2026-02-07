import React, { useMemo } from 'react';
import { Layout } from '../../components/Layout';
import { Board } from './Board';
import { FilterBar } from './FilterBar';
import { StatsBar } from './StatsBar';
import { useWorkItems } from '../../hooks/useWorkItems';
import { useKanbanFilters, filterItems } from '../../stores/kanbanStore';

export function KanbanView() {
  const { items, loading, error } = useWorkItems();
  const filters = useKanbanFilters();

  const filteredItems = useMemo(() => {
    return filterItems(items, filters);
  }, [items, filters]);

  if (loading) {
    return (
      <Layout title="Pipeline Kanban">
        <div className="loading">Loading work items...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Pipeline Kanban">
        <div className="loading">Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout title="Pipeline Kanban">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <FilterBar items={items} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Board items={filteredItems} />
        </div>
        <StatsBar items={items} />
      </div>
    </Layout>
  );
}
