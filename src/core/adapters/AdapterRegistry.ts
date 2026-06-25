// AI Coding
/**
 * @file AdapterRegistry.ts
 * @description Core — Registry ánh xạ FileFormat → DocumentAdapter (FR-11.2/KR3.2). Spec-Module-Contracts §4.2.
 * resolve() trả undefined khi format chưa đăng ký → backstop "định dạng không được hỗ trợ" (UC-02 E1) do Application xử lý.
 */
import type { FileFormat } from 'domain/FileFormat'
import type { DocumentAdapter } from './DocumentAdapter'

export interface AdapterRegistry {
  register(adapter: DocumentAdapter): void
  resolve(format: FileFormat): DocumentAdapter | undefined
}

export class AdapterRegistryImpl implements AdapterRegistry {
  private readonly adapters = new Map<FileFormat, DocumentAdapter>()

  register(adapter: DocumentAdapter): void {
    this.adapters.set(adapter.format, adapter)
  }

  resolve(format: FileFormat): DocumentAdapter | undefined {
    return this.adapters.get(format)
  }
}
