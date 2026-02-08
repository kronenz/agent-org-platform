import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Board } from './Board';
import { FilterBar } from './FilterBar';
import { StatsBar } from './StatsBar';
import { CardDetailPanel } from './CardDetailPanel';
import { useWorkItems, WorkItem } from '../../hooks/useWorkItems';
import { useKanbanFilters, filterItems } from '../../stores/kanbanStore';

export function KanbanView() {
  const { items, loading, error } = useWorkItems();
  const filters = useKanbanFilters();
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const filteredItems = useMemo(() => {
    return filterItems(items, filters);
  }, [items, filters]);

  const handleSelectItem = useCallback((item: WorkItem) => {
    setSelectedItem(prev => prev?.id === item.id ? null : item);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0d1117',
        color: '#8b949e',
      }}>
        Loading work items...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 20,
        background: '#0d1117',
        color: '#f87171',
        minHeight: '100vh',
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0d1117',
      color: '#e6edf3',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #21262d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Pipeline Kanban</span>
          <span style={{ fontSize: 12, color: '#8b949e' }}>
            {filteredItems.length} of {items.length} items
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          color: '#6e7681',
        }}>
          <span>◆ Management</span>
          <span>→</span>
          <span>◉ Research</span>
          <span>→</span>
          <span>⚙ Implementation</span>
          <span>→</span>
          <span>✓ Quality</span>
        </div>
      </div>
      
      <FilterBar items={items} />
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Board 
            items={filteredItems}
            selectedItemId={selectedItem?.id ?? null}
            onSelectItem={handleSelectItem}
          />
        </div>
        
        {selectedItem && (
          <div style={{
            width: 360,
            flexShrink: 0,
            height: '100%',
            zIndex: 20,
          }}>
            <CardDetailPanel
              item={selectedItem}
              onClose={handleClosePanel}
            />
          </div>
        )}
      </div>
      
      <StatsBar items={items} />
    </div>
  );
}
