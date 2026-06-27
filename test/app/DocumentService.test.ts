// AI Coding
/**
 * @file DocumentService.test.ts
 * @description Test DocumentService.open() pipeline (tasks 2.3/2.4/3.4/3.7/3.8/4.3):
 * validate TRƯỚC handoff · render → cache + status Rendered · extract → cache + getExtracted ·
 * render lỗi → Failed + CORRUPT (BR-004-2), extract KHÔNG chạy · no-text → 'Empty' non-blocking (session vẫn Rendered) ·
 * mở tài liệu mới → dispose proxy tài liệu trước (tránh leak R-05).
 */
import { describe, it, expect, vi } from 'vitest'
import { DocumentServiceImpl } from 'app/DocumentService'
import { UploadRejectedError } from 'app/validation'
import { AdapterRegistryImpl } from 'core/adapters/AdapterRegistry'
import { InMemoryStorageProvider } from 'data/InMemoryStorageProvider'
import { FileFormat } from 'domain/FileFormat'
import type { DocumentAdapter } from 'core/adapters/DocumentAdapter'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'

function fakeFile(name: string, type: string, size: number): File {
  return { name, type, size } as unknown as File
}

function setup(
  renderImpl?: () => Promise<RenderedDocument>,
  extractImpl?: () => Promise<ExtractedContent>,
) {
  const dispose = vi.fn()
  const defaultRender = async (): Promise<RenderedDocument> => ({
    documentId: '',
    format: FileFormat.PDF,
    pageCount: 2,
    pages: [{ pageNumber: 1 }],
    renderPage: vi.fn(),
    dispose,
  })
  const defaultExtract = async (): Promise<ExtractedContent> => ({
    documentId: '',
    format: FileFormat.PDF,
    status: 'Ready',
    textBlocks: [{ ref: 'page-1', text: 'hello' }],
  })
  const render = vi.fn(renderImpl ?? defaultRender)
  const extract = vi.fn(extractImpl ?? defaultExtract)
  const adapter: DocumentAdapter = {
    format: FileFormat.PDF,
    canHandle: () => true,
    render,
    extract,
  }
  const registry = new AdapterRegistryImpl()
  registry.register(adapter)
  const storage = new InMemoryStorageProvider()
  const saveSpy = vi.spyOn(storage, 'save')
  const service = new DocumentServiceImpl(registry, storage)
  return { service, saveSpy, render, extract, dispose }
}

describe('DocumentService.open (pipeline validate → render → extract → cache)', () => {
  it('PDF hợp lệ → render + extract, session=Rendered, getRendered/getExtracted gắn documentId', async () => {
    const { service, extract } = setup()

    const session = await service.open(fakeFile('q2.pdf', 'application/pdf', 1024))

    expect(session.status).toBe('Rendered')
    expect(service.getRendered(session.id).documentId).toBe(session.id)
    expect(extract).toHaveBeenCalledTimes(1)
    const extracted = service.getExtracted(session.id)
    expect(extracted.status).toBe('Ready')
    expect(extracted.documentId).toBe(session.id)
  })

  it('no-text-layer → getExtracted="Empty" nhưng session vẫn Rendered (non-blocking, D7)', async () => {
    const { service } = setup(undefined, async () => ({
      documentId: '',
      format: FileFormat.PDF,
      status: 'Empty',
    }))

    const session = await service.open(fakeFile('scan.pdf', 'application/pdf', 1024))

    expect(session.status).toBe('Rendered')
    expect(service.getExtracted(session.id).status).toBe('Empty')
  })

  it('file không hỗ trợ → throw UploadRejectedError, KHÔNG handoff (không save/render/extract)', async () => {
    const { service, saveSpy, render, extract } = setup()

    await expect(service.open(fakeFile('deck.pptx', '', 1024))).rejects.toBeInstanceOf(
      UploadRejectedError,
    )
    expect(saveSpy).not.toHaveBeenCalled()
    expect(render).not.toHaveBeenCalled()
    expect(extract).not.toHaveBeenCalled()
  })

  it('render lỗi (PDF hỏng) → throw CORRUPT, extract KHÔNG chạy (BR-004-2)', async () => {
    const { service, extract } = setup(async () => {
      throw new Error('corrupt content')
    })

    await expect(
      service.open(fakeFile('broken.pdf', 'application/pdf', 1024)),
    ).rejects.toMatchObject({ kind: 'CORRUPT' })
    expect(extract).not.toHaveBeenCalled()
  })

  it('mở tài liệu mới → dispose proxy tài liệu trước (UC-02 A2, tránh leak R-05)', async () => {
    const { service, dispose } = setup()

    await service.open(fakeFile('a.pdf', 'application/pdf', 1024))
    await service.open(fakeFile('b.pdf', 'application/pdf', 1024))

    expect(dispose).toHaveBeenCalledTimes(1)
  })
})
