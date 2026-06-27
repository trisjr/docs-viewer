// AI Coding
/**
 * @file ExtractedContentPanel.tsx
 * @description Presentation — panel nội dung trích xuất (FR-06, mockup frame 03). Component THUẦN nhận `extracted`
 * (UnifiedViewer truyền state.extracted) → render theo status: Ready (monospace), Empty (amber, vẫn view được — D7),
 * Failed (đỏ). Nút Copy/Export hiển thị theo mockup nhưng disabled — hành vi defer Sprint sau (FR-08/ST-10, §8).
 */
import type { ExtractedContent } from 'domain/ExtractedContent'

const DEFER_TITLE = 'Tính năng ở Sprint sau'

function WarningIcon({ className }: { className: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.3 3.6L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function PanelBody({ extracted }: { extracted: ExtractedContent | null }) {
  if (!extracted || extracted.status === 'Pending') {
    return <div className="p-4 text-[13px] text-gray-400">Đang trích xuất nội dung…</div>
  }

  if (extracted.status === 'Empty') {
    return (
      <div className="m-4 flex items-start gap-3.5 rounded-[10px] border border-amber-200 bg-amber-50 p-[22px]">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-amber-100 text-amber-600">
          <WarningIcon className="" />
        </div>
        <div>
          <div className="mb-1 text-[14.5px] font-semibold text-amber-800">Không có text trích xuất được</div>
          <div className="text-[13px] leading-[1.6] text-amber-700">
            PDF này có vẻ là ảnh scan nên không có text để sao chép hay tìm kiếm. Vẫn có thể xem toàn bộ trang.
          </div>
        </div>
      </div>
    )
  }

  if (extracted.status === 'Failed') {
    return (
      <div className="m-4 flex items-start gap-3.5 rounded-[10px] border border-red-200 bg-red-50 p-[22px]">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-red-100 text-red-600">
          <WarningIcon className="" />
        </div>
        <div>
          <div className="mb-1 text-[14.5px] font-semibold text-red-700">Không trích xuất được nội dung</div>
          <div className="text-[13px] leading-[1.6] text-red-600">
            Tài liệu mở được nhưng phần text bị lỗi khi trích xuất.
          </div>
        </div>
      </div>
    )
  }

  const text = (extracted.textBlocks ?? []).map((block) => block.text).join('\n\n')
  return (
    <div className="flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-[12px] leading-[1.75] text-gray-700">
      {text}
    </div>
  )
}

export function ExtractedContentPanel({ extracted }: { extracted: ExtractedContent | null }) {
  return (
    <aside
      data-testid="extracted-content-panel"
      className="flex w-[340px] shrink-0 flex-col border-l border-gray-200 bg-white"
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 pl-4 pr-2.5">
        <span className="text-[13px] font-semibold text-gray-900">Nội dung trích xuất</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled
            title={DEFER_TITLE}
            className="flex h-7 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            Sao chép
          </button>
          <button
            type="button"
            disabled
            title={DEFER_TITLE}
            className="flex h-7 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="M7 11l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Xuất
          </button>
        </div>
      </div>
      <PanelBody extracted={extracted} />
    </aside>
  )
}
