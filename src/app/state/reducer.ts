// AI Coding
/**
 * @file reducer.ts
 * @description Application — reducer giữ session state tối thiểu cho UI shell (ADR-001: Context + useReducer, không Redux).
 * Feature M1 mở rộng action/state khi wiring logic thật.
 */
import type { DocumentSession } from 'domain/DocumentSession'
import type { ExtractedContent } from 'domain/ExtractedContent'
import type { SearchResultSet } from 'domain/search'

export interface AppState {
  session: DocumentSession | null
  extracted: ExtractedContent | null
  searchResult: SearchResultSet | null
  error: string | null
}

export const initialState: AppState = {
  session: null,
  extracted: null,
  searchResult: null,
  error: null,
}

export type AppAction =
  | { type: 'SESSION_OPENED'; session: DocumentSession }
  | { type: 'EXTRACTION_READY'; extracted: ExtractedContent }
  | { type: 'SEARCH_UPDATED'; result: SearchResultSet }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SESSION_OPENED':
      return { ...state, session: action.session, error: null }
    case 'EXTRACTION_READY':
      return { ...state, extracted: action.extracted }
    case 'SEARCH_UPDATED':
      return { ...state, searchResult: action.result }
    case 'ERROR':
      return { ...state, error: action.message }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
