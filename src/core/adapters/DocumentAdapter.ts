// AI Coding
/**
 * @file DocumentAdapter.ts
 * @description Core — hợp đồng pluggable adapter cho mỗi định dạng (FR-11.2/KR3.2). Spec-Module-Contracts §4.1.
 * Thêm định dạng mới = viết adapter + registry.register(), KHÔNG sửa Core.
 */
import type { FileFormat } from 'domain/FileFormat'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'

export interface DocumentAdapter {
  readonly format: FileFormat
  canHandle(file: File): boolean
  render(file: File): Promise<RenderedDocument>
  extract(file: File): Promise<ExtractedContent>
}
