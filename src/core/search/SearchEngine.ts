// AI Coding
/**
 * @file SearchEngine.ts
 * @description Core — in-document search thuần in-memory (FR-09/10, BR-006). Contracts §4.3.
 * Scaffold: chữ ký đầy đủ, thân stub. Feature M1 fill buildIndex/search/next/prev (wrap-around).
 */
import type { ExtractedContent } from 'domain/ExtractedContent'
import type { SearchIndex, SearchResultSet } from 'domain/search'
import { NotImplementedError } from '../errors'

export interface SearchEngine {
  buildIndex(content: ExtractedContent): SearchIndex
  search(index: SearchIndex, query: string): SearchResultSet
  next(rs: SearchResultSet): SearchResultSet
  prev(rs: SearchResultSet): SearchResultSet
}

export class SearchEngineImpl implements SearchEngine {
  buildIndex(content: ExtractedContent): SearchIndex {
    throw new NotImplementedError('SearchEngine.buildIndex')
  }

  search(index: SearchIndex, query: string): SearchResultSet {
    throw new NotImplementedError('SearchEngine.search')
  }

  next(rs: SearchResultSet): SearchResultSet {
    throw new NotImplementedError('SearchEngine.next')
  }

  prev(rs: SearchResultSet): SearchResultSet {
    throw new NotImplementedError('SearchEngine.prev')
  }
}
