import * as vscode from 'vscode';
import { Artifact, GraphData, GraphNode, Edge, Frontmatter, EdgeType, NodeType, PipelineStage, WorkItem } from '@agent-org/core';
import { parseWikilinks } from '@agent-org/core';
import type { CacheService } from './CacheService';

interface TeamMember {
  id: string;
  type: 'human' | 'agent';
  role: string;
  capability?: string;
}

const PIPELINE_ORDER: PipelineStage[] = ['management', 'research', 'implementation', 'quality'];

export interface IndexService {
  index(): Promise<void>;
  getArtifacts(): Promise<Artifact[]>;
  getGraphData(): Promise<GraphData>;
  getWorkItems(): Promise<WorkItem[]>;
  search(query: string): Promise<Artifact[]>;
}

export class IndexServiceImpl implements IndexService {
  private artifacts: Map<string, Artifact> = new Map();
  
  constructor(private cacheService: CacheService) {}
  
  async index(): Promise<void> {
    console.log('[IndexService] Starting indexing...');
    this.artifacts.clear();
    
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      console.log('[IndexService] No workspace folders found');
      return;
    }

    const mdFiles = await vscode.workspace.findFiles(
      '**/*.md',
      '**/node_modules/**'
    );
    
    console.log(`[IndexService] Found ${mdFiles.length} markdown files`);

    for (const fileUri of mdFiles) {
      try {
        const artifact = await this.parseFile(fileUri);
        if (artifact) {
          this.artifacts.set(artifact.id, artifact);
        }
      } catch (err) {
        console.error(`[IndexService] Error parsing ${fileUri.fsPath}:`, err);
      }
    }

