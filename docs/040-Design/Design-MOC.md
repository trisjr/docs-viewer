---
id: DESIGN-MOC
type: moc
status: active
updated: 2026-06-27
---

# 🎨 Design — Map of Content

> [!NOTE]
> Index cho thư mục `040-Design` (Dewey: tài liệu Design đặc thù dự án). Mỗi khi thêm artifact design, cập nhật MOC này (SSOT cho navigation).

## 1. Mockups (high-fidelity)

| Artifact | Nguồn | Format | Phạm vi |
| :-- | :-- | :-- | :-- |
| [`mockups/DocsViewer.dc.html`](mockups/DocsViewer.dc.html) | claude.ai/design — project `495825a1…f47ef2` ("DocsViewer web app design", owner trisjr), import 2026-06-27 | Canvas HTML (inline-styles, tự chứa) | **Product-wide** — 8 screen phủ cả 3 định dạng + search + error |

> Mở trực tiếp bằng browser xem được (inline-styles render không cần `support.js`; `support.js` chỉ thêm pan/zoom canvas trên claude.ai/design — đã **không** vendor vào repo).

## 2. Screen inventory (8 frames)

| # | Screen | Mục đích | Liên quan Sprint-1 (PDF slice) |
| :-: | :-- | :-- | :-- |
| 01 | Empty state | Top bar + dropzone "Drag/click", pills PDF·DOCX·XLSX, "up to 25 MB" | ✅ ST-01 Upload |
| 02 | Loading | Spinner "Opening document…" + filename/size + skeleton page | ✅ ST-06 loading state |
| 03 | **PDF viewer** | Render page + floating toolbar (prev/next `3/24`, zoom `100%`) + panel Extracted | ✅ ST-03 View + ST-07 Extract + ST-06 shell |
| 04 | DOCX viewer | Render Word + panel Extracted | ⛔ out-of-scope (Sprint 2+) — khuôn nhân bản |
| 05 | XLSX viewer | Grid + sheet tabs + Extracted (Export CSV) | ⛔ out-of-scope |
| 06 | Search active | Search field focus + match count `2/15` + prev/next | ⛔ out-of-scope (ST-11) |
| 07 | Error in context | Banner đỏ dismissible trong viewer chrome + full error view ("File too large") | ✅ ST-01 reject states |
| 08 | Error variants | Grid 4 card: Unsupported · Too large · Damaged (đỏ) · **No-text** (amber/warning) | ✅ ST-01 + ST-07 edge cases |

## 3. Design tokens (trích từ mockup)

- **Primary**: indigo `#4F46E5` (tints `#EEF2FF` / `#E0E7FF` / `#C7D2FE`).
- **Text**: `#111827` (heading) · `#374151` (body) · `#6B7280` (secondary) · `#9CA3AF` (muted).
- **Surface/Border**: `#FFFFFF` · `#F9FAFB` / `#F3F4F6` (bg) · `#E5E7EB` (border).
- **Error (blocking, đỏ)**: text `#B91C1C`/`#DC2626`, bg `#FEF2F2`, border `#FECACA`.
- **Warning (non-blocking, amber)**: text `#92400E`/`#A16207`/`#D97706`, bg `#FFFBEB`/`#FEF3C7`, border `#FDE68A`.
- **Typography**: `Inter` (400/500/600/700); `ui-monospace` cho extracted text.
- **Layout**: top bar `56px` · vùng content `640px` · panel Extracted `340px` (border-left) · floating toolbar bo `11px` đặt bottom-center · card radius `10–14px`, button `6–8px`.

## 4. Screen element → component (`src/ui`)

| Element trong mockup | Component hiện có |
| :-- | :-- |
| Top bar (logo + search + "Open file") | shell trong `UnifiedViewer.tsx` |
| Dropzone empty state | `UploadZone.tsx` |
| Vùng render PDF + floating toolbar (paging/zoom) | `UnifiedViewer.tsx` |
| Panel "Extracted content" (Copy/Export) | `ExtractedContentPanel.tsx` |
| Error banner + error cards | `ErrorBanner.tsx` |
| Search field (frame 06) | `SearchBar.tsx` *(Sprint 2+)* |

## 5. Design System

- [Component-Template.md](Design-System/Component-Template.md) — template tài liệu hoá component.

## 6. Tài liệu tham khảo

- [SDD — DocsViewer](../030-Specs/Architecture/SDD-DocsViewer.md)
- [Sprint-001](../010-Planning/Sprints/Sprint-001.md)
- OpenSpec change tiêu thụ design này: `openspec/changes/pdf-vertical-slice/`
