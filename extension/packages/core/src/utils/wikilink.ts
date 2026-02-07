/**
 * Regular expression to match wikilink patterns [[link]] or [[link|alias]]
 */
export const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Extract all wikilinks from markdown content
 * @param content - Raw markdown content
 * @returns Array of wikilink targets (without brackets or aliases)
 */
export function parseWikilinks(content: string): string[] {
  const links: string[] = [];
  const regex = new RegExp(WIKILINK_REGEX.source, 'g');
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // match[1] is the link target (before | if alias exists)
    links.push(match[1].trim());
  }

  return links;
}

/**
 * Resolve a wikilink to a vault-relative path
 * Resolution order:
 * 1. If link contains '/', treat as vault-relative path
 * 2. Otherwise, treat as slug (filename without extension)
 * 
 * @param link - Wikilink target (e.g., "concepts/agent" or "agent")
 * @param basePath - Base path for relative resolution (currently unused, for future enhancement)
 * @returns Resolved path relative to vault root
 */
export function resolveWikilink(link: string, basePath: string = ''): string {
  // Remove leading/trailing slashes
  const normalized = link.trim().replace(/^\/+|\/+$/g, '');

  // If link contains path separator, treat as vault-relative path
  if (normalized.includes('/')) {
    return normalized;
  }

  // Otherwise, treat as slug (filename without extension)
  // Actual file resolution will be done by indexer
  return normalized;
}
