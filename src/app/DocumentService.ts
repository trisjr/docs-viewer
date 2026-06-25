// AI Coding
/**
 * @file DocumentService.ts
 * @description Application — Facade điều phối use-case tài liệu (UC-02/03). Contracts §5.1.
 * Inject AdapterRegistry (Core) + StorageProvider (Data) từ composition root. Scaffold: chữ ký + stub.
 */
import type { DocumentSession } from 'domain/DocumentSession'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'
import type { AdapterRegistry } from 'core/adapters/AdapterRegistry'
import type { StorageProvider } from 'data/StorageProvider'
import { NotImplementedError } from 'core/errors'

export interface DocumentService {
  open(file: File): Promise<DocumentSession>
  getRendered(sessionId: string): RenderedDocument
  getExtracted(sessionId: string): ExtractedContent
  copyExtracted(sessionId: string): Promise<void>
  exportExtracted(sessionId: string): Promise<Blob>
}

export class DocumentServiceImpl implements DocumentService {
  constructor(
    protected readonly registry: AdapterRegistry,
    protected readonly storage: StorageProvider,
  ) {}

  open(file: File): Promise<DocumentSession> {
    throw new NotImplementedError('DocumentService.open')
  }

  getRendered(sessionId: string): RenderedDocument {
    throw new NotImplementedError('DocumentService.getRendered')
  }

  getExtracted(sessionId: string): ExtractedContent {
    throw new NotImplementedError('DocumentService.getExtracted')
  }

  copyExtracted(sessionId: string): Promise<void> {
    throw new NotImplementedError('DocumentService.copyExtracted')
  }

  exportExtracted(sessionId: string): Promise<Blob> {
    throw new NotImplementedError('DocumentService.exportExtracted')
  }
}
