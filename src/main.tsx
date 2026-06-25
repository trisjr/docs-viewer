// AI Coding
/**
 * @file main.tsx
 * @description Composition root — wiring qua createComposition() rồi inject services + mount React.
 * Walking skeleton: render UnifiedViewer shell (empty state); KHÔNG gọi render/extract lúc khởi động.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createComposition } from './composition'
import { AppStoreProvider } from 'app/state/store'
import { UnifiedViewer } from 'ui/UnifiedViewer'

const { documentService, searchService } = createComposition()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Không tìm thấy phần tử #root để mount ứng dụng')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppStoreProvider services={{ documentService, searchService }}>
      <UnifiedViewer />
    </AppStoreProvider>
  </StrictMode>,
)