    console.log(`[IndexService] Indexed ${this.artifacts.size} artifacts`);
  }
  
  private async parseFile(fileUri: vscode.Uri): Promise<Artifact | null> {
    const content = await vscode.workspace.fs.readFile(fileUri);
    const text = Buffer.from(content).toString('utf8');
    
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
    const relativePath = workspaceFolder 
      ? fileUri.fsPath.replace(workspaceFolder.uri.fsPath, '').replace(/^\//, '')
      : fileUri.fsPath;
    
    const id = this.pathToId(relativePath);
    const frontmatter = this.parseFrontmatter(text);
    const outgoingLinks = parseWikilinks(text);
    
    const title = frontmatter.title || this.extractTitle(text) || id;

    return {
      id,
      path: relativePath,
      title,
      frontmatter,
      content: text,
      outgoingLinks,
    };
  }

  private pathToId(path: string): string {
    return path
      .replace(/\.md$/, '')
      .replace(/\\/g, '/')
      .toLowerCase();
  }

  private parseFrontmatter(content: string): Frontmatter {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return {};
    }

    const yaml = match[1];
    const frontmatter: Frontmatter = {};

    const lines = yaml.split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        frontmatter[key] = arrayContent.split(',').map(s => s.trim().replace(/['"]/g, ''));
      } else {
        frontmatter[key] = value;
      }
    }

    return frontmatter;
  }

  private extractTitle(content: string): string | null {
    const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
    const headingMatch = withoutFrontmatter.match(/^#\s+(.+)$/m);
    return headingMatch ? headingMatch[1].trim() : null;
  }

  private extractTeamMembers(content: string): TeamMember[] {
    const members: TeamMember[] = [];
    
    const tableRegex = /\|[^|]+\|[^|]+\|[^|]+\|[^|]*\|?\s*\n/g;
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (!line.includes('|')) continue;
      
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length < 3) continue;
      
      const firstCell = cells[0];
      
      if (firstCell.startsWith('H-') || firstCell.startsWith('A-')) {
        const id = firstCell;
        const isAgent = id.startsWith('A-');
        const role = cells[1] || '';
        const capability = cells[2] || '';
        
        members.push({
          id,
          type: isAgent ? 'agent' : 'human',
          role,
          capability,
        });
      }
    }
    
    return members;
  }

  private extractAgentCapabilities(content: string): string[] {
    const capabilities: string[] = [];
    const capSection = content.match(/\*\*Capabilities:\*\*\s*([\s\S]*?)(?=\*\*Boundaries|\n---|\n##|$)/);
    
    if (capSection) {
      const lines = capSection[1].split('\n');
      for (const line of lines) {
        const match = line.match(/^-\s+(.+)$/);
        if (match) {
          capabilities.push(match[1].trim());
        }
      }
    }
    
    return capabilities;
  }
  
  async getArtifacts(): Promise<Artifact[]> {
    if (this.artifacts.size === 0) {
      await this.index();
    }
    return Array.from(this.artifacts.values());
  }
  
  async getGraphData(): Promise<GraphData> {
    const artifacts = await this.getArtifacts();
    
    const nodes: GraphNode[] = [];
    const edges: Edge[] = [];
    const memberIdToTeamId = new Map<string, string>();
    const teamsByStage = new Map<PipelineStage, string>();

    for (const artifact of artifacts) {
      const fm = artifact.frontmatter;
      const nodeType = (fm.type as NodeType) || 'resource';
      
      const node: GraphNode = {
        id: artifact.id,
        label: artifact.title,
        type: nodeType,
        status: fm.status || 'draft',
        domain: fm.domain as string | undefined,
        path: artifact.path,
        indexNumber: fm.index as string | undefined,
        pipelineStage: fm.pipeline_stage as PipelineStage | undefined,
      };

      if (nodeType === 'team') {
        const members = this.extractTeamMembers(artifact.content);
        node.members = members.map(m => m.id);
        
        for (const member of members) {
          memberIdToTeamId.set(member.id, artifact.id);
          
          const memberId = `member:${member.id.toLowerCase()}`;
          nodes.push({
            id: memberId,
            label: member.id,
            type: member.type === 'agent' ? 'agent' : 'resource',
            status: 'active',
            agentId: member.type === 'agent' ? member.id : undefined,
            capabilities: member.capability ? [member.capability] : [],
            teamId: artifact.id,
          });
          
          edges.push({
            source: memberId,
            target: artifact.id,
            type: 'member_of',
          });
        }

        if (fm.pipeline_stage) {
          teamsByStage.set(fm.pipeline_stage as PipelineStage, artifact.id);
        }
      }

      nodes.push(node);
    }

    for (let i = 0; i < PIPELINE_ORDER.length - 1; i++) {
      const currentStage = PIPELINE_ORDER[i];
      const nextStage = PIPELINE_ORDER[i + 1];
      const currentTeam = teamsByStage.get(currentStage);
      const nextTeam = teamsByStage.get(nextStage);
      
      if (currentTeam && nextTeam) {
        edges.push({
          source: currentTeam,
          target: nextTeam,
          type: 'pipeline_next',
        });
      }
    }

    const nodeIds = new Set(nodes.map(n => n.id));
    
    for (const artifact of artifacts) {
      for (const link of artifact.outgoingLinks) {
        const targetId = this.resolveLink(link, artifact.path);
        
        if (targetId && nodeIds.has(targetId)) {
          edges.push({
            source: artifact.id,
            target: targetId,
            type: this.inferEdgeType(artifact, link),
          });
        }
      }
    }

    console.log(`[IndexService] Graph: ${nodes.length} nodes, ${edges.length} edges`);
    return { nodes, edges };
  }

  private resolveLink(link: string, fromPath: string): string | null {
    const cleanLink = link.split('|')[0].split('#')[0].trim().toLowerCase();
    
    if (cleanLink.includes('/')) {
      const normalized = cleanLink.replace(/^\/+/, '');
      if (this.artifacts.has(normalized)) {
        return normalized;
      }
      const withoutExt = normalized.replace(/\.md$/, '');
      if (this.artifacts.has(withoutExt)) {
        return withoutExt;
      }
    }
    
    for (const [id] of this.artifacts) {
      const filename = id.split('/').pop();
      if (filename === cleanLink) {
        return id;
      }
    }
    
    return null;
  }

  private inferEdgeType(artifact: Artifact, link: string): Edge['type'] {
    if (artifact.frontmatter.parent === link) {
      return 'parent';
    }
    if (artifact.frontmatter.related?.includes(link)) {
      return 'related';
    }
    if (artifact.frontmatter.type === 'moc') {
      return 'moc_contains';
    }
    return 'mentions';
  }
  
  async search(query: string): Promise<Artifact[]> {
    const artifacts = await this.getArtifacts();
    const lowerQuery = query.toLowerCase();
    
    return artifacts.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) ||
      a.path.toLowerCase().includes(lowerQuery) ||
      a.content.toLowerCase().includes(lowerQuery)
    );
  }

  async getWorkItems(): Promise<WorkItem[]> {
    const artifacts = await this.getArtifacts();
    const workItems: WorkItem[] = [];
    let idCounter = 1;

    for (const artifact of artifacts) {
      const fm = artifact.frontmatter;
      
      if (fm.github_issue || fm.status === 'in_progress' || fm.status === 'review') {
        const stage = this.inferPipelineStage(artifact);
        const needHuman = fm.need_human === true || fm.need_human === 'true' || 
                          (Array.isArray(fm.labels) && fm.labels.includes('need:human'));
        
        workItems.push({
          id: idCounter++,
          number: Number(fm.github_issue) || idCounter,
          title: artifact.title,
          type: fm.type === 'pr' ? 'pr' : 'issue',
          stage,
          assignee: fm.assignee as string | undefined,
          labels: Array.isArray(fm.labels) ? fm.labels : [],
          needHuman,
          url: fm.github_url as string || `#${artifact.id}`,
        });
      }
    }

    if (workItems.length === 0) {
      return this.getSampleWorkItems();
    }

    return workItems;
  }

  private inferPipelineStage(artifact: Artifact): PipelineStage {
    const fm = artifact.frontmatter;
    
    if (fm.pipeline_stage && PIPELINE_ORDER.includes(fm.pipeline_stage as PipelineStage)) {
      return fm.pipeline_stage as PipelineStage;
    }
    
    const path = artifact.path.toLowerCase();
    if (path.includes('management') || path.includes('planning')) return 'management';
    if (path.includes('research') || path.includes('design')) return 'research';
    if (path.includes('implementation') || path.includes('build')) return 'implementation';
    if (path.includes('quality') || path.includes('qa') || path.includes('review')) return 'quality';
    
    return 'research';
  }

  private getSampleWorkItems(): WorkItem[] {
    return [
      { id: 1, number: 101, title: 'Sprint planning Q1', description: 'Plan the Q1 sprint goals and milestones.', type: 'issue', stage: 'management', priority: 'P1', labels: ['planning'], needHuman: false, url: '#', assignee: 'PM-001', createdAt: '2026-02-01T10:00:00Z', stageEnteredAt: '2026-02-01T10:00:00Z' },
      { id: 2, number: 102, title: 'Define API specifications', description: 'Create OpenAPI specs for REST endpoints.', type: 'issue', stage: 'research', priority: 'P1', labels: ['design', 'api'], needHuman: false, url: '#', assignee: 'A-RES-001', createdAt: '2026-02-02T09:00:00Z', stageEnteredAt: '2026-02-03T14:00:00Z' },
      { id: 3, number: 103, title: 'Research vector database options', description: 'Compare Pinecone, Weaviate, and Milvus.', type: 'issue', stage: 'research', priority: 'P2', labels: ['research', 'database'], needHuman: false, url: '#', assignee: 'A-RES-002', createdAt: '2026-02-03T11:00:00Z', stageEnteredAt: '2026-02-04T09:00:00Z' },
      { id: 4, number: 104, title: 'Implement auth flow', description: 'Build OAuth2 authentication with GitHub.', type: 'pr', stage: 'implementation', priority: 'P0', labels: ['auth', 'security'], needHuman: true, url: '#', assignee: 'A-BLD-001', createdAt: '2026-02-04T08:00:00Z', stageEnteredAt: '2026-02-05T10:00:00Z' },
      { id: 5, number: 105, title: 'Build knowledge graph indexer', description: 'Parse markdown files and build graph.', type: 'pr', stage: 'implementation', priority: 'P1', labels: ['feature', 'core'], needHuman: false, url: '#', assignee: 'A-BLD-002', createdAt: '2026-02-05T14:00:00Z', stageEnteredAt: '2026-02-06T09:00:00Z' },
      { id: 6, number: 106, title: 'Fix graph rendering performance', description: 'Optimize canvas rendering for large graphs.', type: 'pr', stage: 'implementation', priority: 'P2', labels: ['bug', 'performance'], needHuman: false, url: '#', assignee: 'A-BLD-001', createdAt: '2026-02-06T16:00:00Z', stageEnteredAt: '2026-02-07T11:00:00Z' },
      { id: 7, number: 107, title: 'Review security audit results', description: 'Human review required for security findings.', type: 'issue', stage: 'quality', priority: 'P0', labels: ['security', 'need:human'], needHuman: true, url: '#', createdAt: '2026-02-07T09:00:00Z', stageEnteredAt: '2026-02-08T10:00:00Z' },
      { id: 8, number: 108, title: 'Approve production deployment', description: 'Final sign-off before production release.', type: 'issue', stage: 'quality', priority: 'P0', labels: ['deploy', 'need:human'], needHuman: true, url: '#', createdAt: '2026-02-07T15:00:00Z', stageEnteredAt: '2026-02-08T14:00:00Z' },
      { id: 9, number: 109, title: 'Integration test coverage', description: 'Increase test coverage to 80% for core.', type: 'issue', stage: 'quality', priority: 'P2', labels: ['testing'], needHuman: false, url: '#', assignee: 'A-QA-001', createdAt: '2026-02-08T10:00:00Z', stageEnteredAt: '2026-02-08T16:00:00Z' },
    ];
  }
}
