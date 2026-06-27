// AI Coding
/**
 * @file pdfjsSetup.ts
 * @description Core — cấu hình PDF.js cho Vite: trỏ `GlobalWorkerOptions.workerSrc` tới worker bundle.
 * PDF.js mang worker riêng (ADR-001, SDD §264) đảm nhận parse nặng off-main-thread (NFR-01/07);
 * canvas paint vẫn ở main thread (D2 — ngoại lệ có chủ đích, đối xứng DocxAdapter.render, SDD §198).
 *
 * `?url` để Vite emit worker thành static asset (hoạt động cả `dev` lẫn `build`); `worker.format:'es'`
 * trong vite.config khớp ESM worker của pdfjs v6. Module này được import ĐỘNG từ PdfAdapter.render/extract
 * để không nạp pdfjs lúc eval (giữ test AdapterRegistry/composition nhẹ, tránh DOMMatrix/Path2D trong jsdom).
 */
import * as pdfjs from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export { pdfjs }
