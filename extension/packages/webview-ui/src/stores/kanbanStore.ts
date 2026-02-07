import { create } from 'zustand';
import type { PipelineStage, WorkItem } from '../hooks/useWorkItems';

interface KanbanFilters {
  stages: PipelineStage[];
  needHumanOnly: boolean;
  assignee: string | null;
}

interface KanbanStore {
  filters: KanbanFilters;
  syncStatus: 'idle' | 'syncing' | 'error';
  setFilters: (filters: Partial<KanbanFilters>) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'error') => void;
  clearFilters: () => void;
}

const defaultFilters: KanbanFilters = {
  stages: [],
  needHumanOnly: false,
  assignee: null,
};

export const useKanbanStore = create<KanbanStore>((set) => ({
  filters: defaultFilters,
  syncStatus: 'idle',
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  setSyncStatus: (status) => set({ syncStatus: status }),
  clearFilters: () => set({ filters: defaultFilters }),
}));

export function filterItems(items: WorkItem[], filters: KanbanFilters): WorkItem[] {
  return items.filter((item) => {
    if (filters.stages.length > 0 && !filters.stages.includes(item.stage)) {
      return false;
    }
    if (filters.needHumanOnly && !item.needHuman) {
      return false;
    }
    if (filters.assignee && item.assignee !== filters.assignee) {
      return false;
    }
    return true;
  });
}

export const useKanbanFilters = () => useKanbanStore((state) => state.filters);
export const useSyncStatus = () => useKanbanStore((state) => state.syncStatus);
