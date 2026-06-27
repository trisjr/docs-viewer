## Context

Walking skeleton 4 lớp (`ui → app → core`, `app → data`, mọi lớp → `domain`) + Shared Kernel + extension points (`AdapterRegistry`, `StorageProvider`) đã merge và build xanh. SDD và Module Contracts đã approved (ADR-001..004). Sprint 1 là **lát cắt dọc thật đầu tiên**: PDF *Mở → Xem → Trích xuất*, hiện thực qua chính các extension point sẵn có — **không viết lại Core**.

Bổ sung so với plan gốc: theo quyết định scope **(b)** (xem `proposal.md` › Impact), UI Sprint 1 được implement **bám sát** mockup high-fidelity đã import (`docs/040-Design/mockups/DocsViewer.dc.html`). Điều này mở rộng so với **ADR-001 §2.2** + **Sprint-001 §7** (defer visual design) → đã đề xuất amend ADR-001 §2.2; AC hành vi vẫn là gate Done, visual fidelity là tiêu chí bổ sung.

**Ràng buộc nền (kế thừa, không thương lượng):** client-side 100% (ADR-002) · Dependency Rule một chiều (ADR-003) · Core pure, không phụ thuộc UI/user identity (KR3.1) · heavy parsing off-main-thread (NFR-01/07) · `MAX_FILE_SIZE` PDF = 25 MB (SDD §8) · trang đầu baseline ≤ 3s (KR1.3).

## Goals / Non-Goals

**Goals:**
- Hiện thực `PdfAdapter` thật (render canvas + extract text qua `pdfjs-dist`) implement interface `DocumentAdapter` đã có, đăng ký tại composition root — không sửa interface/registry.
- Hoàn thiện pipeline `DocumentService.open`: `validate → resolve adapter → render → extract`, phát session lifecycle (`SESSION_OPENED` / `EXTRACTION_READY` / `ERROR`) cho state store.
- Wire `UnifiedViewer` + `PdfView` (canvas, phân trang, zoom) + `ExtractedContentPanel` + `UploadZone` + `ErrorBanner`, style bám mockup (Tailwind tokens).
- Error taxonomy bám mockup: 3 blocking (`UNSUPPORTED_FORMAT` / `FILE_TOO_LARGE` / `CORRUPT`, đỏ) + 1 non-blocking (`Empty` no-text-layer, amber).
- ST-02 **Verify & Close**: extension-point tests (`AdapterRegistry`, `dependency-rule`, `InMemoryStorageProvider`, `composition`) vẫn xanh khi cắm adapter thật đầu tiên.

**Non-Goals:**
- `.docx`/`.xlsx` render/extract, In-Document Search (`SearchEngine`/`SearchBar`/`SearchService`), Copy/Export (`copyExtracted`/`exportExtracted`) — defer (§8). Contract đã có nhưng **không** implement ở Sprint 1.
- OCR cho PDF scan (defer M2). Persistence/auth/multi-tenant (defer M3 — `StorageProvider` giữ `InMemory`).
- Pixel-perfect tuyệt đối: bám mockup ở mức layout/tokens/states, không cam kết từng pixel.

## Decisions

**D1 — `pdfjs-dist` cho cả render lẫn extract.** Một lib phủ cả hai: render canvas (`page.render`) + extract text-layer (`page.getTextContent()`); là lựa chọn canonical của ADR-001 và tự mang Web Worker riêng. *Alternative:* tách lib render và lib extract — loại (thừa, `getTextContent` đủ cho text-layer; tăng bundle + bề mặt bảo mật).

**D2 — Off-main-thread qua Web Worker của pdf.js; canvas paint ở main thread.** pdf.js worker đảm nhận parse nặng (giữ main thread responsive — NFR-01/07); thao tác paint lên `<canvas>` 2D buộc ở main thread (cần DOM) — đây là ngoại lệ có chủ đích, **đối xứng** với ngoại lệ `DocxAdapter.render` đã ghi ở SDD §4, không phải vi phạm kiến trúc. *Alternative:* parse trên main thread — loại (vi phạm NFR-01 ≤3s + jank). *Alternative:* OffscreenCanvas render trong worker — defer (phức tạp, lợi ích biên cho MVP single-page render).

**D3 — `PdfAdapter` cắm qua `AdapterRegistry`, không bypass.** Giữ nguyên invariant extension point (KR3.2) để ST-02 verify được; logic adapter pure (chỉ phụ thuộc `domain/`). *Alternative:* đường PDF riêng bỏ qua registry — loại (phá vỡ tiền đề enabler, làm ST-02 vô nghĩa).

**D4 — Validation gate (`app/validation.ts`) chạy TRƯỚC khi resolve adapter.** Kiểm format (extension/MIME) + size → `UploadValidationResult` (`UNSUPPORTED_FORMAT` / `FILE_TOO_LARGE`). `CORRUPT` **không** bắt ở gate này mà phát hiện downstream khi `render`/`extract` reject → `DocumentSession.status = 'Failed'`. Khớp đúng contract Module-Contracts §3.2/§4.1.

**D5 — Session lifecycle qua state store (React Context + useReducer — ADR-001 KISS, không Redux).** Map sự kiện → mockup states: `SESSION_OPENED`→`Loading` (frame 02) · render xong→`Rendered` (frame 03) · `EXTRACTION_READY`→gắn `ExtractedContent` (`Ready` hiển thị panel / `Empty` hiện warning amber) · `ERROR`→`Failed` + `ErrorBanner` (frame 07/08). Trạng thái rỗng ban đầu = frame 01.

