// AI Coding
/**
 * @file PdfAdapter.test.ts
 * @description Test PdfAdapter.render + extract qua pdf.js mock (jsdom không paint canvas → chỉ kiểm tra call-flow):
 * page-1 eager + pageCount, renderPage re-render đúng trang/scale (lazy), dispose → task.destroy (R-05),
 * parse lỗi → render reject (open() chuyển CORRUPT); extract → textBlocks/Ready share getDocument, no-text → Empty,
 * getTextContent lỗi → Failed (không throw, D7).
 * Lưu ý: mock KHÔNG chứng minh API thật pdf.js v6 (hasEOL/options) → cần browser smoke với pdfjs-dist@6 (6.3).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const getViewport = vi.fn((opts: { scale: number }) => ({
    width: 600 * opts.scale,
    height: 800 * opts.scale,
  }))
  const render = vi.fn(() => ({ promise: Promise.resolve() }))
  const getTextContent = vi.fn()
  const getPage = vi.fn(async () => ({ getViewport, render, getTextContent }))
  const proxy = { numPages: 3, getPage }
  const taskDestroy = vi.fn(() => Promise.resolve())
  const getDocument = vi.fn(() => ({ promise: Promise.resolve(proxy), destroy: taskDestroy }))
  return { getViewport, render, getPage, getTextContent, taskDestroy, getDocument }
})

vi.mock('core/adapters/pdfjsSetup', () => ({
  pdfjs: { getDocument: mocks.getDocument, GlobalWorkerOptions: {} },
}))

import { PdfAdapter } from 'core/adapters/PdfAdapter'
import { FileFormat } from 'domain/FileFormat'

function pdfFile(name = 'a.pdf'): File {
  return new File([new Uint8Array([1, 2, 3, 4])], name, { type: 'application/pdf' })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('PdfAdapter.render (pdf.js mock)', () => {
  it('render trang đầu eager + trả pageCount, format PDF', async () => {
    const rendered = await new PdfAdapter().render(pdfFile())

    expect(mocks.getDocument).toHaveBeenCalledTimes(1)
    expect(rendered.format).toBe(FileFormat.PDF)
    expect(rendered.pageCount).toBe(3)
    expect(rendered.pages?.[0]?.pageNumber).toBe(1)
    expect(rendered.pages?.[0]?.canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(mocks.render).toHaveBeenCalledTimes(1)
  })

  it('renderPage(n, scale) render đúng trang theo scale (lazy on-demand)', async () => {
    const rendered = await new PdfAdapter().render(pdfFile())
    mocks.getPage.mockClear()
    mocks.getViewport.mockClear()

    const page = await rendered.renderPage!(2, 1.5)

    expect(mocks.getPage).toHaveBeenCalledWith(2)
    expect(mocks.getViewport).toHaveBeenCalledWith({ scale: 1.5 })
    expect(page.pageNumber).toBe(2)
  })

  it('dispose() destroy loading task (giải phóng worker buffers — R-05)', async () => {
    const rendered = await new PdfAdapter().render(pdfFile())
    rendered.dispose!()
    expect(mocks.taskDestroy).toHaveBeenCalledTimes(1)
  })

  it('parse lỗi → render reject (open() sẽ chuyển thành CORRUPT)', async () => {
    mocks.getDocument.mockReturnValueOnce({
      promise: Promise.reject(new Error('bad pdf')),
      destroy: vi.fn(() => Promise.resolve()),
    } as unknown as ReturnType<typeof mocks.getDocument>)

    await expect(new PdfAdapter().render(pdfFile('broken.pdf'))).rejects.toThrow()
  })
})

describe('PdfAdapter.extract (pdf.js mock)', () => {
  it('extract → textBlocks theo trang + Ready, share getDocument với render (không parse 2 lần)', async () => {
    mocks.getTextContent.mockResolvedValue({
      items: [
        { str: 'Hello ', hasEOL: false },
        { str: 'World', hasEOL: true },
      ],
    })
    const adapter = new PdfAdapter()
    const file = pdfFile()

    await adapter.render(file)
    const extracted = await adapter.extract(file)

    expect(mocks.getDocument).toHaveBeenCalledTimes(1)
    expect(extracted.status).toBe('Ready')
    expect(extracted.textBlocks).toHaveLength(3)
    expect(extracted.textBlocks?.[0]).toEqual({ ref: 'page-1', text: 'Hello World\n' })
  })

  it('PDF không có text-layer (scan) → status Empty, không textBlocks (non-blocking D7)', async () => {
    mocks.getTextContent.mockResolvedValue({ items: [] })

    const extracted = await new PdfAdapter().extract(pdfFile('scan.pdf'))

    expect(extracted.status).toBe('Empty')
    expect(extracted.textBlocks).toBeUndefined()
  })

  it('getTextContent lỗi → status Failed (catch, không throw)', async () => {
    mocks.getTextContent.mockRejectedValue(new Error('text layer broken'))

    const extracted = await new PdfAdapter().extract(pdfFile('weird.pdf'))

    expect(extracted.status).toBe('Failed')
  })
})
