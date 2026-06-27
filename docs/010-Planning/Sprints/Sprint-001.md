---
id: SPRINT-001
type: sprint
status: active
created: 2026-06-27
milestone: M1
---

# 🏃 Sprint 001 — DocsViewer: "Mở → Xem → Trích xuất PDF end-to-end"

> [!NOTE]
> Sprint đầu tiên của DocsViewer (Milestone **M1 — Core Viewer MVP**). Đây là artifact **planning** thuộc Product Owner. Stories canonical (AC + traceability đầy đủ) ở lại `../../022-User-Stories/Backlog/` — tài liệu này **không lặp lại AC** (SSOT).

## 1. Sprint Goal

> **Mở → Xem → Trích xuất PDF end-to-end.**
> Chứng minh trọn **pipeline kiến trúc 4 lớp** (Upload → Application Facade → Core Adapter qua Worker → Presentation) với **một định dạng thật là PDF** (RICE cao nhất trong backlog), tạo **khuôn nhân bản (tracer bullet)** cho `.docx` / `.xlsx` ở các sprint sau.

**Chiến lược: Vertical Slice "PDF-first" (tracer bullet).** Thay vì làm rộng theo chiều ngang (cả 3 định dạng nông), Sprint 1 đi sâu **một lát cắt dọc xuyên cả 4 lớp** cho PDF. Khi lát cắt này xanh, mọi định dạng còn lại chỉ là viết thêm `DocumentAdapter` + `registry.register()` (KR3.2) trên khung đã được kiểm chứng — đúng tinh thần enabler FR-11.

## 2. Sprint Backlog

| ID | Tên | Epic | SP gốc (BA) | SP hiệu dụng (PO) | MoSCoW |
| :-- | :-- | :-- | :-: | :-: | :-: |
| ST-01 | [Upload Document](../../022-User-Stories/Backlog/Story-Upload-Document.md) | EPIC-01 Platform Foundation | 3 | 3 | Must |
| ST-02 | [Layered Document Processing (enabler)](../../022-User-Stories/Backlog/Story-Layered-Document-Processing.md) | EPIC-01 Platform Foundation | 8 | **2** | Must |
| ST-03 | [View PDF](../../022-User-Stories/Backlog/Story-View-PDF.md) | EPIC-02 Multi-Format Viewing | 5 | 5 | Must |
| ST-06 | [Unified Viewer UI](../../022-User-Stories/Backlog/Story-Unified-Viewer-UI.md) | EPIC-02 Multi-Format Viewing | 5 | **3** | Must |
| ST-07 | [Extract PDF Text](../../022-User-Stories/Backlog/Story-Extract-PDF-Text.md) | EPIC-03 Content Extraction | 5 | 5 | Must |
| | **Tổng** | | **26** (nominal) | **18** (hiệu dụng) | |

> 5 story đều **Must**. Chi tiết task implementation + DoD story-level ở các thin wrapper trong [`../../022-User-Stories/Active-Sprint/`](../../022-User-Stories/Active-Sprint/).

## 3. PO Re-estimate Note

PO re-estimate **2/5 story** dựa trên **scaffold credit** — walking skeleton (commit `feat(scaffold): walking skeleton 4-layer`) đã hiện thực sẵn một phần khung. Re-estimate **chỉ ghi tại Sprint Plan này**; SP gốc trong story canonical ở `Backlog/` giữ nguyên làm baseline BA + traceability.

### 3.1. ST-02: 8 SP → **2 SP** (Verify & Close)

3 AC kiến trúc của ST-02 đều là **architectural enabler** và đã được thỏa qua walking skeleton:

| AC (KR) | Đã có trong scaffold | Test chứng minh |
| :-- | :-- | :-- |
| KR3.1 — Core tách rời UI & user identity | `src/core/` thuần, không import `ui`/`app`/`data` | `test/architecture/dependency-rule.test.ts` |
| KR3.2 — Extension point thêm định dạng | `AdapterRegistry` + interface `DocumentAdapter` (`register`/`resolve`) | `test/core/AdapterRegistry.test.ts` |
| KR3.3 — Extension point auth/multi-tenant | `StorageProvider` port + `InMemoryStorageProvider` + DI tại composition root | `test/data/InMemoryStorageProvider.test.ts`, `test/composition.test.ts` |

→ ST-02 vào sprint dưới dạng **"Verify & Close"**: xác minh các enabler AC còn xanh trong build gate + đóng nốt 1 closing assertion nếu có gap (vd: đăng ký adapter thứ hai không cần sửa Core). **KHÔNG** phải 8 SP fresh.

### 3.2. ST-06: 5 SP → **3 SP**

Shell `UnifiedViewer` + routing theo `FileFormat` + empty/error layout đã có sẵn trong scaffold (`src/ui/UnifiedViewer.tsx`). Phần còn lại là công việc thật: **wiring state** (dispatch `SESSION_OPENED` / `EXTRACTION_READY` / `ERROR` qua `useAppStore`) + **loading/error states thật** thay cho placeholder. Vì khung tĩnh đã xong nên giảm 2 SP.

## 4. Sprint Definition of Done (end-to-end PDF)

Sprint 1 "Done" khi **toàn bộ** tiêu chí sau xanh:

