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
import { validateUpload, UploadRejectedError } from 'app/validation'

export interface DocumentService {
  open(file: File): Promise<DocumentSession>
  getRendered(sessionId: string): RenderedDocument
  getExtracted(sessionId: string): ExtractedContent
  copyExtracted(sessionId: string): Promise<void>
  exportExtracted(sessionId: string): Promise<Blob>
}

export class DocumentServiceImpl implements DocumentService {
  private readonly renderedCache = new Map<string, RenderedDocument>()
  private readonly extractedCache = new Map<string, ExtractedContent>()

  constructor(
    protected readonly registry: AdapterRegistry,
    protected readonly storage: StorageProvider,
  ) {}

  async open(file: File): Promise<DocumentSession> {
    this.teardownRendered()

    const validation = validateUpload(file)
    if (!validation.ok || !validation.format) {
      throw new UploadRejectedError(
        validation.error ?? 'UNSUPPORTED_FORMAT',
        validation.message ?? 'File không hợp lệ.',
      )
    }

    const adapter = this.registry.resolve(validation.format)
    if (!adapter) {
      throw new UploadRejectedError(
        'UNSUPPORTED_FORMAT',
        `Không có adapter cho định dạng ${validation.format}.`,
      )
    }

    const session: DocumentSession = {
      id: crypto.randomUUID(),
      fileName: file.name,
      format: validation.format,
      fileSize: file.size,
      status: 'Loading',
      createdAt: new Date(),
    }
    await this.storage.save(session)

    try {
      const rendered = await adapter.render(file)
      rendered.documentId = session.id
      this.renderedCache.set(session.id, rendered)
    } catch {
      session.status = 'Failed'
      await this.storage.save(session)
      throw new UploadRejectedError(
        'CORRUPT',
        'Không mở được tài liệu. File có thể bị hỏng hoặc không phải PDF hợp lệ.',
      )
    }

    session.status = 'Rendered'
    await this.storage.save(session)

    const extracted = await adapter.extract(file)
    extracted.documentId = session.id
    this.extractedCache.set(session.id, extracted)

    return session
  }

  getRendered(sessionId: string): RenderedDocument {
    const rendered = this.renderedCache.get(sessionId)
    if (!rendered) {
      throw new Error(`Chưa có nội dung render cho session ${sessionId}`)
    }
    return rendered
  }

  /** Giải phóng proxy/worker buffers của tài liệu đang mở trước khi mở mới (UC-02 A2) — tránh leak (R-05). */
  private teardownRendered(): void {
    for (const rendered of this.renderedCache.values()) rendered.dispose?.()
    this.renderedCache.clear()
    this.extractedCache.clear()
  }

  getExtracted(sessionId: string): ExtractedContent {
    const extracted = this.extractedCache.get(sessionId)
    if (!extracted) {
      throw new Error(`Chưa có nội dung trích xuất cho session ${sessionId}`)
    }
    return extracted
  }

  copyExtracted(sessionId: string): Promise<void> {
    throw new NotImplementedError('DocumentService.copyExtracted')
  }

  exportExtracted(sessionId: string): Promise<Blob> {
    throw new NotImplementedError('DocumentService.exportExtracted')
  }
}
