import React from 'react';
import { postMessage } from '../../hooks/useVsCodeApi';
import type { WorkItem } from '../../hooks/useWorkItems';

interface CardProps {
  item: WorkItem;
}

export function Card({ item }: CardProps) {
  const handleClick = () => {
    postMessage({ type: 'openUrl', url: item.url });
  };

  const typeIcon = item.type === 'pr' ? '⎇' : '○';

  return (
    <div
      className={`kanban-card ${item.needHuman ? 'need-human' : ''}`}
      onClick={handleClick}
    >
      <div className="kanban-card-title">{item.title}</div>
      <div className="kanban-card-meta">
        <span>{typeIcon} #{item.number}</span>
        {item.assignee && <span>@{item.assignee}</span>}
      </div>
      {item.labels.length > 0 && (
        <div className="kanban-card-labels">
          {item.labels.map((label) => (
            <span key={label} className="label-badge">{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
