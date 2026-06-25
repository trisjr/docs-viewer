// AI Coding
/**
 * @file RenderedDocument.ts
 * @description Shared Kernel — payload phục vụ hiển thị (format-specific). DB-Entity §4.
 * Payload mutually exclusive theo format: {pages+pageCount} (PDF) / {htmlContainer} (DOCX) / {sheets} (XLSX).
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
}
