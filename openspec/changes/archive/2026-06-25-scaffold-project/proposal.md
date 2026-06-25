## Why

Phase 1–2 đã chốt và approve toàn bộ requirements (PRD/SRS/NFR) lẫn architecture (SDD + ADR-001…004 + Module Contracts + Security). Trước khi implement các feature M1 (Upload, View, Extract, Search), team cần một **codebase skeleton chạy được** đóng vai trò "khuôn" — enforce cứng **Dependency Rule một chiều** (ADR-003) và **Data-Layer Separation** (ADR-004) ngay từ commit đầu tiên. Nếu mỗi feature tự dựng cấu trúc, vị trí module sẽ bị đoán mò và kiến trúc đã duyệt sẽ drift; scaffold trước loại bỏ rủi ro đó và mở khóa cho các feature change kế tiếp chỉ việc "fill in the blanks".

## What Changes

- **Toolchain**: khởi tạo project TypeScript 5 / React 19 / Vite 6 / Tailwind CSS v4 / Vitest + React Testing Library theo ADR-001; pin version; toàn bộ OSS dependency thuộc họ license permissive (Apache-2.0 / MIT / BSD — R-06).
- **Source tree**: dựng cây thư mục `src/` đúng SDD §4 — `domain/` (Shared Kernel), `ui/`, `app/`, `core/`, `data/` — và `test/` mirror.
- **Shared Kernel (`src/domain/`)**: định nghĩa **đầy đủ** các pure types/enums — `FileFormat`, `MAX_FILE_SIZE`, `DocumentSession`, `RenderedDocument`, `ExtractedContent`, search types. Đây là innermost ring, không import lớp nào, không có behavior.
- **Layer stubs (interface-conformant)**: tạo các module với chữ ký thật theo Spec-Module-Contracts, thân stub — `DocumentAdapter`/`AdapterRegistry`/`Pdf|Docx|XlsxAdapter`, `SearchEngine`/`normalize`, `core/worker.ts`, `DocumentService`/`SearchService`/`validation`/state store, `StorageProvider`/`InMemoryStorageProvider`, và React components (`UnifiedViewer` + `PdfView/DocxView/XlsxView` + `UploadZone`/`SearchBar`/`ExtractedContentPanel`/`ErrorBanner`).
- **Walking skeleton**: `main.tsx` đóng vai composition root — `registry.register()` các adapter + inject `StorageProvider` + mount React, render một `UnifiedViewer` shell rỗng (empty state). `npm run dev` serve được, `npm run build` ra static bundle, `npm test` pass smoke suite.
- **Test harness**: cấu hình Vitest + RTL + một smoke test (toolchain hoạt động + sanity Dependency Rule).
- **Non-breaking**: greenfield — `src/` và `test/` hiện là placeholder rỗng; không xóa/sửa code có sẵn.

> **Out of scope (không làm ở change này)**: logic parse/render/extract/search thật của từng định dạng, behavior upload validation thật, design tokens/visual design (defer Phase 3 — ADR-001 §2.2), auth/multi-tenant/persistence (defer M3). Các phần này thuộc các feature change M1+ kế tiếp, sẽ fill vào stubs.

## Capabilities

### New Capabilities

- `platform-foundation`: Nền tảng kiến trúc layered chạy được cho DocsViewer — toolchain build/test, Shared Kernel domain types, 4-layer skeleton tuân thủ Dependency Rule một chiều, adapter extension point (thêm format không sửa core) và storage extension point (gắn auth/multi-tenant không sửa core), walking-skeleton shell. Hiện thực hóa enabler FR-11 (EPIC-01 / ST-02), trace KR3.1/3.2/3.3 + NFR-06/NFR-09.

### Modified Capabilities

- (không có — đây là capability mới hoàn toàn; `openspec/specs/` đang rỗng.)

## Impact

- **Code**: tạo mới toàn bộ `src/` + `test/` theo SDD §4, cùng các config file ở root: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, cấu hình Tailwind v4 (CSS-first) và Vitest setup. Cập nhật `.gitignore` cho artifact build (`node_modules/`, `dist/`).
- **Dependencies (mới)**: `react`/`react-dom` 19, `typescript` 5, `vite` 6, `tailwindcss` v4, `vitest` + `@testing-library/react`; và các OSS lib lõi của Core (cài đặt nhưng chưa wiring logic): `pdfjs-dist`, `docx-preview`, `mammoth`, `xlsx`. Tất cả permissive license (R-06).
- **Systems**: không backend / DB / API server (ADR-002) — deploy static free-tier (SDD §11). Không tác động tới `docs/`, `knowledge-base/`, hay main specs trong `openspec/`.
- **Downstream**: mở khóa các feature change M1 (Upload Document, View PDF/`.docx`/`.xlsx`, Extract, In-Document Search) — mỗi change fill logic vào các stub đã được scaffold định vị sẵn.
