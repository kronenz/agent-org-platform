import React from 'react';
import { GraphView } from './views/GraphView';
import { KanbanView } from './views/KanbanView';

type ViewType = 'graph' | 'kanban';

function getViewType(): ViewType {
  const root = document.getElementById('root');
  const viewType = root?.getAttribute('data-view-type') as ViewType | null;
  return viewType || 'graph';
}

export function App() {
  const viewType = getViewType();

  switch (viewType) {
    case 'kanban':
      return <KanbanView />;
    case 'graph':
    default:
      return <GraphView />;
  }
}