**D6 — UI bám mockup qua Tailwind design tokens.** Ánh xạ palette mockup → theme tokens (primary indigo `#4F46E5`; gray scale; error red `#DC2626`/`#FEF2F2`; warning amber `#D97706`/`#FFFBEB`; font `Inter`). **Content area** (canvas PDF) **cô lập khỏi Tailwind preflight** để giữ fidelity (SDD §3.1, NFR-02). Chi tiết tokens/screens: `docs/040-Design/Design-MOC.md`.

**D7 — No-text-layer = `ExtractedContent.status: 'Empty'` (non-blocking).** Phân biệt rạch ròi với `Failed` (blocking): `Empty` → warning amber "không có text trích xuất được" + **vẫn view bình thường** (mockup frame 08 card amber, UC-03 E1); `Failed` → error đỏ. Đây là khác biệt hành vi cốt lõi, không chỉ là màu sắc.

## Risks / Trade-offs

- **[R-01 — Độ trung thực render PDF, score 9 — rủi ro số 1]** → render canvas theo `devicePixelRatio`; phát hiện render fail → `Failed` (không hiển thị nội dung sai âm thầm — BR-004-2); nghiệm thu đối chiếu cả hành vi (AC) lẫn mockup frame 03.
- **[R-05 — File lớn / bộ nhớ trình duyệt]** → `MAX_FILE_SIZE` 25MB pre-check (chặn trước parse) + worker + **lazy render** (chỉ render trang trong viewport, nạp dần khi phân trang — SDD §9), tránh dựng toàn bộ tài liệu.
- **[pdf.js worker bundling trong Vite]** → cấu hình worker entry theo cách Vite khuyến nghị (`new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url))` hoặc `?url`); pin version `pdfjs-dist`; smoke test trên `npm run build` (không chỉ dev).
- **[Tailwind preflight phá fidelity canvas]** → cô lập content area khỏi preflight (D6).
- **[Worker postMessage payload]** → chuyển `ArrayBuffer` dạng transferable để tránh copy (NFR-07); lưu ý giới hạn structured-clone.
- **[Scope (b) lệch ADR-001 §2.2]** → đã ghi proposal + đề xuất amend; behavioral AC vẫn là gate Done, visual fidelity là additive (không thay thế).

## Migration Plan

Frontend-only, **không** data migration / không persistence → không có rollback phức tạp. Triển khai tăng dần trên skeleton xanh: (1) cấu hình pdf.js worker cho Vite (`pdfjs-dist@6.0.227` **đã có sẵn** trong `package.json`) → (2) `PdfAdapter.render`/`.extract` → (3) wire `DocumentService.open` + state store → (4) UI states bám mockup → (5) test (unit adapter + integration pipeline + ST-02 extension-point gate). Rollback = revert change (tính năng additive, không đổi schema/state nền).

## Open Questions

- **Baseline fixture cho NFR-01 ≤3s (KR1.3)**: dùng file PDF baseline nào (NFR §4.2)? → QA cung cấp fixture chuẩn trước verify.
- **Zoom**: bước rời rạc (mockup hiển thị `100%`) hay liên tục? → khởi đầu bằng các bước rời rạc (vd 50–200%).
- **`.docx`/`.xlsx` ở Sprint 1**: reject ngay tại upload, hay accept rồi báo "định dạng không được hỗ trợ" tại viewer? **Lưu ý cạm bẫy**: composition root (platform-foundation spec) register **cả 3 adapter** lúc startup → `AdapterRegistry.resolve(DOCX)` trả về **stub adapter, KHÔNG phải `undefined`** → nhánh "unsupported" **không thể** key theo `resolve()→undefined`. Fix ở apply-time: (a) stub adapter báo unsupported tường minh, hoặc (b) không register `.docx`/`.xlsx` ở Sprint 1. Đề xuất: PDF đầy đủ; non-PDF cho trạng thái "định dạng không được hỗ trợ" thân thiện (không crash). Mockup empty-state quảng bá 3 định dạng = copy aspirational.

## Apply-time findings (M1 — pdf-vertical-slice)

- **F1 — `RenderedDocument` trở thành render handle (deviation tối thiểu, có chủ đích).** Để biểu đạt LAZY single-page render (R-05/SDD §9) trong khi `DocumentAdapter` interface giữ đóng băng và UI không import pdf.js (SDD §3.1), bổ sung 2 field optional vào `RenderedDocument`: `renderPage?(pageNumber, scale)` + `dispose?()`. Đây là behavior + resource handle nằm trong Shared Kernel (RenderedDocument vốn đã giữ live `HTMLCanvasElement`, không phải DTO thuần) — ghi nhận là deviation, không nâng thành ADR (proportionate MVP). Lifecycle: `DocumentService.open` gọi `dispose()` tài liệu cũ trước khi mở mới → `task.destroy()` giải phóng worker buffers (tránh leak R-05).
- **F2 — Worker cho PDF = worker riêng của PDF.js (interpretation tasks 3.2/4.2).** Off-main-thread parse do worker của PDF.js đảm nhận (SDD §264, config task 1.1); `src/core/worker.ts` giữ làm boundary generic cho format tương lai, KHÔNG dùng cho PDF render — D2 đã defer OffscreenCanvas-in-worker nên canvas paint buộc ở main thread. Verify: worker chunk emit thành asset riêng trong `dist/` + browser smoke không có cảnh báo "Setting up fake worker".
- **F3 — Non-PDF ở Sprint 1 = reject tại upload (quyết định User).** `validateUpload` chỉ coi PDF là supported → non-PDF trả `UNSUPPORTED_FORMAT` ngay tại gate (không chạm stub adapter, né cạm bẫy `resolve()→stub`). Backstop "no-renderer" của document-viewing spec giữ phòng thủ qua `UnsupportedFormatView` (route trong `UnifiedViewer`) + test trực tiếp component — vì reject-at-upload làm nhánh này bất khả đạt qua luồng thường.
