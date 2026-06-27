// AI Coding
/**
 * @file reducer.ts
 * @description Application — reducer giữ session state cho UI shell (ADR-001: Context + useReducer, không Redux).
 * `error` mang AppError {kind, message} (reuse UploadError) để Presentation render đúng banner/card theo kind.
 * `loading` cho trạng thái đang mở (mockup frame 02). No-text-layer KHÔNG đi qua `error` (non-blocking) mà qua
 * ExtractedContent.status='Empty' (D7).
 */
import type { DocumentSession } from 'domain/DocumentSession'
import type { ExtractedContent } from 'domain/ExtractedContent'
import type { SearchResultSet } from 'domain/search'
import type { UploadError } from 'app/validation'

export interface AppError {
  kind: UploadError
  message: string
}

export interface LoadingInfo {
  fileName: string
  fileSize: number
}

export interface AppState {
  session: DocumentSession | null
  loading: LoadingInfo | null
  extracted: ExtractedContent | null
  searchResult: SearchResultSet | null
  error: AppError | null
}

export const initialState: AppState = {
  session: null,
  loading: null,
  extracted: null,
  searchResult: null,
  error: null,
}

export type AppAction =
  | { type: 'OPEN_STARTED'; fileName: string; fileSize: number }
  | { type: 'SESSION_OPENED'; session: DocumentSession }
  | { type: 'EXTRACTION_READY'; extracted: ExtractedContent }
  | { type: 'SEARCH_UPDATED'; result: SearchResultSet }
  | { type: 'ERROR'; error: AppError }
  | { type: 'RESET' }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'OPEN_STARTED':
      return {
        ...initialState,
        loading: { fileName: action.fileName, fileSize: action.fileSize },
      }
    case 'SESSION_OPENED':
      return { ...state, session: action.session, loading: null, error: null }
    case 'EXTRACTION_READY':
      return { ...state, extracted: action.extracted }
    case 'SEARCH_UPDATED':
      return { ...state, searchResult: action.result }
    case 'ERROR':
      return { ...state, error: action.error, loading: null }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
