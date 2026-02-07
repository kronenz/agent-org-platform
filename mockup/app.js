document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const graphNodes = [
    { id: 'ops', label: 'Operations MOC', type: 'moc', status: 'published', x: 400, y: 100, domain: 'operations' },
    { id: 'pipeline', label: 'Pipeline Model', type: 'concept', status: 'published', x: 300, y: 200, domain: 'operations' },
    { id: 'handoff', label: 'Handoff Rules', type: 'concept', status: 'review', x: 500, y: 200, domain: 'operations' },
    { id: 'team', label: 'Team Structure', type: 'project', status: 'published', x: 200, y: 300, domain: 'organization' },
    { id: 'roles', label: 'Role Definitions', type: 'resource', status: 'draft', x: 400, y: 300, domain: 'organization' },
    { id: 'strategy', label: 'Strategy MOC', type: 'moc', status: 'published', x: 600, y: 100, domain: 'strategy' },
    { id: 'goals', label: 'Q1 Goals', type: 'project', status: 'published', x: 550, y: 280, domain: 'strategy' },
    { id: 'metrics', label: 'Success Metrics', type: 'resource', status: 'review', x: 700, y: 200, domain: 'strategy' }
  ];

  const graphEdges = [
    { source: 'ops', target: 'pipeline', type: 'parent' },
    { source: 'ops', target: 'handoff', type: 'parent' },
    { source: 'pipeline', target: 'team', type: 'related' },
    { source: 'pipeline', target: 'roles', type: 'related' },
    { source: 'strategy', target: 'goals', type: 'parent' },
    { source: 'strategy', target: 'metrics', type: 'parent' },
    { source: 'handoff', target: 'roles', type: 'related' }
  ];

  const typeColors = {
    moc: '#8B5CF6',
    concept: '#3B82F6',
    project: '#22C55E',
    resource: '#F59E0B'
  };

  const stageColors = {
    management: '#8B5CF6',
    research: '#3B82F6',
    implementation: '#22C55E',
    quality: '#F59E0B'
  };

  const kanbanItems = [
    { id: 1, number: '#42', title: 'Define agent handoff protocol', stage: 'management', type: 'issue', assignee: 'agent-pm', labels: ['priority:p1'], needHuman: false },
    { id: 2, number: '#38', title: 'Research semantic search options', stage: 'research', type: 'issue', assignee: 'agent-researcher', labels: ['research'], needHuman: false },
    { id: 3, number: '#35', title: 'Implement graph indexer', stage: 'implementation', type: 'pr', assignee: 'agent-dev', labels: ['feature'], needHuman: false },
    { id: 4, number: '#41', title: 'Review architecture decision', stage: 'management', type: 'issue', assignee: 'human-lead', labels: ['priority:p0', 'need:human'], needHuman: true },
    { id: 5, number: '#39', title: 'Approve budget allocation', stage: 'quality', type: 'issue', assignee: null, labels: ['approval', 'need:human'], needHuman: true },
    { id: 6, number: '#36', title: 'QA: Dashboard components', stage: 'quality', type: 'issue', assignee: 'agent-qa', labels: ['testing'], needHuman: false },
    { id: 7, number: '#33', title: 'Knowledge graph MVP', stage: 'implementation', type: 'pr', assignee: 'agent-dev', labels: ['feature', 'mvp'], needHuman: false },
    { id: 8, number: '#40', title: 'Security review for API', stage: 'research', type: 'issue', assignee: null, labels: ['security', 'need:human'], needHuman: true }
  ];

  const queueItems = [
    {
      id: 1,
      title: 'Approve Q1 Budget Allocation',
      type: 'approval',
      priority: 'p0',
      stage: 'Management',
      waitTime: '2h 15m',
      requestedBy: 'agent-pm',
      linkedIssue: { number: '#39', title: 'Budget approval for infrastructure' },
      linkedArtifact: { path: 'vault/finance/q1-budget', title: 'Q1 Budget Proposal' }
    },
    {
      id: 2,
      title: 'Review Architecture Decision: Event Sourcing',
      type: 'review',
      priority: 'p1',
      stage: 'Research',
      waitTime: '45m',
      requestedBy: 'agent-architect',
      linkedPR: { number: 'PR #41', title: 'RFC: Event sourcing implementation' },
      linkedArtifact: { path: 'vault/tech/event-sourcing-rfc', title: 'Event Sourcing RFC' }
    },
    {
      id: 3,
      title: 'Security Exception: External API Access',
      type: 'decision',
      priority: 'p1',
      stage: 'Quality',
      waitTime: '1h 30m',
      requestedBy: 'agent-security',
      linkedIssue: { number: '#40', title: 'Security review for external API' }
    }
  ];

  const documents = [
    {
      id: 'pipeline-model',
      title: 'Pipeline Model',
      path: 'vault/operations/pipeline-model',
      type: 'concept',
      status: 'published',
      folder: 'operations',
      content: `# Pipeline Model

The organization operates on a 4-stage pipeline that ensures quality and accountability at every step.

## Stages

### 1. Management Stage
The entry point for all work items. Here, requests are triaged, prioritized, and assigned.

- **Owner**: Management Team
- **Color**: Violet (#8B5CF6)
- **Outputs**: Prioritized backlog, resource allocation

### 2. Research Stage
Deep investigation and analysis before implementation begins.

- **Owner**: Research Team
- **Color**: Blue (#3B82F6)
- **Outputs**: Technical specs, feasibility reports

### 3. Implementation Stage
Where the actual work gets done. Code, content, or deliverables are created.

- **Owner**: Implementation Team
- **Color**: Green (#22C55E)
- **Outputs**: Working software, documentation

### 4. Quality Stage
Final verification before release. Testing, review, and approval.

- **Owner**: Quality Team
- **Color**: Amber (#F59E0B)
- **Outputs**: Approved releases, audit logs

## Handoff Rules

Each transition between stages requires explicit handoff:

1. Clear deliverables documented
2. Acceptance criteria met
3. Receiving team acknowledgment

> **Note**: Any stage can flag an item as "need:human" to require manual intervention.
`
    },
    {
      id: 'handoff-rules',
      title: 'Handoff Rules',
      path: 'vault/operations/handoff-rules',
      type: 'concept',
      status: 'review',
      folder: 'operations',
      content: `# Handoff Rules

Strict protocols for transitioning work between pipeline stages.

## Core Principles

1. **Explicit Handoff**: No silent transitions
2. **Documentation Required**: Every handoff must be documented
3. **Acceptance Check**: Receiving team must acknowledge

## Transition Matrix

| From | To | Required |
|------|-----|----------|
| Management | Research | Scope document, priority level |
| Research | Implementation | Technical spec, acceptance criteria |
| Implementation | Quality | Test plan, demo |
| Quality | Done | Sign-off, release notes |

## Human Gates

Certain transitions require human approval:

- P0 priority items
- Security-sensitive changes
- Budget-impacting decisions
- External-facing releases
`
    },
    {
      id: 'team-structure',
      title: 'Team Structure',
      path: 'vault/organization/team-structure',
      type: 'project',
      status: 'published',
      folder: 'organization',
      content: `# Team Structure

How teams are organized around the pipeline model.

## Team Composition

Each pipeline stage has a dedicated team with both human and AI members.

### Management Team
- 1 Human Lead (decisions, approvals)
- 2 AI Agents (triage, scheduling)

### Research Team
- 1 Human Analyst (complex research)
- 3 AI Agents (data gathering, synthesis)

### Implementation Team
- 2 Human Developers (architecture, review)
- 4 AI Agents (coding, testing)

### Quality Team
- 1 Human QA Lead (final approval)
- 2 AI Agents (automated testing, monitoring)

## Communication

- Async by default
- Sync meetings only for blockers
- All decisions logged to knowledge base
`
    },
    {
      id: 'role-definitions',
      title: 'Role Definitions',
      path: 'vault/organization/role-definitions',
      type: 'resource',
      status: 'draft',
      folder: 'organization',
      content: `# Role Definitions

*This document is a draft and subject to change.*

## Human Roles

### Human Lead
- Strategic decisions
- Budget approval
- Conflict resolution
- External representation

### Human Specialist
- Domain expertise
- Quality gates
- Training AI agents
- Exception handling

## AI Agent Roles

### Agent PM
- Backlog management
- Status reporting
- Scheduling
- Stakeholder updates

### Agent Developer
- Code implementation
- Test writing
- Documentation
- Bug fixes

### Agent Researcher
- Information gathering
- Analysis
- Report generation
- Trend monitoring
`
    }
  ];

  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.dataset.view;
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      views.forEach(view => {
        view.classList.remove('active');
        if (view.id === `view-${viewId}`) {
          view.classList.add('active');
        }
      });
      lucide.createIcons();
    });
  });

  function renderGraph() {
    const edgesGroup = document.getElementById('graph-edges');
    const nodesGroup = document.getElementById('graph-nodes');
    
    if (!edgesGroup || !nodesGroup) return;

    edgesGroup.innerHTML = '';
    nodesGroup.innerHTML = '';

    graphEdges.forEach(edge => {
      const source = graphNodes.find(n => n.id === edge.source);
      const target = graphNodes.find(n => n.id === edge.target);
      if (source && target) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', source.x);
        line.setAttribute('y1', source.y);
        line.setAttribute('x2', target.x);
        line.setAttribute('y2', target.y);
        line.setAttribute('class', `edge ${edge.type}`);
        line.setAttribute('marker-end', 'url(#arrowhead)');
        edgesGroup.appendChild(line);
      }
    });

    graphNodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node');
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
      g.setAttribute('data-id', node.id);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', node.type === 'moc' ? 20 : 14);
      circle.setAttribute('fill', typeColors[node.type]);
      g.appendChild(circle);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('dy', node.type === 'moc' ? 35 : 28);
      text.textContent = node.label;
      g.appendChild(text);

      g.addEventListener('click', () => showNodeDetail(node));
      g.addEventListener('mouseenter', (e) => showTooltip(e, node));
      g.addEventListener('mouseleave', hideTooltip);

      nodesGroup.appendChild(g);
    });
  }

  function showNodeDetail(node) {
    const sidebar = document.getElementById('detail-sidebar');
    const content = document.getElementById('detail-content');
    if (!sidebar || !content) return;

    const incomingLinks = graphEdges.filter(e => e.target === node.id).map(e => graphNodes.find(n => n.id === e.source));
    const outgoingLinks = graphEdges.filter(e => e.source === node.id).map(e => graphNodes.find(n => n.id === e.target));

    content.innerHTML = `
      <div class="node-detail">
        <div class="node-icon" style="background: ${typeColors[node.type]}">
          <i data-lucide="file-text"></i>
        </div>
        <h3 class="node-title">${node.label}</h3>
        <span class="status-badge status-${node.status}">${node.status}</span>
      </div>
      <dl class="node-meta">
        <dt>Type</dt>
        <dd><span class="type-dot" style="background: ${typeColors[node.type]}"></span> ${node.type}</dd>
        <dt>Domain</dt>
        <dd>${node.domain}</dd>
        <dt>Path</dt>
        <dd style="font-family: var(--font-mono); font-size: 12px;">vault/${node.domain}/${node.id}</dd>
      </dl>
      ${incomingLinks.length > 0 ? `
      <div class="node-links">
        <h4><i data-lucide="arrow-down-left"></i> Incoming Links</h4>
        <ul>
          ${incomingLinks.map(n => `<li><i data-lucide="file-text" class="incoming"></i> ${n.label}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${outgoingLinks.length > 0 ? `
      <div class="node-links">
        <h4><i data-lucide="arrow-up-right"></i> Outgoing Links</h4>
        <ul>
          ${outgoingLinks.map(n => `<li><i data-lucide="file-text" class="outgoing"></i> ${n.label}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      <div class="node-actions">
        <button class="btn btn-secondary" onclick="openDocModal('${node.id}')"><i data-lucide="eye"></i> View</button>
        <button class="btn btn-primary"><i data-lucide="external-link"></i> Open</button>
      </div>
    `;

    sidebar.classList.add('open');
    lucide.createIcons();
  }

  document.getElementById('close-detail')?.addEventListener('click', () => {
    document.getElementById('detail-sidebar')?.classList.remove('open');
  });

  const tooltip = document.getElementById('graph-tooltip');

  function showTooltip(e, node) {
    if (!tooltip) return;
    tooltip.textContent = `${node.label} (${node.type})`;
    tooltip.style.left = (e.clientX + 10) + 'px';
    tooltip.style.top = (e.clientY + 10) + 'px';
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip?.classList.remove('visible');
  }

  function renderKanban() {
    const board = document.getElementById('kanban-board');
    if (!board) return;

    const stages = ['management', 'research', 'implementation', 'quality'];
    const stageNames = {
      management: 'Management',
      research: 'Research',
      implementation: 'Implementation',
      quality: 'Quality'
    };

    board.innerHTML = stages.map(stage => {
      const items = kanbanItems.filter(item => item.stage === stage);
      return `
        <div class="kanban-column">
          <div class="column-header">
            <span class="column-dot" style="background: ${stageColors[stage]}"></span>
            <span class="column-title">${stageNames[stage]}</span>
            <span class="column-count">${items.length}</span>
            <button class="column-add"><i data-lucide="plus"></i></button>
          </div>
          <div class="column-cards">
            ${items.map(item => `
              <div class="kanban-card${item.needHuman ? ' need-human' : ''}">
                <div class="card-header">
                  <i data-lucide="${item.type === 'pr' ? 'git-pull-request' : 'circle-dot'}" class="icon-${item.type === 'pr' ? 'pr' : 'issue'}"></i>
                  <span class="card-number">${item.number}</span>
                  <button class="card-menu"><i data-lucide="more-horizontal"></i></button>
                </div>
                <h4 class="card-title">${item.title}</h4>
                <div class="card-labels">
                  ${item.labels.map(label => `<span class="label">${label}</span>`).join('')}
                </div>
                <div class="card-footer">
                  ${item.assignee ? `<span class="assignee"><i data-lucide="user"></i> ${item.assignee}</span>` : '<span></span>'}
                  ${item.needHuman ? `<span class="need-human-badge"><i data-lucide="user-check"></i> Need Human</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  function renderQueue() {
    const list = document.getElementById('queue-list');
    if (!list) return;

    const typeIcons = {
      approval: 'check-circle',
      review: 'eye',
      decision: 'help-circle'
    };

    list.innerHTML = queueItems.map(item => `
      <article class="queue-item">
        <div class="item-header">
          <div class="item-type" style="color: ${item.priority === 'p0' ? '#991B1B' : '#92400E'}">
            <i data-lucide="${typeIcons[item.type]}"></i>
          </div>
          <div class="item-info">
            <h3 class="item-title">${item.title}</h3>
            <div class="item-meta">
              <span class="type-badge">${item.type}</span>
              <span class="priority-badge ${item.priority}">${item.priority.toUpperCase()}</span>
              <span class="stage-badge">${item.stage}</span>
              <span class="wait-time"><i data-lucide="clock"></i> ${item.waitTime}</span>
            </div>
          </div>
          <i data-lucide="chevron-right" class="item-chevron"></i>
        </div>
        <div class="linked-items">
          ${item.linkedIssue ? `
            <a href="#" class="linked-item">
              <i data-lucide="circle-dot" class="linked-icon issue"></i>
              <span class="linked-number">${item.linkedIssue.number}</span>
              <span class="linked-title">${item.linkedIssue.title}</span>
              <i data-lucide="external-link" class="external-icon"></i>
            </a>
          ` : ''}
          ${item.linkedPR ? `
            <a href="#" class="linked-item">
              <i data-lucide="git-pull-request" class="linked-icon pr"></i>
              <span class="linked-number">${item.linkedPR.number}</span>
              <span class="linked-title">${item.linkedPR.title}</span>
              <i data-lucide="external-link" class="external-icon"></i>
            </a>
          ` : ''}
          ${item.linkedArtifact ? `
            <a href="#" class="linked-item">
              <i data-lucide="file-text" class="linked-icon artifact"></i>
              <span class="linked-title">${item.linkedArtifact.title}</span>
              <i data-lucide="external-link" class="external-icon"></i>
            </a>
          ` : ''}
        </div>
        <div class="item-actions">
          <span class="requested-by">Requested by <strong>${item.requestedBy}</strong></span>
          <div class="action-buttons">
            <button class="btn btn-danger"><i data-lucide="x"></i> Reject</button>
            <button class="btn btn-success"><i data-lucide="check"></i> Approve</button>
          </div>
        </div>
      </article>
    `).join('');

    lucide.createIcons();
  }

  function renderDocsTree() {
    const tree = document.getElementById('docs-tree');
    if (!tree) return;

    const folders = {};
    documents.forEach(doc => {
      if (!folders[doc.folder]) folders[doc.folder] = [];
      folders[doc.folder].push(doc);
    });

    tree.innerHTML = Object.entries(folders).map(([folder, docs]) => `
      <div class="tree-folder expanded">
        <div class="tree-folder-header">
          <i data-lucide="chevron-right" class="folder-chevron"></i>
          <i data-lucide="folder"></i>
          <span>${folder}</span>
        </div>
        <div class="tree-files">
          ${docs.map(doc => `
            <button class="tree-file${doc.id === 'pipeline-model' ? ' active' : ''}" data-doc="${doc.id}">
              <i data-lucide="file-text"></i>
              <span>${doc.title}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');

    tree.querySelectorAll('.tree-folder-header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('expanded');
      });
    });

    tree.querySelectorAll('.tree-file').forEach(file => {
      file.addEventListener('click', () => {
        tree.querySelectorAll('.tree-file').forEach(f => f.classList.remove('active'));
        file.classList.add('active');
        const doc = documents.find(d => d.id === file.dataset.doc);
        if (doc) renderDocument(doc);
      });
    });

    lucide.createIcons();

    const firstDoc = documents[0];
    if (firstDoc) renderDocument(firstDoc);
  }

  function renderDocument(doc) {
    const contentEl = document.getElementById('markdown-content');
    const breadcrumb = document.getElementById('doc-breadcrumb');
    const outline = document.getElementById('doc-outline');
    const metaList = document.getElementById('doc-meta-list');

    if (contentEl) {
      contentEl.innerHTML = marked.parse(doc.content);
    }

    if (breadcrumb) {
      const parts = doc.path.split('/');
      breadcrumb.innerHTML = parts.map((p, i) => 
        `<span>${p}</span>${i < parts.length - 1 ? '<i data-lucide="chevron-right"></i>' : ''}`
      ).join('');
    }

    if (outline) {
      const headings = contentEl?.querySelectorAll('h2, h3') || [];
      outline.innerHTML = Array.from(headings).map(h => {
        const level = h.tagName === 'H3' ? 'indent-1' : '';
        return `<a href="#" class="${level}">${h.textContent}</a>`;
      }).join('');
    }

    if (metaList) {
      metaList.innerHTML = `
        <dt>Type</dt><dd>${doc.type}</dd>
        <dt>Status</dt><dd>${doc.status}</dd>
        <dt>Folder</dt><dd>${doc.folder}</dd>
      `;
    }

    lucide.createIcons();
  }

  const modalOverlay = document.getElementById('modal-overlay');
  const globalSearchTrigger = document.getElementById('global-search-trigger');
  const modalSearchInput = document.getElementById('modal-search-input');
  const modalResults = document.getElementById('modal-results');
  const modalSuggestions = document.querySelector('.modal-suggestions');

  function openSearchModal() {
    modalOverlay?.classList.add('open');
    modalSearchInput?.focus();
  }

  function closeSearchModal() {
    modalOverlay?.classList.remove('open');
    if (modalSearchInput) modalSearchInput.value = '';
    modalResults?.classList.remove('has-results');
    if (modalSuggestions) modalSuggestions.style.display = 'block';
  }

  globalSearchTrigger?.addEventListener('click', openSearchModal);
  
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeSearchModal();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      closeDocModal();
    }
  });

  let searchTimeout;
  modalSearchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      modalResults?.classList.remove('has-results');
      if (modalSuggestions) modalSuggestions.style.display = 'block';
      return;
    }

    searchTimeout = setTimeout(() => {
      const results = documents.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.content.toLowerCase().includes(query.toLowerCase())
      );

      if (results.length > 0) {
        if (modalSuggestions) modalSuggestions.style.display = 'none';
        modalResults.innerHTML = results.map(doc => `
          <article class="result-item" data-doc="${doc.id}">
            <div class="result-icon" style="background: ${typeColors[doc.type]}"><i data-lucide="file-text"></i></div>
            <div class="result-content">
              <h4>${doc.title}</h4>
              <p class="result-path">${doc.path}</p>
            </div>
          </article>
        `).join('');
        modalResults?.classList.add('has-results');
        lucide.createIcons();

        modalResults.querySelectorAll('.result-item').forEach(item => {
          item.addEventListener('click', () => {
            closeSearchModal();
            openDocModal(item.dataset.doc);
          });
        });
      }
    }, 300);
  });

  document.querySelectorAll('.suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalSearchInput) {
        modalSearchInput.value = btn.textContent;
        modalSearchInput.dispatchEvent(new Event('input'));
      }
    });
  });

  const docModalOverlay = document.getElementById('doc-modal-overlay');
  const docModalName = document.getElementById('doc-modal-name');
  const docModalPath = document.getElementById('doc-modal-path');
  const docModalMeta = document.getElementById('doc-modal-meta');
  const docModalContent = document.getElementById('doc-modal-content');

  window.openDocModal = function(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    if (docModalName) docModalName.textContent = doc.title;
    if (docModalPath) docModalPath.textContent = doc.path;
    if (docModalMeta) {
      docModalMeta.innerHTML = `
        <div class="meta-item"><i data-lucide="tag"></i> ${doc.type}</div>
        <div class="meta-item"><i data-lucide="circle"></i> ${doc.status}</div>
        <div class="meta-item"><i data-lucide="folder"></i> ${doc.folder}</div>
      `;
    }
    if (docModalContent) {
      docModalContent.innerHTML = marked.parse(doc.content);
    }

    docModalOverlay?.classList.add('open');
    lucide.createIcons();
  };

  function closeDocModal() {
    docModalOverlay?.classList.remove('open');
  }

  document.getElementById('close-doc-modal')?.addEventListener('click', closeDocModal);
  docModalOverlay?.addEventListener('click', (e) => {
    if (e.target === docModalOverlay) closeDocModal();
  });

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const closeResults = document.getElementById('close-results');
  const searchBox = document.getElementById('graph-search');

  let inlineSearchTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(inlineSearchTimeout);
    const query = e.target.value.trim();

    if (query.length < 2) {
      searchResults?.classList.remove('open');
      return;
    }

    searchBox?.classList.add('loading');
    
    inlineSearchTimeout = setTimeout(() => {
      searchBox?.classList.remove('loading');
      searchResults?.classList.add('open');
    }, 500);
  });

  closeResults?.addEventListener('click', () => {
    searchResults?.classList.remove('open');
    if (searchInput) searchInput.value = '';
  });

  searchResults?.querySelectorAll('.result-item').forEach(item => {
    item.addEventListener('click', () => {
      openDocModal(item.dataset.doc);
    });
  });

  const filterToggle = document.getElementById('filter-toggle');
  const filterPanel = document.getElementById('filter-panel');

  filterToggle?.addEventListener('click', () => {
    filterPanel?.classList.toggle('open');
    filterToggle.classList.toggle('active');
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type]}"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close"><i data-lucide="x"></i></button>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => toast.remove(), 5000);
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-success')) {
      showToast('Item approved successfully', 'success');
    }
    if (e.target.closest('.btn-danger')) {
      showToast('Item rejected', 'warning');
    }
  });

  let zoomLevel = 1;
  const graphSvg = document.getElementById('graph-svg');

  document.getElementById('zoom-in')?.addEventListener('click', () => {
    zoomLevel = Math.min(zoomLevel + 0.2, 2);
    if (graphSvg) graphSvg.style.transform = `scale(${zoomLevel})`;
  });

  document.getElementById('zoom-out')?.addEventListener('click', () => {
    zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
    if (graphSvg) graphSvg.style.transform = `scale(${zoomLevel})`;
  });

  document.getElementById('zoom-fit')?.addEventListener('click', () => {
    zoomLevel = 1;
    if (graphSvg) graphSvg.style.transform = 'scale(1)';
  });

  renderGraph();
  renderKanban();
  renderQueue();
  renderDocsTree();

  setTimeout(() => showToast('Welcome to Agent Org Platform', 'info'), 1000);
});
