// AI Coding
/**
 * @file validation.ts
 * @description Application — validate file upload TRƯỚC khi bàn giao pipeline View/Extract (FR-01, Contracts §3.2).
 * Sprint 1: chỉ PDF được hỗ trợ đầy đủ → non-PDF = UNSUPPORTED_FORMAT; vượt MAX_FILE_SIZE = FILE_TOO_LARGE.
 * CORRUPT KHÔNG bắt ở gate này — phát hiện downstream khi render/extract reject → DocumentSession.status='Failed' (D4).
 */
import { FileFormat } from 'domain/FileFormat'
import { MAX_FILE_SIZE } from 'domain/limits'

export type UploadError = 'UNSUPPORTED_FORMAT' | 'FILE_TOO_LARGE' | 'CORRUPT'

export interface UploadValidationResult {
  ok: boolean
  format?: FileFormat
  error?: UploadError
  message?: string
}

export class UploadRejectedError extends Error {
  constructor(
    public readonly kind: UploadError,
    message: string,
  ) {
    super(message)
    this.name = 'UploadRejectedError'
  }
}

const SUPPORTED_FORMATS: readonly FileFormat[] = [FileFormat.PDF]

function detectFormat(file: File): FileFormat | undefined {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return FileFormat.PDF
  if (/\.docx$/i.test(file.name)) return FileFormat.DOCX
  if (/\.xlsx$/i.test(file.name)) return FileFormat.XLSX
  return undefined
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot) : ''
}

function toMB(bytes: number): string {
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`
}

export function validateUpload(file: File): UploadValidationResult {
  const format = detectFormat(file)
  if (!format || !SUPPORTED_FORMATS.includes(format)) {
    const ext = fileExtension(file.name) || '(không rõ)'
    return {
      ok: false,
      error: 'UNSUPPORTED_FORMAT',
      message: `Chưa hỗ trợ mở file ${ext}. DocsViewer hiện hỗ trợ định dạng PDF.`,
    }
  }

  const max = MAX_FILE_SIZE[format]
  if (file.size > max) {
    return {
      ok: false,
      format,
      error: 'FILE_TOO_LARGE',
      message: `File ${toMB(file.size)} vượt giới hạn ${toMB(max)}.`,
    }
  }

  return { ok: true, format }
}
