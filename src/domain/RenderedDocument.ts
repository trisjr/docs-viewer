// AI Coding
/**
 * @file RenderedDocument.ts
 * @description Shared Kernel — payload phục vụ hiển thị (format-specific). DB-Entity §4.
 * Payload mutually exclusive theo format: {pages+pageCount} (PDF) / {htmlContainer} (DOCX) / {sheets} (XLSX).
 *
 * Apply-time finding (xem design.md): bổ sung tối thiểu `renderPage`/`dispose` để biểu đạt LAZY single-page
 * render (R-05/SDD §9) — shape gốc (chỉ canvas tĩnh) không biểu đạt được khi adapter interface đóng băng.
 * RenderedDocument vì vậy là một "render handle" (đã sẵn giữ live HTMLCanvasElement, không phải DTO thuần).
 */
import type { FileFormat } from './FileFormat'

export interface RenderedPage {
  pageNumber: number
  width?: number
  height?: number
  canvas?: HTMLCanvasElement
}

export interface RenderedSheet {
  sheetName: string
  html?: string
  rows?: string[][]
}

export interface RenderedDocument {
  documentId: string
  format: FileFormat
  pageCount?: number
  pages?: RenderedPage[]
  htmlContainer?: HTMLElement | string
  sheets?: RenderedSheet[]
  /** Lazy render 1 trang on-demand theo scale (pagination/zoom) — R-05/SDD §9. */
  renderPage?: (pageNumber: number, scale: number) => Promise<RenderedPage>
  /** Giải phóng tài nguyên parse (PDF.js proxy + worker buffers) khi đóng/mở tài liệu mới. */
  dispose?: () => void
}
