// AI Coding
/**
 * @file composition.test.ts
 * @description Test composition root — createComposition() đăng ký đủ 3 adapter (PDF/DOCX/XLSX) đúng FileFormat.
 * Khớp scenario "Composition root đăng ký adapter và inject storage" (tasks 7.1).
 */
import { describe, it, expect } from 'vitest'
import { createComposition } from '../src/composition'
import { PdfAdapter } from 'core/adapters/PdfAdapter'
import { DocxAdapter } from 'core/adapters/DocxAdapter'
import { XlsxAdapter } from 'core/adapters/XlsxAdapter'
import { FileFormat } from 'domain/FileFormat'

describe('Composition root (wiring)', () => {
  it('đăng ký đủ 3 adapter theo đúng FileFormat', () => {
    const { registry } = createComposition()

    expect(registry.resolve(FileFormat.PDF)).toBeInstanceOf(PdfAdapter)
    expect(registry.resolve(FileFormat.DOCX)).toBeInstanceOf(DocxAdapter)
    expect(registry.resolve(FileFormat.XLSX)).toBeInstanceOf(XlsxAdapter)
  })
})
