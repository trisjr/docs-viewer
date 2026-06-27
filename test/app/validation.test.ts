// AI Coding
/**
 * @file validation.test.ts
 * @description Test validateUpload (tasks 2.5): happy + unhappy (sai format / quá size) + nhận diện theo đuôi.
 */
import { describe, it, expect } from 'vitest'
import { validateUpload } from 'app/validation'
import { FileFormat } from 'domain/FileFormat'
import { MAX_FILE_SIZE } from 'domain/limits'

function fakeFile(name: string, type: string, size: number): File {
  return { name, type, size } as unknown as File
}

describe('validateUpload (FR-01 gate)', () => {
  it('chấp nhận PDF hợp lệ trong ngưỡng dung lượng', () => {
    const result = validateUpload(fakeFile('q2-review.pdf', 'application/pdf', 4 * 1024 * 1024))
    expect(result.ok).toBe(true)
    expect(result.format).toBe(FileFormat.PDF)
    expect(result.error).toBeUndefined()
  })

  it('từ chối định dạng không hỗ trợ với UNSUPPORTED_FORMAT (nêu đuôi file)', () => {
    const result = validateUpload(fakeFile('deck.pptx', 'application/vnd.ms-powerpoint', 1024))
    expect(result.ok).toBe(false)
    expect(result.error).toBe('UNSUPPORTED_FORMAT')
    expect(result.message).toContain('.pptx')
  })

  it('từ chối file PDF vượt MAX_FILE_SIZE với FILE_TOO_LARGE', () => {
    const oversize = MAX_FILE_SIZE[FileFormat.PDF] + 1
    const result = validateUpload(fakeFile('big.pdf', 'application/pdf', oversize))
    expect(result.ok).toBe(false)
    expect(result.error).toBe('FILE_TOO_LARGE')
    expect(result.format).toBe(FileFormat.PDF)
  })

  it('nhận diện PDF theo đuôi file kể cả khi MIME trống', () => {
    const result = validateUpload(fakeFile('doc.pdf', '', 1024))
    expect(result.ok).toBe(true)
    expect(result.format).toBe(FileFormat.PDF)
  })
})
