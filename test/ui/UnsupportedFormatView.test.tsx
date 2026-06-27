// AI Coding
/**
 * @file UnsupportedFormatView.test.tsx
 * @description Test trực tiếp trạng thái no-renderer (document-viewing spec): hiển thị "không hỗ trợ" thay vì
 * khung trống. Backstop B1 reject-at-upload làm nhánh này bất khả đạt qua luồng thường → test component trực tiếp.
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UnsupportedFormatView } from 'ui/UnsupportedFormatView'
import { FileFormat } from 'domain/FileFormat'

describe('UnsupportedFormatView (no-renderer backstop)', () => {
  it('hiển thị trạng thái không hỗ trợ thay vì khung trống', () => {
    render(<UnsupportedFormatView format={FileFormat.DOCX} />)

    expect(screen.getByTestId('unsupported-format')).toBeInTheDocument()
    expect(screen.getByText(/chưa hỗ trợ/i)).toBeInTheDocument()
  })
})
