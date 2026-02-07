import { create } from 'zustand';

interface Filters {
  types: string[];
  statuses: string[];
  domains: string[];
}

interface GraphStore {
  selectedNodeId: string | null;
  filters: Filters;
  selectNode: (id: string | null) => void;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
}

const defaultFilters: Filters = {
  types: [],
  statuses: [],
  domains: [],
};

export const useGraphStore = create<GraphStore>((set) => ({
  selectedNodeId: null,
  filters: defaultFilters,
  selectNode: (id) => set({ selectedNodeId: id }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
}));

export const useSelectedNode = () => useGraphStore((state) => state.selectedNodeId);
export const useFilters = () => useGraphStore((state) => state.filters);
