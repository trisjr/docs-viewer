// AI Coding
/**
 * @file PdfAdapter.ts
 * @description Core — adapter PDF (sẽ bọc PDF.js). canHandle hiện thực; render/extract stub. Contracts §4.1.
 */
import { FileFormat } from 'domain/FileFormat'
import type { DocumentAdapter } from './DocumentAdapter'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'
import { NotImplementedError } from '../errors'

export class PdfAdapter implements DocumentAdapter {
  readonly format = FileFormat.PDF

  canHandle(file: File): boolean {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
  }

  render(file: File): Promise<RenderedDocument> {
    throw new NotImplementedError('PdfAdapter.render')
  }

  extract(file: File): Promise<ExtractedContent> {
    throw new NotImplementedError('PdfAdapter.extract')
  }
}
