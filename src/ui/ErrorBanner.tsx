// AI Coding
/**
 * @file ErrorBanner.tsx
 * @description Presentation — banner thông báo lỗi thân thiện (FR-01.3, UC-02 E1/E2/E3). Scaffold placeholder.
 */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      data-testid="error-banner"
      className="border-b border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      {message}
    </div>
  )
}
