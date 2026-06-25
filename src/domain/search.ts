// AI Coding
/**
 * @file search.ts
 * @description Shared Kernel — data model cho in-document search. DB-Entity §6–§8.
 * SearchIndex là dẫn xuất từ ExtractedContent; SearchResultSet gói matches + con trỏ điều hướng wrap-around (BR-006-5).
 */
export interface NormalizedSegment {
  originalText: string
  normalizedText: string
  ref: string
}

export interface SearchIndex {
  documentId: string
  segments: NormalizedSegment[]
}

export interface SearchMatch {
  segmentRef: string
  startOffset: number
  endOffset: number
  snippet: string
}

export interface SearchResultSet {
  query: string
  matches: SearchMatch[]
  total: number
  activeIndex: number
}
