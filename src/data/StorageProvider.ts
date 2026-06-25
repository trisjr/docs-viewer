// AI Coding
/**
 * @file StorageProvider.ts
 * @description Data — port lưu trữ session (Ports & Adapters). Extension point M3: gắn auth/multi-tenant = thay impl,
 * KHÔNG sửa Core (FR-11.3/KR3.3). Contracts §6.1.
 */
import type { DocumentSession } from 'domain/DocumentSession'

export interface StorageProvider {
  save(session: DocumentSession): Promise<void>
  load(id: string): Promise<DocumentSession | null>
  clear(): Promise<void>
}
