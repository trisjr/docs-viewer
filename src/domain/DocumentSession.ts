// AI Coding
/**
 * @file DocumentSession.ts
 * @description Shared Kernel — metadata phiên tài liệu (aggregate root). DB-Entity §3.
 */
import type { FileFormat } from './FileFormat'

export type DocumentStatus = 'Loading' | 'Rendered' | 'Failed'

export interface DocumentSession {
  id: string
  fileName: string
  format: FileFormat
  fileSize: number
  status: DocumentStatus
  createdAt: Date
}
