// AI Coding
/**
 * @file ExtractedContentPanel.test.tsx
 * @description Test panel trích xuất (prop-driven, không cần store): Ready hiện text monospace · Empty hiện cảnh báo
 * amber (vẫn view được, D7) · Failed báo lỗi đỏ · Copy/Export hiển thị nhưng disabled (hành vi defer FR-08).
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ExtractedContentPanel } from 'ui/ExtractedContentPanel'
import { FileFormat } from 'domain/FileFormat'

describe('ExtractedContentPanel', () => {
  it('Ready → hiển thị text trích xuất + nút Copy/Export disabled (defer)', () => {
    render(
      <ExtractedContentPanel
        extracted={{
          documentId: 'doc-1',
          format: FileFormat.PDF,
          status: 'Ready',
          textBlocks: [{ ref: 'page-1', text: 'QUARTERLY BUSINESS REVIEW' }],
        }}
      />,
    )

    expect(screen.getByText(/QUARTERLY BUSINESS REVIEW/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sao chép/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /xuất/i })).toBeDisabled()
  })

  it('Empty → cảnh báo amber "không có text", vẫn view được (D7)', () => {
    render(
      <ExtractedContentPanel
        extracted={{ documentId: 'doc-1', format: FileFormat.PDF, status: 'Empty' }}
      />,
    )

    expect(screen.getByText(/không có text trích xuất được/i)).toBeInTheDocument()
  })

  it('Failed → báo lỗi trích xuất', () => {
    render(
      <ExtractedContentPanel
        extracted={{ documentId: 'doc-1', format: FileFormat.PDF, status: 'Failed' }}
      />,
    )

    expect(screen.getByText(/không trích xuất được nội dung/i)).toBeInTheDocument()
  })

  it('chưa có extracted (null) → placeholder đang trích xuất', () => {
    render(<ExtractedContentPanel extracted={null} />)

    expect(screen.getByText(/đang trích xuất/i)).toBeInTheDocument()
  })
})
