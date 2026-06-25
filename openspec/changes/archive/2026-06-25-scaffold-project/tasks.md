## 1. Toolchain & Project Setup

- [x] 1.1 Khởi tạo `package.json` — pin version `react`/`react-dom` 19, `typescript` 5, `vite` 6 + `@vitejs/plugin-react`; scripts `dev`/`build`/`preview`/`test`
- [x] 1.2 Cài & cấu hình Tailwind CSS v4 (CSS-first) + cô lập `preflight` khỏi content area (ADR-001 caveat, Integration Spec)
- [x] 1.3 Cấu hình `tsconfig*.json` (strict, path alias `domain/ui/app/core/data`), `vite.config.ts`, `index.html`
- [x] 1.4 Cài OSS deps lõi Core (`pdfjs-dist`, `docx-preview`, `mammoth`, `xlsx`) — cài sẵn, chưa wiring logic; verify license permissive
- [x] 1.5 Cấu hình Vitest + React Testing Library (env `jsdom`, setup file) + cập nhật `.gitignore` (`node_modules/`, `dist/`)

## 2. Shared Kernel (`src/domain/`) — định nghĩa đầy đủ

- [x] 2.1 `FileFormat.ts` (enum) + `limits.ts` (`MAX_FILE_SIZE: Record<FileFormat, number>` = PDF 25MB / `.docx` 25MB / `.xlsx` 15MB — SDD §8)
- [x] 2.2 `DocumentSession.ts` (id/fileName/format/fileSize/status/createdAt — theo DB-Entity)
- [x] 2.3 `RenderedDocument.ts` (+ `RenderedPage`, `RenderedSheet`)
- [x] 2.4 `ExtractedContent.ts` (+ `TextBlock`, `SheetData`, status `Pending`/`Ready`/`Empty`/`Failed`)
- [x] 2.5 `search.ts` (`SearchIndex`, `NormalizedSegment`, `SearchMatch`, `SearchResultSet`)

## 3. Document Processing Layer (`src/core/`) — pure stubs

- [x] 3.1 `adapters/DocumentAdapter.ts` — interface `canHandle`/`render`/`extract`
- [x] 3.2 `adapters/AdapterRegistry.ts` — `register`/`resolve`; trả lỗi "định dạng không được hỗ trợ" khi format chưa đăng ký
- [x] 3.3 `adapters/PdfAdapter.ts` + `DocxAdapter.ts` + `XlsxAdapter.ts` — `canHandle` hiện thực thật; `render`/`extract` stub `NotImplementedError`
- [x] 3.4 `search/normalize.ts` + `search/SearchEngine.ts` — chữ ký `buildIndex`/`search`/`next`/`prev` (stub)
- [x] 3.5 `core/worker.ts` — Web Worker entry (postMessage boundary skeleton); ghi chú ngoại lệ `DocxAdapter.render` chạy main thread

## 4. Data / User Layer (`src/data/`)

- [x] 4.1 `StorageProvider.ts` — port interface `save`/`load`/`clear`
- [x] 4.2 `InMemoryStorageProvider.ts` — impl MVP, no-persist (privacy by design)

## 5. Application Layer (`src/app/`)

- [x] 5.1 `validation.ts` — `UploadValidationResult`, `UploadError` (chữ ký, stub)
- [x] 5.2 `DocumentService.ts` — Facade `open`/`getRendered`/`getExtracted`/`copyExtracted`/`exportExtracted` (stub)
- [x] 5.3 `SearchService.ts` — bọc `SearchEngine` cho UI (stub)
- [x] 5.4 `state/reducer.ts` + `state/store.tsx` — Context + useReducer giữ session state tối thiểu

## 6. Presentation Layer (`src/ui/`) — shell

- [x] 6.1 `UnifiedViewer.tsx` — shell empty state + route tới view con phù hợp
- [x] 6.2 `views/PdfView.tsx` + `DocxView.tsx` + `XlsxView.tsx` — placeholder
- [x] 6.3 `UploadZone.tsx` + `SearchBar.tsx` + `ExtractedContentPanel.tsx` + `ErrorBanner.tsx` — chrome placeholder

## 7. Composition Root & Walking Skeleton

- [x] 7.1 `main.tsx` — `registry.register()` 3 adapter + inject `StorageProvider` vào `DocumentService` + mount React render `UnifiedViewer`
- [x] 7.2 Verify app mount + render `UnifiedViewer` shell (empty state) không crash

## 8. Test Harness & Verification

- [x] 8.1 Dựng `test/` mirror cấu trúc `src/`; smoke test: render `UnifiedViewer` (RTL) + `AdapterRegistry` resolve/unsupported-format
- [x] 8.2 Sanity Dependency Rule: `core/` không import `ui`/`app`/`data`; `domain/` không import lớp nào
- [x] 8.3 Chạy `npm run build` (ra static bundle) + `npm test` (pass) + `npm run dev` (mount) — xác nhận cả ba xanh
- [x] 8.4 (tùy chọn) `/opsx-verify scaffold-project` trước khi `/opsx-archive`
