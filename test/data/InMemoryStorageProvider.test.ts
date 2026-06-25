// AI Coding
/**
 * @file InMemoryStorageProvider.test.ts
 * @description Test no-persist (R5 / privacy by design, R-03/NFR-05): save→load trả session; clear()→load trả null;
 * state chỉ sống trong RAM phiên (instance mới không chia sẻ). Khớp scenario "InMemoryStorageProvider không persist".
 */
import { describe, it, expect } from 'vitest'
import { InMemoryStorageProvider } from 'data/InMemoryStorageProvider'
import type { DocumentSession } from 'domain/DocumentSession'
import { FileFormat } from 'domain/FileFormat'

function makeSession(id: string): DocumentSession {
  return {
    id,
    fileName: 'invoice.pdf',
    format: FileFormat.PDF,
    fileSize: 1024,
    status: 'Loading',
    createdAt: new Date(0),
  }
}

describe('InMemoryStorageProvider (no-persist, R-03/NFR-05)', () => {
  it('save rồi load trả đúng session đã lưu', async () => {
    const storage = new InMemoryStorageProvider()
    const session = makeSession('doc-1')

    await storage.save(session)

    expect(await storage.load('doc-1')).toBe(session)
  })

  it('load id không tồn tại trả null', async () => {
    const storage = new InMemoryStorageProvider()

    expect(await storage.load('missing')).toBeNull()
  })

  it('clear() xóa toàn bộ state phiên', async () => {
    const storage = new InMemoryStorageProvider()
    await storage.save(makeSession('doc-1'))

    await storage.clear()

    expect(await storage.load('doc-1')).toBeNull()
  })

  it('instance mới không chia sẻ state (chỉ sống trong RAM phiên, không persist)', async () => {
    const first = new InMemoryStorageProvider()
    await first.save(makeSession('doc-1'))

    const second = new InMemoryStorageProvider()

    expect(await second.load('doc-1')).toBeNull()
  })
})
