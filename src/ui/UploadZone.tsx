// AI Coding
/**
 * @file UploadZone.tsx
 * @description Presentation — vùng chọn/kéo-thả file (FR-01, mockup frame 01). Cùng một đường xử lý cho picker
 * lẫn drag-drop qua useOpenDocument (gatekeeper validate ở DocumentService.open; lỗi → banner đỏ frame 07).
 */
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useOpenDocument } from './useOpenDocument'

export function UploadZone() {
  const openDocument = useOpenDocument()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setDragging] = useState(false)

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) void openDocument(file)
    event.target.value = ''
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) void openDocument(file)
  }

  return (
    <div
      className="flex h-full items-center justify-center bg-gray-50 p-12"
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <button
        type="button"
        data-testid="upload-zone"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full max-w-[560px] flex-col items-center rounded-[14px] border-2 border-dashed bg-white px-10 py-14 text-center transition-colors ${
          isDragging ? 'border-primary bg-indigo-50/50' : 'border-gray-300'
        }`}
      >
        <span className="mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-[16px] bg-indigo-50 text-primary">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V4" />
            <path d="M7 9l5-5 5 5" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </span>
        <span className="mb-2 text-lg font-semibold text-gray-900">
          Kéo file vào đây hoặc <span className="text-primary">bấm để chọn</span>
        </span>
        <span className="text-[13.5px] leading-relaxed text-gray-500">
          Hỗ trợ PDF · tối đa 25&nbsp;MB
        </span>
        <span className="mt-6 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
          PDF
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}
