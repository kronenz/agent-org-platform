/**
 * Frontmatter metadata extracted from markdown documents
 */
export interface Frontmatter {
  title?: string;
  type?: 'moc' | 'concept' | 'project' | 'resource';
  status?: 'draft' | 'review' | 'published';
  domain?: string;
  parent?: string;
  related?: string[];
  [key: string]: unknown;
}

/**
 * Represents a markdown document artifact from the vault
 */
export interface Artifact {
  id: string;           // Unique identifier (slug from path)
  path: string;         // Relative path from vault root
  title: string;        // From frontmatter or first heading
  frontmatter: Frontmatter;
  content: string;      // Raw markdown content
  outgoingLinks: string[]; // Wikilinks found in content
}
