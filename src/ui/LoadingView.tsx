// AI Coding
/**
 * @file LoadingView.tsx
 * @description Presentation — trạng thái đang mở tài liệu (mockup frame 02): spinner + filename·size + skeleton page.
 * Tránh khung trống trong lúc render/extract async (ST-06).
 */
function toMB(bytes: number): string {
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`
}

export function LoadingView({ fileName, fileSize }: { fileName: string; fileSize: number }) {
  return (
    <div
      data-testid="loading-view"
      className="flex h-full flex-col items-center justify-center bg-gray-50"
    >
      <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary" />
      <div className="mt-5 text-[15px] font-medium text-gray-700">Đang mở tài liệu…</div>
      <div className="mt-1.5 text-[12.5px] text-gray-400">
        {fileName} · {toMB(fileSize)}
      </div>
      <div className="mt-9 w-[420px] max-w-[80%] rounded-lg border border-gray-200 bg-white p-7 shadow-sm">
        <div className="h-[18px] w-[62%] animate-pulse rounded bg-gray-200" />
        <div className="mt-[18px] h-2.5 w-full animate-pulse rounded bg-gray-100" />
        <div className="mt-2.5 h-2.5 w-[96%] animate-pulse rounded bg-gray-100" />
        <div className="mt-2.5 h-2.5 w-[88%] animate-pulse rounded bg-gray-100" />
        <div className="mt-2.5 h-2.5 w-[70%] animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}
