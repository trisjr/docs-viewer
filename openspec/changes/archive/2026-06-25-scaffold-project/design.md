## Context

Phase 1–2 đã hoàn tất: PRD/SRS/NFR (Phase 1) và SDD + ADR-001…004 + Spec-Module-Contracts + Spec-Integration-OSS-Libraries + Spec-Security + DB-Entity (Phase 2) đều đã approved/accepted. Change này là bước chuyển **Spec → Code** của Phase 4: dựng codebase skeleton.

Ràng buộc nền (kế thừa, không quyết lại ở đây):
- Client-side SPA, **không backend / không DB** ở MVP (ADR-002).
- Tech stack đã chốt tại ADR-001 (TS 5 / React 19 / Vite 6 / Tailwind v4 / Vitest+RTL + PDF.js / docx-preview / mammoth / SheetJS).
- KISS/YAGNI, solo-dev + AI, free-tier (NFR-09, Charter §7.2).
- Kiến trúc 4 lớp + Shared Kernel, Dependency Rule một chiều (ADR-003), Data-Layer Separation (ADR-004) — cây thư mục chốt tại **SDD §4**.

Trạng thái hiện tại: `src/` và `test/` là placeholder rỗng; `package.json` chưa tồn tại. Stakeholder: trisjr (PO/Accountable), Engineer (thực thi ở `/opsx-apply`).

## Goals / Non-Goals

**Goals:**
- Walking skeleton **chạy được** (`dev`/`build`/`test` đều xanh) enforce 4 lớp + Dependency Rule ngay từ commit đầu.
- Định nghĩa **đầy đủ** Shared Kernel domain types (pure, no behavior) — chốt contract cho cả 4 lớp.
- Hiện diện vật lý của hai extension point: `AdapterRegistry`/`DocumentAdapter` (format) và `StorageProvider` port (auth/multi-tenant).
- Composition root (`main.tsx`) wiring register adapters + inject storage + mount React.
- Test harness Vitest + RTL + smoke test.

**Non-Goals (thuộc change kế tiếp):**
- Logic parse/render/extract/search thật của từng định dạng (feature change M1).
- Behavior upload validation đầy đủ (chỉ stub chữ ký ở scaffold).
- Design tokens / visual design system — defer **Phase 3** (ADR-001 §2.2); scaffold chỉ dựng Tailwind tối giản + cô lập preflight.
- Auth / multi-tenant / persistence — defer **M3** (ADR-004).

## Decisions

1. **Walking skeleton thay vì thin scaffold.** Mount end-to-end chứng minh wiring 4 lớp hoạt động và cho feature change một điểm cắm thật. *Alt: thin (chỉ dirs+types)* — bị loại vì để lại toàn bộ rủi ro wiring cho sau, không chứng minh được Dependency Rule.
2. **Source tree = SDD §4 verbatim (+ 2 file phụ trợ có chủ đích).** Engineer không phải đoán vị trí module; mọi path khớp 1:1 với SDD đã duyệt → tránh architecture drift. *Bổ sung khi apply (ngoài cây SDD §4):* `src/core/errors.ts` chứa `NotImplementedError` mà Decision 4 tham chiếu, và `src/composition.ts` tách phần wiring (register adapters + inject services) khỏi side-effect mount DOM của `main.tsx` để smoke test tái sử dụng đúng cách wiring. Hai file này **không** thêm abstraction nghiệp vụ — vẫn tôn trọng YAGNI.
3. **Shared Kernel định nghĩa đầy đủ ngay.** Domain là pure types nên fully-specifiable bây giờ. Định nghĩa trước khoá contract cho 4 lớp và tránh **back-edge Data → Core** (lý do `FileFormat`/`DocumentSession` phải nằm ở `domain/`, SDD §4 IMPORTANT). Field chi tiết bám canonical [DB-Entity-DocsViewer].
4. **Stub strategy = interface-conformant.** Chữ ký thật lấy từ [Spec-Module-Contracts]; thân stub `throw new NotImplementedError(...)` hoặc trả empty/placeholder — đủ để compile + mount xanh và đánh dấu rõ "fill here". `canHandle` của adapter có thể hiện thực thật (rẻ); `render`/`extract` để stub.
5. **Pin version + cài đủ dependency ngay** (kể cả lib lõi Core chưa wiring: `pdfjs-dist`/`docx-preview`/`mammoth`/`xlsx`) để feature change không phải đụng toolchain. License permissive (R-06).
6. **Tailwind v4 CSS-first + cô lập preflight khỏi content area** ngay từ scaffold (ADR-001 caveat, Integration Spec) — dựng sẵn ranh giới để render lib không bị reset CSS phá fidelity (NFR-02).
7. **Worker boundary scaffold sẵn** (`core/worker.ts`) nhưng `DocxAdapter.render` ở main thread (ngoại lệ có chủ đích — SDD §4 NOTE).
8. **Enforce Dependency Rule ở mức smoke test + tsconfig** trước; ESLint boundaries để dành (YAGNI — chỉ thêm nếu thực sự drift).
9. **Test: Vitest + RTL, env jsdom**, một smoke test (mount UnifiedViewer shell + sanity Dependency Rule). Đồng hệ cấu hình với Vite → giảm chi phí bảo trì.

## Risks / Trade-offs

- **React 19 / Tailwind v4 / Vite 6 còn mới, có thể incompat** → pin exact version; smoke build + test bắt lỗi sớm.
- **Stub rỗng dễ bị hiểu nhầm là "done"** → `tasks.md` + `NotImplementedError` + Non-Goals trong spec làm rõ ranh giới scaffold vs feature.
- **Over-scaffolding (vi phạm YAGNI)** → chỉ tạo đúng module liệt kê trong SDD §4, không thêm abstraction thừa.
- **Tailwind preflight phá content area (PDF.js/docx-preview/SheetJS render)** → cô lập preflight ngay (Decision 6).
- **Dependency Rule chỉ enforce bằng convention** → bổ sung smoke-test sanity + tsconfig path; nâng lên ESLint boundaries nếu phát hiện vi phạm ở feature phase.

## Open Questions

- Chi tiết signature cuối của từng interface (field naming, optionality) sẽ bám [Spec-Module-Contracts] + [DB-Entity-DocsViewer] tại bước `/opsx-apply`; không có quyết định kiến trúc mới nào còn treo cho scaffold.
- Cấu hình ESLint boundaries (nếu thêm) để ngỏ cho feature phase — không bắt buộc cho walking skeleton.
