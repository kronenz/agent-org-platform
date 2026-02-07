import * as vscode from 'vscode';

export interface CacheService {
  /**
   * Get a value from cache
   */
  get<T>(key: string): Promise<T | undefined>;
  
  /**
   * Set a value in cache
   */
  set<T>(key: string, value: T): Promise<void>;
  
  /**
   * Clear all cache or specific key
   */
  clear(key?: string): Promise<void>;
}

export class CacheServiceImpl implements CacheService {
  constructor(private context: vscode.ExtensionContext) {}
  
  async get<T>(key: string): Promise<T | undefined> {
    return this.context.globalState.get<T>(key);
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    await this.context.globalState.update(key, value);
  }
  
  async clear(key?: string): Promise<void> {
    if (key) {
      await this.context.globalState.update(key, undefined);
    } else {
      // Clear all keys - get all keys and clear them
      const keys = this.context.globalState.keys();
      for (const k of keys) {
        await this.context.globalState.update(k, undefined);
      }
    }
  }
}
