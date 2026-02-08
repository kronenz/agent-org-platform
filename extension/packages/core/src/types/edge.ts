export type EdgeType = 
  | 'parent' 
  | 'related' 
  | 'mentions' 
  | 'moc_contains' 
  | 'wikilink'
  | 'contains'
  | 'member_of'
  | 'supervised_by'
  | 'owns'
  | 'pipeline_next'
  | 'pipeline_prev';

export interface Edge {
  source: string;
  target: string;
  type: EdgeType;
}
