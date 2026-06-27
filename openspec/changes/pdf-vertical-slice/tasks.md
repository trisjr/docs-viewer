## 1. Setup & Foundation

- [x] 1.1 Cấu hình **pdf.js worker** cho Vite (`new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url))` hoặc `?url`). `pdfjs-dist@6.0.227` đã có sẵn trong `package.json` — **không** thêm dependency. Verify worker hoạt động cả ở `npm run build`, không chỉ `npm run dev`.
- [x] 1.2 Thiết lập **Tailwind design tokens** từ mockup (`docs/040-Design/Design-MOC.md` §3): primary indigo `#4F46E5`, gray scale, error red `#DC2626`/`#FEF2F2`, warning amber `#D97706`/`#FFFBEB`, font `Inter`. **Cô lập content area** (canvas PDF) khỏi Tailwind preflight để giữ fidelity (NFR-02, SDD §3.1).
- [x] 1.3 Rà soát `src/domain/ExtractedContent.ts` (`status: 'Pending'|'Ready'|'Empty'|'Failed'`) và `src/domain/DocumentSession.ts` đủ field cho error/no-text state — bổ sung tối thiểu nếu thiếu (không đổi shape không cần thiết). *(Apply finding F1: domain types đủ; bổ sung tối thiểu `RenderedDocument.renderPage?`/`dispose?` — render handle cho lazy single-page R-05/§9; chi tiết design.md.)*

## 2. ST-01 — Upload Document (entry point của slice)

- [x] 2.1 Hiện thực `validateUpload()` trong `src/app/validation.ts`: detect format theo MIME/extension + đối chiếu `MAX_FILE_SIZE` (PDF = 25 MB, SDD §8) → trả `UploadValidationResult` (`UNSUPPORTED_FORMAT` / `FILE_TOO_LARGE`).
- [x] 2.2 Wire `src/ui/UploadZone.tsx`: file picker + drag-and-drop, gọi `validateUpload`, hiển thị thông báo lỗi thân thiện (FR-01.3) — bám mockup frame 01 (dropzone) + frame 08 (card unsupported / too-large).
- [x] 2.3 Hiện thực phần đầu `DocumentService.open()` (`src/app/DocumentService.ts`): validate → `AdapterRegistry.resolve(format)` → khởi tạo `DocumentSession` → dispatch `SESSION_OPENED` (hoặc `ERROR`).
- [x] 2.4 Đảm bảo validate **hoàn tất TRƯỚC** khi bàn giao tài liệu vào pipeline View/Extract.
- [x] 2.5 Test `validateUpload`: happy + 3 unhappy (sai format / quá size / handoff order).

## 3. ST-03 + ST-06 — View PDF & Unified Viewer (làm đan xen)

- [x] 3.1 Tích hợp **PDF.js** vào `src/core/adapters/PdfAdapter.ts`: hiện thực `render(file)` → `RenderedDocument` (pages canvas). Giữ adapter pure (chỉ import `domain/`).
- [x] 3.2 Wire `src/core/worker.ts`: chạy render nặng off-main-thread qua `postMessage` (WorkerRequest `render`); chuyển `ArrayBuffer` dạng transferable (NFR-07). *(Apply note F2: cho PDF, off-main-thread = worker riêng của PDF.js (SDD §264); `src/core/worker.ts` giữ làm boundary generic, KHÔNG dùng cho PDF render — D2 defer OffscreenCanvas, canvas paint buộc main thread.)*
- [x] 3.3 Hiện thực `src/ui/views/PdfView.tsx`: render canvas trang + **phân trang** (next/prev) + **zoom cơ bản** — bám mockup frame 03 (floating toolbar `3/24` + `100%`).
- [x] 3.4 Wire `DocumentService.open()` gọi `adapter.render` + `getRendered(sessionId)` trả payload cho `PdfView`.
- [x] 3.5 Wire state thật trong `src/ui/UnifiedViewer.tsx` qua `useAppStore`: tiêu thụ `state.session` / `state.error` để route view con / empty / error (bám frame 01 ↔ 03).
- [x] 3.6 **Loading state** khi `open()` đang chạy (render/extract async qua worker) — bám mockup frame 02 (spinner + skeleton), tránh khung trống.
- [x] 3.7 Hiện thực `src/ui/ErrorBanner.tsx` hiển thị `state.error`: render fail → `DocumentSession.status = Failed`, báo lỗi (không render sai — BR-004-2); bám frame 07 (banner) + frame 08 (cards).
- [x] 3.8 Wire "mở tài liệu mới khi đang xem": dispatch `RESET` + `SESSION_OPENED` thay nội dung đang xem (UC-02 A2).
- [x] 3.9 Đảm bảo điều khiển dùng chung (mở file, ô search, đóng) nhất quán vị trí; điều khiển đặc thù PDF (phân trang/zoom) trong khu điều hướng.
- [ ] 3.10 Đo perf trang đầu trên fixture baseline → đảm bảo **≤ 3s** (KR1.3); nếu vượt, áp lazy/progressive render (SDD §9). *(Chưa tick: smoke PDF 2 trang render ~tức thì + page-1 eager/lazy đã sẵn, nhưng ≤3s CHÍNH THỨC chờ baseline fixture chuẩn từ QA — Open Question. Green build/preview ≠ đạt perf budget.)*

