import React from 'react';
import { postMessage } from '../../hooks/useVsCodeApi';
import type { WorkItem, PipelineStage, Priority } from '../../hooks/useWorkItems';

interface CardDetailPanelProps {
  item: WorkItem;
  onClose: () => void;
}

const STAGE_CONFIG: Record<PipelineStage, { color: string; icon: string; label: string }> = {
  management: { color: '#3B82F6', icon: '◆', label: 'Management' },
  research: { color: '#8B5CF6', icon: '◉', label: 'Research' },
  implementation: { color: '#10B981', icon: '⚙', label: 'Implementation' },
  quality: { color: '#F59E0B', icon: '✓', label: 'Quality' },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string; description: string }> = {
  P0: { color: '#EF4444', label: 'Critical', description: 'Immediate action required' },
  P1: { color: '#F59E0B', label: 'High', description: 'Should be addressed soon' },
  P2: { color: '#3B82F6', label: 'Medium', description: 'Normal priority' },
  P3: { color: '#6B7280', label: 'Low', description: 'Can be addressed later' },
};

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return 'Just now';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CardDetailPanel({ item, onClose }: CardDetailPanelProps) {
  const stageConfig = STAGE_CONFIG[item.stage];
  const priorityConfig = item.priority ? PRIORITY_CONFIG[item.priority] : null;
  
  const handleOpenGitHub = () => {
    if (item.url && item.url !== '#') {
      postMessage({ type: 'openUrl', url: item.url });
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderLeft: `2px solid ${stageConfig.color}`,
      background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        padding: '16px',
        background: `linear-gradient(135deg, ${stageConfig.color}15 0%, transparent 60%)`,
        borderBottom: '1px solid #30363d',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: item.type === 'pr' ? '#23863640' : '#1f6feb40',
              border: `1px solid ${item.type === 'pr' ? '#238636' : '#1f6feb'}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: item.type === 'pr' ? '#238636' : '#1f6feb',
            }}>
              {item.type === 'pr' ? '⎇' : '○'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: 11, 
                color: '#8b949e',
                marginBottom: 2,
              }}>
                #{item.number} · {item.type === 'pr' ? 'Pull Request' : 'Issue'}
              </div>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: '#e6edf3',
              }}>
                {item.title}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b949e',
              cursor: 'pointer',
              fontSize: 18,
              padding: 4,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginTop: 12,
          flexWrap: 'wrap',
        }}>
          {priorityConfig && (
            <span style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: priorityConfig.color + '20',
              color: priorityConfig.color,
              border: `1px solid ${priorityConfig.color}50`,
            }}>
              {item.priority} {priorityConfig.label}
            </span>
          )}
          
          <span style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            background: stageConfig.color + '20',
            color: stageConfig.color,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            {stageConfig.icon} {stageConfig.label}
          </span>
          
          {item.needHuman && (
            <span style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: '#EF444420',
              color: '#EF4444',
              border: '1px solid #EF444450',
            }}>
              ⚠ Needs Human
            </span>
          )}
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '16px',
      }}>
        {item.description && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ 
              fontSize: 11, 
              color: '#8b949e', 
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Description
            </div>
            <div style={{
              fontSize: 13,
              color: '#c9d1d9',
              lineHeight: 1.6,
              padding: 12,
              background: '#21262d',
              borderRadius: 8,
              border: '1px solid #30363d',
            }}>
              {item.description}
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: 20 }}>
          <div style={{ 
            fontSize: 11, 
            color: '#8b949e', 
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Details
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}>
            <div style={{
              padding: 12,
              background: '#21262d',
              borderRadius: 8,
              border: '1px solid #30363d',
            }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4 }}>Assignee</div>
              <div style={{ fontSize: 13, color: '#e6edf3', fontWeight: 500 }}>
                {item.assignee ? `@${item.assignee}` : 'Unassigned'}
              </div>
            </div>
            
            <div style={{
              padding: 12,
              background: '#21262d',
              borderRadius: 8,
              border: '1px solid #30363d',
            }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4 }}>Created</div>
              <div style={{ fontSize: 13, color: '#e6edf3', fontWeight: 500 }}>
                {formatDate(item.createdAt)}
              </div>
            </div>
            
            <div style={{
              padding: 12,
              background: '#21262d',
              borderRadius: 8,
              border: '1px solid #30363d',
            }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4 }}>In Stage</div>
              <div style={{ fontSize: 13, color: stageConfig.color, fontWeight: 500 }}>
                {formatTimeAgo(item.stageEnteredAt)}
              </div>
            </div>
            
            {priorityConfig && (
              <div style={{
                padding: 12,
                background: '#21262d',
                borderRadius: 8,
                border: '1px solid #30363d',
              }}>
                <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 4 }}>Priority</div>
                <div style={{ fontSize: 13, color: priorityConfig.color, fontWeight: 500 }}>
                  {priorityConfig.description}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {item.labels.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ 
              fontSize: 11, 
              color: '#8b949e', 
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Labels
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}>
              {item.labels.map((label) => (
                <span
                  key={label}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    background: '#30363d',
                    color: '#e6edf3',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div style={{
          padding: 12,
          background: stageConfig.color + '10',
          borderRadius: 8,
          border: `1px solid ${stageConfig.color}30`,
        }}>
          <div style={{ 
            fontSize: 11, 
            color: '#8b949e', 
            marginBottom: 8,
          }}>
            Pipeline Position
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {(['management', 'research', 'implementation', 'quality'] as PipelineStage[]).map((stage, idx) => {
              const config = STAGE_CONFIG[stage];
              const isCurrent = stage === item.stage;
              const isPast = ['management', 'research', 'implementation', 'quality'].indexOf(stage) < 
                            ['management', 'research', 'implementation', 'quality'].indexOf(item.stage);
              
              return (
                <React.Fragment key={stage}>
                  {idx > 0 && (
                    <div style={{ 
                      width: 20, 
                      height: 2, 
                      background: isPast ? config.color : '#30363d',
                    }} />
                  )}
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isCurrent ? config.color : (isPast ? config.color + '40' : '#21262d'),
                    border: `2px solid ${isCurrent ? config.color : (isPast ? config.color : '#30363d')}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: isCurrent ? '#fff' : (isPast ? config.color : '#6e7681'),
                  }}>
                    {config.icon}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #30363d',
        display: 'flex',
        gap: 8,
      }}>
        <button
          onClick={handleOpenGitHub}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #30363d',
            background: '#21262d',
            color: '#e6edf3',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Open in GitHub
        </button>
      </div>
    </div>
  );
}
