// AI Coding
/**
 * @file SearchService.ts
 * @description Application — facade In-Document Search, bọc Core SearchEngine + giữ state phiên tìm kiếm (UC-04).
 * Contracts §5.2. Scaffold: chữ ký + stub.
 */
import type { ExtractedContent } from 'domain/ExtractedContent'
import type { SearchResultSet } from 'domain/search'
import type { SearchEngine } from 'core/search/SearchEngine'
import { NotImplementedError } from 'core/errors'

export interface SearchService {
  prepare(content: ExtractedContent): void
  query(keyword: string): SearchResultSet
  next(): SearchResultSet
  prev(): SearchResultSet
}

export class SearchServiceImpl implements SearchService {
  constructor(protected readonly engine: SearchEngine) {}

  prepare(content: ExtractedContent): void {
    throw new NotImplementedError('SearchService.prepare')
  }

  query(keyword: string): SearchResultSet {
    throw new NotImplementedError('SearchService.query')
  }

  next(): SearchResultSet {
    throw new NotImplementedError('SearchService.next')
  }

  prev(): SearchResultSet {
    throw new NotImplementedError('SearchService.prev')
  }
}
