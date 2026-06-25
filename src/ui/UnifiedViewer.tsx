// AI Coding
/**
 * @file UnifiedViewer.tsx
 * @description Presentation — shell hợp nhất (FR-05.1). Empty state khi chưa có tài liệu; route tới view con theo format.
 * Scaffold: chỉ dựng layout + định tuyến; chưa gọi service render/extract.
 */
import { useAppStore } from 'app/state/store'
import { FileFormat } from 'domain/FileFormat'
import { UploadZone } from './UploadZone'
import { SearchBar } from './SearchBar'
import { ExtractedContentPanel } from './ExtractedContentPanel'
import { ErrorBanner } from './ErrorBanner'
import { PdfView } from './views/PdfView'
import { DocxView } from './views/DocxView'
import { XlsxView } from './views/XlsxView'

export function UnifiedViewer() {
  const { state } = useAppStore()
  const { session, error } = state

  return (
    <div className="flex h-full flex-col" data-testid="unified-viewer">
      <header className="border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold">DocsViewer</h1>
        <SearchBar />
      </header>

      {error && <ErrorBanner message={error} />}

      <main className="flex flex-1 overflow-hidden">
        <section className="docs-content flex-1 overflow-auto p-4">
          {!session ? (
            <UploadZone />
          ) : session.format === FileFormat.PDF ? (
            <PdfView />
          ) : session.format === FileFormat.DOCX ? (
            <DocxView />
          ) : (
            <XlsxView />
          )}
        </section>
        <ExtractedContentPanel />
      </main>
    </div>
  )
}
