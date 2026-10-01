export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class MemoryStorageAdapter implements StorageAdapter {
  private memoryStore: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.memoryStore.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.memoryStore.set(key, value);
  }

  removeItem(key: string): void {
    this.memoryStore.delete(key);
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Failed to write to localStorage:', e);
    }
  }

  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  }
}

export const createDefaultStorage = (): StorageAdapter => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return new LocalStorageAdapter();
    } catch {
      return new MemoryStorageAdapter();
    }
  }
  return new MemoryStorageAdapter();
};

export const defaultStorage: StorageAdapter = createDefaultStorage();
