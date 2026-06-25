// AI Coding
/**
 * @file XlsxAdapter.ts
 * @description Core — adapter .xlsx (sẽ bọc SheetJS). canHandle hiện thực; render/extract stub. Contracts §4.1.
 */
import { FileFormat } from 'domain/FileFormat'
import type { DocumentAdapter } from './DocumentAdapter'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'
import { NotImplementedError } from '../errors'

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export class XlsxAdapter implements DocumentAdapter {
  readonly format = FileFormat.XLSX

  canHandle(file: File): boolean {
    return file.type === XLSX_MIME || /\.xlsx$/i.test(file.name)
  }

  render(file: File): Promise<RenderedDocument> {
    throw new NotImplementedError('XlsxAdapter.render')
  }

  extract(file: File): Promise<ExtractedContent> {
    throw new NotImplementedError('XlsxAdapter.extract')
  }
}
