// AI Coding
/**
 * @file UnifiedViewer.tsx
 * @description Presentation — shell hợp nhất (FR-05, mockup frame 03): top bar (logo + doc info + search + Mở file),
 * error banner, vùng nội dung route theo state (loading frame 02 / empty frame 01 / view theo format) + panel Extracted.
 * Điều khiển dùng chung (Mở file, ô search) cố định ở top bar; điều khiển đặc thù PDF (paging/zoom) ở PdfView.
 */
import { useAppStore } from 'app/state/store'
import { FileFormat } from 'domain/FileFormat'
import { UploadZone } from './UploadZone'
import { OpenFileButton } from './OpenFileButton'
import { LoadingView } from './LoadingView'
import { ExtractedContentPanel } from './ExtractedContentPanel'
import { ErrorBanner } from './ErrorBanner'
import { UnsupportedFormatView } from './UnsupportedFormatView'
import { PdfView } from './views/PdfView'

function toMB(bytes: number): string {
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`
}

export function UnifiedViewer() {
  const { state, dispatch } = useAppStore()
  const { session, loading, error, extracted } = state

  return (
    <div className="flex h-full flex-col" data-testid="unified-viewer">
      <header className="flex h-14 items-center gap-4 border-b border-gray-200 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-primary text-sm font-bold text-white">
            D
          </div>
          {session ? (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold text-gray-900">{session.fileName}</span>
              <span className="text-[11px] text-gray-400">
                {session.format === FileFormat.PDF ? 'PDF' : session.format} · {toMB(session.fileSize)}
              </span>
            </div>
          ) : (
            <span className="text-[15px] font-semibold text-gray-900">DocsViewer</span>
          )}
        </div>

        <div className="flex flex-1 justify-center">
          <div
            className="flex h-9 w-full max-w-[440px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-gray-400"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <span className="text-[13px]">Tìm trong tài liệu (Sprint 2)</span>
          </div>
        </div>

        <OpenFileButton />
      </header>

      {error && <ErrorBanner error={error} onDismiss={() => dispatch({ type: 'RESET' })} />}

      <main className="flex flex-1 overflow-hidden">
        <section className="docs-content relative flex-1 overflow-hidden">
          {loading ? (
            <LoadingView fileName={loading.fileName} fileSize={loading.fileSize} />
          ) : !session ? (
            <UploadZone />
          ) : session.format === FileFormat.PDF ? (
            <PdfView />
          ) : (
            <UnsupportedFormatView format={session.format} />
          )}
        </section>
        {session && <ExtractedContentPanel extracted={extracted} />}
      </main>
    </div>
  )
}
