// AI Coding
/**
 * @file AdapterRegistry.test.ts
 * @description Test extension point — registry resolve adapter đã đăng ký; trả undefined cho format chưa đăng ký
 * (backstop "định dạng không được hỗ trợ", UC-02 E1 / tasks 8.1). Closing assertion ST-02 (task 5.4, Sprint-001 §3.1):
 * đăng ký adapter thứ hai cho một định dạng MỚI chỉ cần register() + một class implement DocumentAdapter sống
 * ngoài Core (định nghĩa ngay trong test) — KHÔNG sửa AdapterRegistry/DocumentAdapter, chứng minh KR3.2 mở.
 */
import { describe, it, expect } from 'vitest'
import { AdapterRegistryImpl } from 'core/adapters/AdapterRegistry'
import { PdfAdapter } from 'core/adapters/PdfAdapter'
import type { DocumentAdapter } from 'core/adapters/DocumentAdapter'
import type { RenderedDocument } from 'domain/RenderedDocument'
import type { ExtractedContent } from 'domain/ExtractedContent'
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

  it('đăng ký adapter thứ hai cho định dạng MỚI không cần sửa Core (closing assertion ST-02, KR3.2)', () => {
    const FUTURE_FORMAT = 'rtf' as unknown as FileFormat
    class FakeAdapter implements DocumentAdapter {
      readonly format = FUTURE_FORMAT
      canHandle(): boolean {
        return true
      }
      render(): Promise<RenderedDocument> {
        return Promise.reject(new Error('fake adapter — không gọi trong test'))
      }
      extract(): Promise<ExtractedContent> {
        return Promise.reject(new Error('fake adapter — không gọi trong test'))
      }
    }

    const registry = new AdapterRegistryImpl()
    const pdf = new PdfAdapter()
    const fake = new FakeAdapter()
    registry.register(pdf)
    registry.register(fake)

    expect(registry.resolve(FileFormat.PDF)).toBe(pdf)
    expect(registry.resolve(FUTURE_FORMAT)).toBe(fake)
  })
})
