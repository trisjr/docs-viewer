// AI Coding
/**
 * @file ErrorBanner.tsx
 * @description Presentation — banner lỗi blocking (mockup frame 07): đỏ cho cả 3 kind blocking
 * (UNSUPPORTED_FORMAT / FILE_TOO_LARGE / CORRUPT — UC-02 E1/E2/E3, BR-004-2).
 * No-text-layer là cảnh báo non-blocking amber (D7) → KHÔNG dùng banner này.
 */
import type { AppError } from 'app/state/reducer'

export function ErrorBanner({
  error,
  onDismiss,
}: {
  error: AppError
  onDismiss?: () => void
}) {
  return (
    <div
      role="alert"
      data-testid="error-banner"
      className="flex items-center gap-2.5 border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-red-600"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </svg>
      <span>{error.message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Đóng thông báo"
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-red-700 hover:bg-red-100"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
