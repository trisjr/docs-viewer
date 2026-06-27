// AI Coding
/**
 * @file UnsupportedFormatView.tsx
 * @description Presentation — trạng thái "không có renderer cho định dạng" trong viewer (document-viewing spec,
 * mockup frame 08 card unsupported). Backstop phòng thủ: Sprint 1 chỉ PDF có renderer; non-PDF đã bị reject tại
 * upload (validateUpload) → nhánh này đảm bảo viewer KHÔNG hiện khung trống / nội dung sai nếu lọt tới (BR-004-2).
 */
import type { FileFormat } from 'domain/FileFormat'

export function UnsupportedFormatView({ format }: { format: FileFormat }) {
  return (
    <div
      data-testid="unsupported-format"
      className="flex h-full items-center justify-center bg-gray-50 p-10"
    >
      <div className="flex max-w-[460px] items-start gap-3.5 rounded-[10px] border border-gray-200 bg-white p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-red-50 text-red-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M4.9 4.9l14.2 14.2" />
          </svg>
        </div>
        <div>
          <div className="mb-1.5 text-[14.5px] font-semibold text-gray-900">Định dạng chưa hỗ trợ</div>
          <div className="text-[13px] leading-relaxed text-gray-500">
            DocsViewer chưa có trình hiển thị cho định dạng{' '}
            <span className="font-mono text-gray-700">{format}</span>. Sprint này hỗ trợ PDF.
          </div>
        </div>
      </div>
    </div>
  )
}