## 4. ST-07 — Extract PDF Text (đóng vòng slice)

- [ ] 4.1 Hiện thực `extract(file)` trong `src/core/adapters/PdfAdapter.ts`: dùng PDF.js `page.getTextContent()` → `ExtractedContent` (`textBlocks` theo thứ tự trang & đọc cơ bản).
- [ ] 4.2 Chạy extract off-main-thread qua `src/core/worker.ts` (WorkerRequest `extract`), giữ Core thuần (KR3.1). *(Apply note F2: extract off-main-thread = worker riêng PDF.js qua `getTextContent`; orchestration main-thread share 1 `getDocument` với render, không qua `src/core/worker.ts`.)*
- [ ] 4.3 Wire `DocumentService.open()` gọi `adapter.extract` + `getExtracted(sessionId)`; dispatch `EXTRACTION_READY`.
- [ ] 4.4 Hiện thực `src/ui/ExtractedContentPanel.tsx`: hiển thị nội dung trích xuất + trạng thái `Ready`/`Empty`/`Failed` — bám mockup frame 03 (panel monospace). *Nút Copy/Export hiển thị theo mockup nhưng **hành vi defer** (FR-08/ST-10 out-of-scope §8).*
- [ ] 4.5 Unhappy: PDF scan/no-text-layer → `status: Empty` + warning amber "không có text trích xuất được", **vẫn view được** (frame 08 amber card); nội dung hỏng → `Failed`, không tạo kết quả.

## 5. ST-02 — Layered Processing · Verify & Close (chạy CUỐI)

- [ ] 5.1 Verify **KR3.1**: `test/architecture/dependency-rule.test.ts` xanh — `src/core/` (kể cả `PdfAdapter` mới) không import `ui`/`app`/`data`.
- [ ] 5.2 Verify **KR3.2**: `test/core/AdapterRegistry.test.ts` xanh — `register`/`resolve` đúng, trả `undefined` cho format chưa đăng ký (backstop UC-02 E1).
- [ ] 5.3 Verify **KR3.3**: `test/data/InMemoryStorageProvider.test.ts` + `test/composition.test.ts` xanh — `StorageProvider` port + DI tại composition root.
- [ ] 5.4 Closing assertion: test khẳng định **đăng ký adapter thứ hai không cần sửa Core** (register một adapter giả → resolve được, Core không đổi).
- [ ] 5.5 Xác nhận toàn bộ enabler tests nằm trong build gate `npm test`.

## 6. Sprint DoD Gate (end-to-end PDF)

- [ ] 6.1 `npm run build` (`tsc --noEmit && vite build`) **xanh**.
- [ ] 6.2 `npm test` **xanh** (unit adapter + integration pipeline + extension-point).
- [ ] 6.3 Đối chiếu 8 checklist hành vi end-to-end của Sprint-001 §4 (upload valid/invalid/oversize · view+paginate+zoom · ≤3s · extract · no-text · corrupt).
- [ ] 6.4 Mọi file code tạo mới/sửa đáng kể có header `// AI Coding` (Clean Code Standard).
- [ ] 6.5 Đối chiếu UI với mockup các frame trong scope (01 empty · 02 loading · 03 viewer+panel · 07/08 error) — nghiệm thu hướng (b).
