# platform-foundation Specification

## Purpose
TBD - created by archiving change scaffold-project. Update Purpose after archive.
## Requirements
### Requirement: Build & Test Toolchain
Project SHALL cung cấp một toolchain TypeScript + React + Vite hoạt động, build ra static bundle, serve dev server, và chạy test suite — không có backend ở MVP (ADR-001, ADR-002).

#### Scenario: Production build ra static bundle
- **WHEN** chạy `npm run build`
- **THEN** Vite tạo static bundle (HTML/JS/CSS) trong `dist/` mà không cần server runtime

#### Scenario: Dev server mount được app
- **WHEN** chạy `npm run dev`
- **THEN** Vite dev server phục vụ ứng dụng và React app mount thành công

#### Scenario: Smoke test pass
- **WHEN** chạy `npm test`
- **THEN** Vitest chạy smoke suite và toàn bộ test pass với exit code 0

### Requirement: One-Way Layered Dependency Rule
Codebase SHALL được tổ chức thành bốn lớp theo SDD §4 (`src/ui/`, `src/app/`, `src/core/`, `src/data/`) cộng Shared Kernel (`src/domain/`), với import chỉ đi một chiều: `ui → app → core`, `app → data` (qua port), và mọi lớp → `domain`. Core MUST NOT import từ `ui`/`app`/`data`.

#### Scenario: Core không import lớp ngoài
- **WHEN** kiểm tra import của bất kỳ module nào trong `src/core/`
- **THEN** không có import nào trỏ tới `src/ui/`, `src/app/`, hoặc `src/data/`

#### Scenario: Domain là innermost ring
- **WHEN** kiểm tra import của bất kỳ module nào trong `src/domain/`
- **THEN** không có import nào trỏ tới lớp khác (`ui`/`app`/`core`/`data`)

### Requirement: Shared Kernel Domain Types
Shared Kernel (`src/domain/`) SHALL định nghĩa domain data model dưới dạng pure types/enums — không có behavior và không import từ lớp nào — để cả bốn lớp đều phụ thuộc hướng vào nó (Clean Architecture entities-at-center, SDD §4).

#### Scenario: Domain types compile độc lập
- **WHEN** TypeScript compile `src/domain/`
- **THEN** các type `FileFormat`, `MAX_FILE_SIZE`, `DocumentSession`, `RenderedDocument`, `ExtractedContent`, và search types compile thành công mà không cần import từ `ui`/`app`/`core`/`data`

#### Scenario: FileFormat và MAX_FILE_SIZE là single source
- **WHEN** một lớp bất kỳ cần `FileFormat` hoặc ngưỡng `MAX_FILE_SIZE`
- **THEN** lớp đó import từ `src/domain/`, không tự định nghĩa lại

### Requirement: Pluggable Adapter Extension Point
Core SHALL expose interface `DocumentAdapter` và một `AdapterRegistry` cho phép register/resolve adapter theo `FileFormat`, sao cho thêm định dạng mới chỉ cần thêm adapter + `registry.register()` mà KHÔNG sửa Core hiện hữu (FR-11.2, KR3.2, ADR-003).

#### Scenario: Resolve adapter theo format đã đăng ký
- **WHEN** `AdapterRegistry` được resolve với một `FileFormat` đã register
- **THEN** registry trả về đúng `DocumentAdapter` đã đăng ký cho format đó

#### Scenario: Format chưa có adapter
- **WHEN** `AdapterRegistry` được resolve với một `FileFormat` chưa có adapter
- **THEN** hệ thống báo lỗi "định dạng không được hỗ trợ" thay vì xử lý sai (UC-02 E1, ST-02)

### Requirement: Storage Extension Point (Data-Layer Separation)
Data Layer SHALL định nghĩa port `StorageProvider` với impl MVP `InMemoryStorageProvider` (no persist), và Core MUST NOT phụ thuộc storage hay user identity — `StorageProvider` được inject từ composition root, sao cho gắn auth/multi-tenant về sau chỉ cần thay impl mà không sửa Core (FR-11.3, KR3.1/KR3.3, ADR-004).

#### Scenario: StorageProvider được inject từ composition root
- **WHEN** ứng dụng khởi tạo ở `main.tsx`
- **THEN** một impl `StorageProvider` được inject vào Application Layer, và Core không tham chiếu trực tiếp tới bất kỳ impl storage nào

#### Scenario: InMemoryStorageProvider không persist
- **WHEN** session kết thúc với `InMemoryStorageProvider`
- **THEN** dữ liệu session không được ghi ra ngoài bộ nhớ runtime (privacy by design — R-03, NFR-05)

### Requirement: Core Purity (UI/Identity-Independent)
Document Processing Layer (`src/core/`) SHALL là pure — không phụ thuộc React/DOM của Presentation hay danh tính người dùng — ngoại trừ ngoại lệ có chủ đích `DocxAdapter.render` cần `document` và chạy main thread (Integration Spec §7, SDD §4). Heavy parsing MUST được định vị off-main-thread qua Worker entry (NFR-01/07).

#### Scenario: Core không import Presentation
- **WHEN** kiểm tra import của `src/core/`
- **THEN** không có import React hay component UI nào (chỉ type-only từ `domain` được phép)

#### Scenario: Worker entry tồn tại cho off-main-thread
- **WHEN** kiểm tra cấu trúc Core
- **THEN** tồn tại `src/core/worker.ts` làm Web Worker entry (postMessage boundary) để heavy parsing chạy off-main-thread

### Requirement: Walking-Skeleton Application Shell
Ứng dụng SHALL mount end-to-end qua composition root và hiển thị một `UnifiedViewer` shell ở empty state, chứng minh toolchain + wiring bốn lớp hoạt động trước khi có feature logic.

#### Scenario: App mount và render shell không crash
- **WHEN** ứng dụng được mở trong browser (dev hoặc build)
- **THEN** React mount thành công và render `UnifiedViewer` shell ở trạng thái empty (chưa có tài liệu) mà không crash

#### Scenario: Composition root đăng ký adapter và inject storage
- **WHEN** `main.tsx` chạy lúc khởi động
- **THEN** các adapter (`PdfAdapter`/`DocxAdapter`/`XlsxAdapter`) được `registry.register()` và một `StorageProvider` được inject, sẵn sàng cho feature change fill logic

