// AI Coding
/**
 * @file validation.ts
 * @description Application — kết quả validate file upload (FR-01). Contracts §3.2.
 * Scaffold: type đầy đủ + chữ ký validateUpload (stub). Feature M1 fill logic detect format + đối chiếu MAX_FILE_SIZE.
 */
import type { FileFormat } from 'domain/FileFormat'
import { NotImplementedError } from 'core/errors'

export type UploadError = 'UNSUPPORTED_FORMAT' | 'FILE_TOO_LARGE' | 'CORRUPT'

export interface UploadValidationResult {
  ok: boolean
  format?: FileFormat
  error?: UploadError
  message?: string
}

export function validateUpload(file: File): UploadValidationResult {
  throw new NotImplementedError('validateUpload')
}
