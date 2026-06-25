// AI Coding
/**
 * @file composition.ts
 * @description Composition wiring (pure, testable) — đăng ký adapters + inject StorageProvider/SearchEngine vào services.
 * Tách khỏi main.tsx (vốn có side-effect mount DOM) để smoke test tái sử dụng đúng cách wiring.
 * KHÔNG gọi render/extract — chỉ register + construct (walking skeleton).
 */
import { AdapterRegistryImpl } from 'core/adapters/AdapterRegistry'
import type { AdapterRegistry } from 'core/adapters/AdapterRegistry'
import { PdfAdapter } from 'core/adapters/PdfAdapter'
import { DocxAdapter } from 'core/adapters/DocxAdapter'
import { XlsxAdapter } from 'core/adapters/XlsxAdapter'
import { SearchEngineImpl } from 'core/search/SearchEngine'
import { InMemoryStorageProvider } from 'data/InMemoryStorageProvider'
import { DocumentServiceImpl } from 'app/DocumentService'
import type { DocumentService } from 'app/DocumentService'
import { SearchServiceImpl } from 'app/SearchService'
import type { SearchService } from 'app/SearchService'

export interface Composition {
  registry: AdapterRegistry
  documentService: DocumentService
  searchService: SearchService
}

export function createComposition(): Composition {
  const registry = new AdapterRegistryImpl()
  registry.register(new PdfAdapter())
  registry.register(new DocxAdapter())
  registry.register(new XlsxAdapter())

  const storage = new InMemoryStorageProvider()
  const searchEngine = new SearchEngineImpl()

  const documentService = new DocumentServiceImpl(registry, storage)
  const searchService = new SearchServiceImpl(searchEngine)

  return { registry, documentService, searchService }
}
