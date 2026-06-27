---
id: ADR-005
type: adr
status: accepted
amends: "ADR-001 §2.2"
created: 2026-06-27
updated: 2026-06-27
---

# 🏗️ ADR-005 — Adopt Design Mockup làm Visual Baseline (amends ADR-001 §2.2)

## Mục lục

1. [Context (Bối cảnh)](#1-context-bối-cảnh)
2. [Decision (Quyết định)](#2-decision-quyết-định)
3. [Status (Trạng thái)](#3-status-trạng-thái)
4. [Consequences (Hệ quả)](#4-consequences-hệ-quả)
5. [Alternatives considered (Phương án đã cân nhắc)](#5-alternatives-considered-phương-án-đã-cân-nhắc)
6. [Tài liệu tham khảo](#6-tài-liệu-tham-khảo)

---

## 1. Context (Bối cảnh)

[ADR-001 §2.2](./ADR-001-Tech-Stack.md#22-why--lý-do-từng-lựa-chọn-trọng-yếu) chốt một **ranh giới**: ADR-001 chỉ quyết định *CSS tooling* (Tailwind), còn **design system visual** (màu, spacing, design tokens, component layout) **defer sang Phase 3 (Product Designer)**. [Sprint-001 §7](../../010-Planning/Sprints/Sprint-001.md) kế thừa đúng giả định này: UI Sprint 1 ở mức *functional*, AC đánh giá trên hành vi, không trên thẩm mỹ.

**Sự kiện làm thay đổi quyết định:** một **mockup high-fidelity** đã được import vào repo — `docs/040-Design/mockups/DocsViewer.dc.html` (project "DocsViewer web app design" trên claude.ai/design, import 2026-06-27, index tại [Design-MOC](../../040-Design/Design-MOC.md)). Mockup gồm **8 screen** với một ngôn ngữ thị giác hoàn chỉnh: palette (indigo `#4F46E5` + gray scale), typography (`Inter`), spacing/layout (top bar 56px · content 640px · panel Extracted 340px · floating toolbar), và **error taxonomy** (3 blocking đỏ + 1 warning amber cho no-text-layer). Đây **thực chất chính là** design system visual mà §2.2 dự tính Phase 3 sẽ sản xuất.

trisjr (Accountable) đã chọn **hướng (b)**: implement UI Sprint-1 **bám sát** mockup này ngay, thay vì chờ Phase 3. Quyết định đã được ghi nhận ở [`proposal.md` của change `pdf-vertical-slice`](../../../openspec/changes/pdf-vertical-slice/proposal.md). Vì điều này mâu thuẫn trực tiếp với ranh giới defer ở §2.2, cần một amendment được ghi nhận (nguyên tắc ADR immutable: **không** rewrite âm thầm §2.2 đã sign-off).

## 2. Decision (Quyết định)

1. **Adopt** `docs/040-Design/mockups/DocsViewer.dc.html` làm **visual baseline / de-facto design system** của DocsViewer, hiệu lực từ Sprint-1.
2. **Lift một phần** ranh giới defer của ADR-001 §2.2: design tokens (màu/spacing/typography) + screen layout từ mockup trở thành **authoritative** cho implementation **ngay bây giờ**, thay vì chờ một deliverable design-system Phase 3 riêng biệt.
3. **Phạm vi lift**: áp dụng cho các screen mockup phủ (empty · loading · PDF viewer · extract panel · error). Sprint-1 implement **subset PDF**; các screen khác (`.docx`/`.xlsx`/search) là **visual reference** cho các sprint sau.
4. **Không đổi**: quyết định *CSS-tooling* (Tailwind) ở §2.2 giữ nguyên — mockup tokens được **map vào** Tailwind theme; caveat *cô lập Tailwind preflight khỏi content area* (NFR-02) vẫn hiệu lực. Tech-stack (ADR-001), ADR-002/003/004, và stance *Acceptable Fidelity (không pixel-perfect)* của NFR-02 **không** bị ADR này thay đổi.
5. **Gate nghiệm thu**: **behavioral AC vẫn là gate Done**; *visual fidelity* tới mockup là tiêu chí **additive** (bổ sung, không thay thế). Không gold-plate thẩm mỹ làm trễ AC hành vi.

> ADR này **amends ADR-001 §2.2** (clause "design system visual thuộc Phase 3"), **không supersede** toàn bộ ADR-001.

## 3. Status (Trạng thái)

**Accepted** — phê duyệt bởi trisjr (Accountable) ngày 2026-06-27.

Không yêu cầu Security sign-off (phạm vi là visual/process, không chạm threat model — khác ADR-001). Amends [ADR-001 §2.2](./ADR-001-Tech-Stack.md#22-why--lý-do-từng-lựa-chọn-trọng-yếu); một back-reference NOTE đã được chèn tại §2.2 của ADR-001 trỏ về ADR này.

## 4. Consequences (Hệ quả)

### 4.1. Pros (Lợi ích)
- **Xoá ambiguity UI cho Sprint-1**: có visual spec cụ thể → implement nhanh & nhất quán; design-developer handoff coi như đã xong.
- **Error UX được thiết kế sẵn**: phân biệt blocking (đỏ) vs non-blocking (amber, no-text-layer) là quyết định thiết kế có chủ đích, không phải improvise → edge cases (corrupt/oversize/no-text) xử lý đẹp ngay từ M1.
- **Ngôn ngữ thị giác nhất quán từ ngày đầu**; các định dạng sau (`.docx`/`.xlsx`) đã có sẵn screen để nhân bản.

### 4.2. Cons (Bất lợi)
- **Scope UI Sprint-1 rộng hơn** so với plan §7 gốc (thêm việc polish) → có thể ảnh hưởng velocity baseline; PO nên ghi chú SP hiệu dụng.
- Mockup **không** đến từ một quy trình Phase-3 đầy đủ (chưa có design-tokens doc chính thức, a11y audit, responsive spec) → nó là **visual baseline**, chưa phải design system hoàn chỉnh.

### 4.3. Trade-offs (Đánh đổi)
- Đổi *risk gold-plating visual* lấy *UI chất lượng cao sớm* → mitigate: behavioral AC là gate Done, fidelity additive.
- **Phase 3 bị pre-empt một phần**: nếu sau này có một design system đầy đủ hơn, nó **phải reconcile** với mockup đã adopt (không mâu thuẫn). Follow-up khả dĩ: formal hoá tokens/a11y/responsive trong một pass "Phase-3-lite" khi cần.

## 5. Alternatives considered (Phương án đã cân nhắc)

- **(a) Giữ defer §2.2 — UI functional-only (plan gốc):** trisjr loại — đã có mockup high-fidelity sẵn; bỏ qua nó vừa lãng phí asset, vừa rủi ro rework khi design "land" về sau.
- **Inline addendum vào ADR-001 thay vì ADR mới:** loại — ADR-001 đã sign-off (trisjr + Security); tạo ADR mới là cách orthodox ghi nhận quyết định tiến hoá (khớp convention "supersedes" mà chính ADR-001 đã dùng ở Status). Chỉ chèn một NOTE pointer tối thiểu vào ADR-001.
- **Làm full Phase-3 design system ngay bây giờ:** loại — over-engineering cho MVP (YAGNI/NFR-09); mockup đủ làm baseline.

## 6. Tài liệu tham khảo

- [ADR-001 — Tech Stack §2.2](./ADR-001-Tech-Stack.md#22-why--lý-do-từng-lựa-chọn-trọng-yếu) (clause được amend)
- [Sprint-001 §7 — Assumptions](../../010-Planning/Sprints/Sprint-001.md)
- [Design-MOC — DocsViewer mockup](../../040-Design/Design-MOC.md)
- [proposal.md — change `pdf-vertical-slice`](../../../openspec/changes/pdf-vertical-slice/proposal.md)
- [NFR-02 — Render Fidelity](../../020-Requirements/NFR-DocsViewer.md)

---
*Generated by TNMCORE-OS Architect Role.*