- [ ] Upload một file PDF **hợp lệ** (trong ngưỡng `MAX_FILE_SIZE` = 25 MB cho PDF — SDD §8) khởi tạo `DocumentSession` và bàn giao cho pipeline View/Extract.
- [ ] Upload file **sai định dạng** (vd `.pptx`) → reject, hiển thị thông báo nêu rõ các định dạng được hỗ trợ.
- [ ] Upload file **vượt `MAX_FILE_SIZE`** → reject, hiển thị thông báo nêu rõ giới hạn dung lượng.
- [ ] **Render & xem** PDF: trang đầu hiển thị, phân trang (next/prev) + zoom cơ bản hoạt động.
- [ ] Thời gian mở & hiển thị trang đầu của file baseline (NFR-01 §4.2) **≤ 3 giây** (KR1.3).
- [ ] **Trích xuất text** PDF (có text layer) hiển thị ở `ExtractedContentPanel`; nội dung sẵn sàng cho luồng search/AI sau này.
- [ ] PDF **scan/không text layer** → báo "không có text trích xuất được", vẫn view bình thường (không crash).
- [ ] PDF **hỏng/không parse được** → báo lỗi tường minh, **không render nội dung sai** (BR-004-2).
- [ ] **ST-02 enabler verified**: extension point tests (`AdapterRegistry`, `dependency-rule`, `InMemoryStorageProvider`, `composition`) xanh.
- [ ] `npm run build` + `npm test` **xanh**, **không vi phạm Dependency Rule** một chiều (ADR-003).
- [ ] Mọi file code tạo mới/sửa đáng kể có header `// AI Coding` (Clean Code Standard).

## 5. Build Order (dependency-aware)

```
ST-01 Upload  →  ST-03 View PDF  (đan xen ST-06 Unified Viewer wiring)
   →  ST-07 Extract PDF Text  →  ST-02 Verify & Close (chạy cuối — khẳng định extension points xanh)
```

- **ST-01 trước**: mọi thứ phụ thuộc luồng `open(file)` đã khởi tạo session.
- **ST-03 + ST-06 đan xen**: View PDF cần shell Unified Viewer wiring state để hiển thị; làm song song.
- **ST-07 sau View**: extract chạy khi tài liệu đã mở.
- **ST-02 cuối cùng**: là gate "Verify & Close" — xác nhận lát cắt dọc không phá vỡ extension points trước khi đóng sprint.

## 6. Capacity & Cadence

| Yếu tố | Giá trị |
| :-- | :-- |
| Team | Solo (trisjr) + AI |
| Cadence | ~1 tuần/Sprint (SDLC scale Small/MVP) — nhưng **goal-driven** |
| Deadline | **Không có deadline cứng** (Roadmap §1) → đóng sprint khi đạt **Sprint DoD** (§4) |
| Velocity baseline | **Chưa có** — Sprint 1 dùng **18 SP hiệu dụng** làm baseline đo velocity cho các sprint sau |

> [!NOTE]
> Không ép đóng sprint theo ngày. Khi DoD §4 xanh → sprint Done; số SP thực tế hoàn thành trở thành velocity baseline.

## 7. Assumptions & Risks

### Assumptions
- **Phase 3 (UI/UX Design) defer — KHÔNG block sprint.** Theo **ADR-001 §2.2**, visual design (design system, branding) được defer có chủ đích. UI Sprint 1 làm ở mức **functional** (layout dùng được, Tailwind cơ bản), chưa cần design system. AC view/extract đánh giá trên hành vi, không trên thẩm mỹ.
- Scaffold walking skeleton (4 lớp + shared kernel + extension points) đã merge và build xanh — là điểm xuất phát của sprint.

### Risks liên quan
| Risk | Mô tả | Story chịu tác động | Tham chiếu |
| :-- | :-- | :-- | :-- |
| **R-01** | Độ trung thực render PDF (vỡ layout) — Score 9, rủi ro số 1 | ST-03 | [Risk Register](../Risk-Register.md) |
| **R-05** | Giới hạn trình duyệt với file lớn (bộ nhớ/perf) | ST-01 (MAX_FILE_SIZE gate) | [Risk Register](../Risk-Register.md) |

## 8. Out of Scope (Sprint 1 → Sprint 2+)

- **View + Extract `.docx` / `.xlsx`** (ST-04, ST-05, ST-08, ST-09) — nhân bản khuôn PDF ở sprint sau.
- **Search trong tài liệu** (ST-11) — phụ thuộc Extract đã ổn định.
- **Copy/Export nội dung trích xuất** (ST-10) — Should.
- **Highlight & Navigate kết quả search** (ST-12) — Should.

> Lý do: Sprint 1 tập trung kiểm chứng lát cắt dọc PDF. Mở rộng định dạng/tính năng tránh phá vỡ vertical slice (R-04 scope creep).

## 9. Tài liệu tham khảo

- [Backlog Priority (MoSCoW + RICE)](../../022-User-Stories/Backlog-Priority.md)
- [Roadmap — M1 DoD](../Roadmap.md)
- [MVP Scope — DocsViewer](../MVP-Scope.md)
- [Risk Register — DocsViewer](../Risk-Register.md)
- [SDD — DocsViewer](../../030-Specs/Architecture/SDD-DocsViewer.md)
- [Spec — Module Contracts](../../030-Specs/API/Spec-Module-Contracts.md)
- Active Sprint Stories: [`../../022-User-Stories/Active-Sprint/`](../../022-User-Stories/Active-Sprint/)

---
*Generated by TNMCORE-OS Product Owner Role.*
