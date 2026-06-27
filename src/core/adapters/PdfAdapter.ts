// AI Coding
/**
 * @file PdfAdapter.ts
 * @description Core — adapter PDF bọc PDF.js (Contracts §4.1).
 * render: page-1 eager (mốc ≤3s) + lazy `renderPage` on-demand (R-05/SDD §9 — RenderedDocument là render handle).
 * Share 1 `getDocument` giữa render+extract (cache loading task theo File) → không parse 2 lần (NFR-01).
 * Canvas paint ở MAIN THREAD (D2 — ngoại lệ có chủ đích, đối xứng DocxAdapter.render, SDD §198); parse nặng
 * (kể cả `getTextContent`) chạy off-main-thread trong worker riêng của PDF.js (SDD §264, F2). extract: text-layer
 * theo thứ tự trang (ST-07) — no-text → status 'Empty' (non-blocking), lỗi nội bộ → 'Failed' (không throw, D7).
 */
import { FileFormat } from 'domain/FileFormat'
import type { DocumentAdapter } from './DocumentAdapter'
import type { RenderedDocument, RenderedPage } from 'domain/RenderedDocument'
import type { ExtractedContent, TextBlock } from 'domain/ExtractedContent'
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'

const DEFAULT_SCALE = 1
const MAX_OUTPUT_SCALE = 2

interface LoadedPdf {
  task: PDFDocumentLoadingTask
  proxy: PDFDocumentProxy
}

export class PdfAdapter implements DocumentAdapter {
  readonly format = FileFormat.PDF
  private readonly docCache = new WeakMap<File, Promise<LoadedPdf>>()

  canHandle(file: File): boolean {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
  }

  private load(file: File): Promise<LoadedPdf> {
    let loading = this.docCache.get(file)
    if (!loading) {
      loading = (async () => {
        const { pdfjs } = await import('./pdfjsSetup')
        const buffer = await file.arrayBuffer()
        const task = pdfjs.getDocument({ data: new Uint8Array(buffer) })
        try {
          const proxy = await task.promise
          return { task, proxy }
        } catch (error) {
          void task.destroy()
          throw error
        }
      })()
      this.docCache.set(file, loading)
    }
    return loading
  }

  private async renderPageToCanvas(
    proxy: PDFDocumentProxy,
    pageNumber: number,
    scale: number,
  ): Promise<RenderedPage> {
    const page = await proxy.getPage(pageNumber)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const outputScale = Math.min(globalThis.devicePixelRatio || 1, MAX_OUTPUT_SCALE)
    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = `${Math.floor(viewport.width)}px`
    canvas.style.height = `${Math.floor(viewport.height)}px`
    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined

    await page.render({ canvas, viewport, transform }).promise
    return { pageNumber, width: viewport.width, height: viewport.height, canvas }
  }

  async render(file: File): Promise<RenderedDocument> {
    try {
      const { task, proxy } = await this.load(file)
      const firstPage = await this.renderPageToCanvas(proxy, 1, DEFAULT_SCALE)
      return {
        documentId: '',
        format: FileFormat.PDF,
        pageCount: proxy.numPages,
        pages: [firstPage],
        renderPage: (pageNumber, scale) => this.renderPageToCanvas(proxy, pageNumber, scale),
        dispose: () => {
          this.docCache.delete(file)
          void task.destroy()
        },
      }
    } catch (error) {
      this.docCache.delete(file)
      throw error
    }
  }

  async extract(file: File): Promise<ExtractedContent> {
    try {
      const { proxy } = await this.load(file)
      const textBlocks: TextBlock[] = []
      for (let pageNumber = 1; pageNumber <= proxy.numPages; pageNumber++) {
        const page = await proxy.getPage(pageNumber)
        const content = await page.getTextContent()
        const text = content.items
          .map((item) => ('str' in item ? item.str + (item.hasEOL ? '\n' : '') : ''))
          .join('')
        if (text.trim().length > 0) textBlocks.push({ ref: `page-${pageNumber}`, text })
      }
      const hasText = textBlocks.length > 0
      return {
        documentId: '',
        format: FileFormat.PDF,
        textBlocks: hasText ? textBlocks : undefined,
        status: hasText ? 'Ready' : 'Empty',
        extractedAt: new Date(),
      }
    } catch {
      return { documentId: '', format: FileFormat.PDF, status: 'Failed' }
    }
  }
}
