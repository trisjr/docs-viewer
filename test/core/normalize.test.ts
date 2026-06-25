// AI Coding
/**
 * @file normalize.test.ts
 * @description Test normalize() — case & diacritic insensitive + đ→d (BR-006-4). Khóa cứng logic nền của search.
 */
import { describe, it, expect } from 'vitest'
import { normalize } from 'core/search/normalize'

describe('normalize (BR-006-4)', () => {
  it('bỏ dấu và lowercase', () => {
    expect(normalize('Báo Cáo')).toBe('bao cao')
  })

  it('xử lý đ/Đ (không decompose dưới NFD) → d', () => {
    expect(normalize('Đà Nẵng')).toBe('da nang')
  })

  it('giữ nguyên chuỗi ASCII thường', () => {
    expect(normalize('invoice 2026')).toBe('invoice 2026')
  })
})
