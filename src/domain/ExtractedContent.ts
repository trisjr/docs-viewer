// AI Coding
/**
 * @file ExtractedContent.ts
 * @description Shared Kernel — nội dung đã bóc tách (text cho PDF/DOCX, tabular cho XLSX). DB-Entity §5.
 * Nguồn dữ liệu duy nhất để SearchEngine build index. status='Empty' cho PDF scan (UC-03 E1), 'Failed' khi parse lỗi (E3).
 */
import type { FileFormat } from './FileFormat'

export type ExtractionStatus = 'Pending' | 'Ready' | 'Empty' | 'Failed'

export interface TextBlock {
  ref: string
  text: string
}

export interface SheetData {
  sheetName: string
  rows: string[][]
  ref: string
}

export interface ExtractedContent {
  documentId: string
  format: FileFormat
  textBlocks?: TextBlock[]
  tabularData?: SheetData[]
  status: ExtractionStatus
  extractedAt?: Date
}
