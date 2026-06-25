// AI Coding
/**
 * @file InMemoryStorageProvider.ts
 * @description Data — impl MVP không persist (privacy by design, R-03/NFR-05). State sống trong RAM phiên trình duyệt.
 */
import type { DocumentSession } from 'domain/DocumentSession'
import type { StorageProvider } from './StorageProvider'

export class InMemoryStorageProvider implements StorageProvider {
  private readonly sessions = new Map<string, DocumentSession>()

  async save(session: DocumentSession): Promise<void> {
    this.sessions.set(session.id, session)
  }

  async load(id: string): Promise<DocumentSession | null> {
    return this.sessions.get(id) ?? null
  }

  async clear(): Promise<void> {
    this.sessions.clear()
  }
}
