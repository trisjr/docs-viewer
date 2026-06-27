// AI Coding
/**
 * @file OpenFileButton.tsx
 * @description Presentation — nút "Mở file" trên shell top bar (mở tài liệu mới khi đang xem, UC-02 A2).
 * Dùng chung useOpenDocument với UploadZone (một đường xử lý duy nhất).
 */
import { useRef, type ChangeEvent } from 'react'
import { useOpenDocument } from './useOpenDocument'

export function OpenFileButton() {
  const openDocument = useOpenDocument()
  const inputRef = useRef<HTMLInputElement>(null)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) void openDocument(file)
    event.target.value = ''
  }

  return (
    <>
      <button
        type="button"
        data-testid="open-file-button"
        onClick={() => inputRef.current?.click()}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 16V5" />
          <path d="M8 9l4-4 4 4" />
          <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
        </svg>
        Mở file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={onChange}
      />
    </>
  )
}
