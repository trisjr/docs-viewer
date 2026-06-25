// AI Coding
/**
 * @file UnifiedViewer.test.tsx
 * @description Smoke test — UnifiedViewer shell mount ở empty state không crash (walking skeleton, tasks 7.2/8.1).
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UnifiedViewer } from 'ui/UnifiedViewer'
import { AppStoreProvider } from 'app/state/store'
import { createComposition } from '../../src/composition'

describe('UnifiedViewer (walking-skeleton shell)', () => {
  it('mount empty state không crash và hiển thị UploadZone', () => {
    const { documentService, searchService } = createComposition()

    render(
      <AppStoreProvider services={{ documentService, searchService }}>
        <UnifiedViewer />
      </AppStoreProvider>,
    )

    expect(screen.getByTestId('unified-viewer')).toBeInTheDocument()
    expect(screen.getByTestId('upload-zone')).toBeInTheDocument()
  })
})
