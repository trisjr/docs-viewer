// AI Coding
/**
 * @file DocxAdapter.ts
 * @description Core — adapter .docx (sẽ bọc docx-preview/mammoth). canHandle hiện thực; render/extract stub. Contracts §4.1.
 * NOTE: render() là NGOẠI LỆ có chủ đích — chạy main thread vì docx-preview cần `document` (SDD §4, Integration Spec §7).
 */
import { FileFormat } from 'domain/FileFormat'
import type { DocumentAdapter } from './DocumentAdapter'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'
import { NotImplementedError } from '../errors'

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export class DocxAdapter implements DocumentAdapter {
  readonly format = FileFormat.DOCX

  canHandle(file: File): boolean {
    return file.type === DOCX_MIME || /\.docx$/i.test(file.name)
  }

  render(file: File): Promise<RenderedDocument> {
    throw new NotImplementedError('DocxAdapter.render')
  }

  extract(file: File): Promise<ExtractedContent> {
    throw new NotImplementedError('DocxAdapter.extract')
  }
}
