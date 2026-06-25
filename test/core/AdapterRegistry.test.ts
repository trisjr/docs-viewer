// AI Coding
/**
 * @file AdapterRegistry.test.ts
 * @description Test extension point — registry resolve adapter đã đăng ký; trả undefined cho format chưa đăng ký
 * (backstop "định dạng không được hỗ trợ", UC-02 E1 / tasks 8.1).
 */
import { describe, it, expect } from 'vitest'
import { AdapterRegistryImpl } from 'core/adapters/AdapterRegistry'
import { PdfAdapter } from 'core/adapters/PdfAdapter'
import { FileFormat } from 'domain/FileFormat'

describe('AdapterRegistry (pluggable extension point)', () => {
  it('resolve trả đúng adapter đã đăng ký theo format', () => {
    const registry = new AdapterRegistryImpl()
    const pdf = new PdfAdapter()
    registry.register(pdf)

    expect(registry.resolve(FileFormat.PDF)).toBe(pdf)
  })

  it('resolve trả undefined cho format chưa có adapter', () => {
    const registry = new AdapterRegistryImpl()

    expect(registry.resolve(FileFormat.XLSX)).toBeUndefined()
  })
})
