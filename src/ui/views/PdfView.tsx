// AI Coding
/**
 * @file PdfView.tsx
 * @description Presentation — view PDF (mockup frame 03): canvas trang hiện tại + floating toolbar (prev/next + zoom).
 * Render LAZY on-demand qua RenderedDocument.renderPage (R-05); chỉ giữ trang hiện tại (re-render khi đổi trang/zoom).
 * Trang 1 ở zoom mặc định dùng canvas eager (paint tức thì, hỗ trợ mốc ≤3s).
 */
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from 'app/state/store'

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200] as const
const DEFAULT_ZOOM = 100

export function PdfView() {
  const { state, services } = useAppStore()
  const session = state.session
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [isRendering, setRendering] = useState(false)

  const rendered = session ? services.documentService.getRendered(session.id) : null
  const pageCount = rendered?.pageCount ?? 1

  useEffect(() => {
    setCurrentPage(1)
    setZoom(DEFAULT_ZOOM)
  }, [session?.id])

  useEffect(() => {
    if (!rendered) return
    let cancelled = false

    function show(canvas: HTMLCanvasElement | undefined): void {
      const container = containerRef.current
      if (cancelled || !container || !canvas) return
      canvas.className = 'block rounded-[3px] bg-white shadow-[0_4px_18px_rgba(16,24,40,0.1)]'
      container.replaceChildren(canvas)
    }

    const eager = rendered.pages?.[0]?.canvas
    if (currentPage === 1 && zoom === DEFAULT_ZOOM && eager) {
      show(eager)
      return
    }
    if (!rendered.renderPage) return

    setRendering(true)
    rendered
      .renderPage(currentPage, zoom / 100)
      .then((page) => show(page.canvas))
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setRendering(false)
      })

    return () => {
      cancelled = true
    }
  }, [rendered, currentPage, zoom])

  function stepZoom(direction: -1 | 1): void {
    const current = ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number])
    const base = current >= 0 ? current : ZOOM_LEVELS.indexOf(DEFAULT_ZOOM)
    const nextIndex = Math.min(Math.max(base + direction, 0), ZOOM_LEVELS.length - 1)
    setZoom(ZOOM_LEVELS[nextIndex])
  }

  return (
    <div
      data-testid="pdf-view"
      className="relative flex h-full items-start justify-center overflow-auto bg-gray-100 py-8"
    >
      <div ref={containerRef} className="min-h-[200px]" />
      {isRendering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] text-gray-400">
          Đang render…
        </div>
      )}

      <div className="absolute bottom-[22px] left-1/2 flex h-[42px] -translate-x-1/2 items-center gap-1 rounded-[11px] border border-gray-200 bg-white px-1.5 shadow-[0_6px_20px_rgba(16,24,40,0.14)]">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="min-w-[54px] px-1.5 text-center text-[13px] tabular-nums text-gray-700">
          <strong className="font-semibold">{currentPage}</strong>
          <span className="text-gray-400"> / {pageCount}</span>
        </div>
        <button
          type="button"
          aria-label="Trang sau"
          disabled={currentPage >= pageCount}
          onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <div className="mx-1 h-5 w-px bg-gray-200" />
        <button
          type="button"
          aria-label="Thu nhỏ"
          onClick={() => stepZoom(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <div className="min-w-[42px] text-center text-[13px] tabular-nums text-gray-700">{zoom}%</div>
        <button
          type="button"
          aria-label="Phóng to"
          onClick={() => stepZoom(1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  )
}
