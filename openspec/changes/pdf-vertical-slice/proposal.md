## Why

DocsViewer hiện mới có walking skeleton 4 lớp (toolchain + extension points) nhưng chưa xử lý được một định dạng thật nào. Sprint 1 cần chứng minh trọn pipeline **Mở → Xem → Trích xuất** end-to-end với **PDF** (RICE cao nhất trong backlog) — vừa giao giá trị người dùng đầu tiên, vừa tạo khuôn (tracer bullet) để nhân bản cho `.docx`/`.xlsx` ở các sprint sau mà không phải viết lại Core.

## What Changes

- Hiện thực **`PdfAdapter`** thật (render + extract) cắm vào `AdapterRegistry` đã có — adapter đầu tiên có logic thực, thay cho stub của walking-skeleton.
- **Upload & validate**: nhận file qua chọn/kéo-thả; validate `FileFormat` + `MAX_FILE_SIZE` (25 MB cho PDF) **TRƯỚC** khi khởi tạo `DocumentSession` và bàn giao pipeline View/Extract.
- **View PDF**: render trang qua Worker (off-main-thread); phân trang next/prev + zoom cơ bản; trang đầu của file baseline hiển thị **≤ 3 giây** (KR1.3).
- **Unified Viewer wiring**: shell tự nhận diện `FileFormat` → dispatch viewer; wiring state thật (`SESSION_OPENED` / `EXTRACTION_READY` / `ERROR`) + loading/error states thật thay cho placeholder.
- **Extract PDF text**: bóc text layer theo thứ tự đọc cơ bản, hiển thị ở `ExtractedContentPanel`, sẵn sàng cho luồng search/AI sau này.
- **Error/edge states tường minh** bám taxonomy mockup: unsupported format · oversize · corrupt (blocking, đỏ) + no-text-layer (warning amber, vẫn view được).
- **UI bám design mockup** đã import (`docs/040-Design/mockups/DocsViewer.dc.html`) — **conscious scope decision**, chi tiết ở mục Impact.
- ST-02 enabler vào sprint dưới dạng **Verify & Close**: khẳng định extension points vẫn xanh khi cắm adapter thật đầu tiên — **KHÔNG** thêm requirement mới.

## Capabilities

### New Capabilities
- `document-upload`: Nhận file (chọn/kéo-thả), validate định dạng + dung lượng, khởi tạo `DocumentSession` và bàn giao pipeline; reject tường minh khi sai định dạng / quá dung lượng / file hỏng. (ST-01 · FR-01)
- `document-viewing`: Unified Viewer tự nhận diện `FileFormat` và dispatch renderer; với PDF render trang + phân trang + zoom cơ bản, trang đầu ≤ 3s; báo trạng thái lỗi thay vì render nội dung sai. (ST-03 + ST-06 · FR-02/FR-05)
- `content-extraction`: Trích xuất text PDF (text layer) theo thứ tự đọc cơ bản, hiển thị để xem lại và sẵn sàng cho search/AI; xử lý PDF scan/no-text-layer và lỗi parse một cách tường minh. (ST-07 · FR-06)

### Modified Capabilities
<!-- Không requirement nào của capability hiện hữu thay đổi → để trống theo schema. -->
- (none) — `platform-foundation` chỉ được **verify**, không sửa requirement: Sprint 1 cắm `PdfAdapter` thật để khẳng định các requirement *Pluggable Adapter Extension Point*, *Storage Extension Point*, *Core Purity*, *One-Way Layered Dependency Rule* vẫn được thỏa (ST-02 — Verify & Close).

## Impact

- **Code**
  - `src/core/`: thêm `PdfAdapter` (render + extract qua `pdfjs-dist`); nối heavy parsing vào `src/core/worker.ts` (off-main-thread, NFR-01/07).
  - `src/app/`: `DocumentService` (open → khởi tạo session → dispatch); hoàn thiện `validation.ts` (gate format + size).
  - `src/ui/`: `UploadZone`, `UnifiedViewer` (state wiring + loading/error), `ExtractedContentPanel`, `ErrorBanner` — bám mockup. `SearchBar` **defer** (out-of-scope §8).
  - `src/domain/`: tái dùng `FileFormat`, `MAX_FILE_SIZE`, `DocumentSession`, `RenderedDocument`, `ExtractedContent` (giữ shape; chỉ bổ sung field nếu thiếu cho error / no-text state).
- **Dependencies**: `pdfjs-dist@6.0.227` **đã có sẵn** trong `package.json` (cùng `docx-preview`/`mammoth`/`xlsx`) — **không** thêm dependency mới; chỉ cần cấu hình pdf.js worker cho Vite.
- **Extension points (verify — không đổi)**: `AdapterRegistry`, `StorageProvider`/`InMemoryStorageProvider`, Core purity, Dependency Rule (ADR-003/004) — là gate đóng của ST-02.
- **Scope decision (governance)**: chọn hướng **(b)** — implement UI Sprint-1 **bám sát** `docs/040-Design/mockups/DocsViewer.dc.html`. Điều này **mở rộng** so với **ADR-001 §2.2** và **Sprint-001 §7** (đều defer visual design — "UI ở mức functional, đánh giá hành vi không thẩm mỹ"). Quyết định có chủ đích vì đã sẵn mockup high-fidelity. → **Đề xuất amend ADR-001 §2.2** (superseding note): AC hành vi vẫn là tiêu chí Done; design fidelity là tiêu chí bổ sung, không thay thế.
- **Out of scope** (Sprint-001 §8): view+extract `.docx`/`.xlsx`, search (ST-11), copy/export (ST-10), highlight/navigate search (ST-12). Mockup có sẵn các screen này nhưng **không** implement ở Sprint 1.
