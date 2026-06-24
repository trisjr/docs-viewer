---
id: ADR-004
type: adr
status: proposed
created: 2026-06-24
updated: 2026-06-24
---

# 🏗️ ADR-004 — Data-Layer Separation & Multi-User Extension Point

## Mục lục

1. [Context](#1-context)
2. [Decision](#2-decision)
3. [Status](#3-status)
4. [Consequences](#4-consequences)
5. [Alternatives considered](#5-alternatives-considered)
6. [Traceability](#6-traceability)
7. [Tài liệu tham khảo](#7-tài-liệu-tham-khảo)

---

## 1. Context

DocsViewer ở MVP (M1) là **web app client-side SPA**, single-user, **không có backend / không có DB** — toàn bộ parse/render/extract chạy trong browser (xem ADR-002, SRS §2.1/§2.2). Tuy nhiên dự án có một ràng buộc nền tảng phải giải quyết **ngay từ MVP**: kiến trúc phải sẵn sàng tiến lên **multi-user / multi-tenant** ở M3 mà **không phải viết lại Core**.

Hai sức ép đối nghịch tạo nên bối cảnh quyết định:

- **Sức ép "đừng làm sớm" (YAGNI):** MVP chỉ phục vụ Single-user (Owner) — user class duy nhất theo SRS §2.2. Multi-tenant là Out of scope (defer M3). Nếu nhúng user context / session ownership vào Core viewer bây giờ, ta over-engineer cho một nhu cầu chưa tồn tại, vi phạm NFR-09 và làm phình attack surface vô ích.
- **Sức ép "đừng làm muộn" (Evolvability):** Tài liệu người dùng upload thường **nhạy cảm**, và đây chính là gốc của Risk **R-03**. R-03 chỉ rõ cách *phòng ngừa* phải được gài vào kiến trúc **từ MVP** để khi mở multi-user không phải đập đi xây lại. KR3.1 yêu cầu logic xử lý tài liệu (parse/extract) **tách rời** khỏi tầng UI **và tầng người dùng**; KR3.3 yêu cầu có **extension point** rõ ràng để gắn auth/multi-tenant ở M3. NFR-05 và NFR-06 chuẩn hoá hai yêu cầu này thành chất lượng đo được.

Điểm mấu chốt: nếu Core **biết** đến danh tính người dùng (đọc `currentUser`, lọc theo `tenantId`, kiểm tra quyền truy cập...), thì mọi thay đổi mô hình người dùng ở M3 sẽ lan ngược vào Core — chính là kịch bản "viết lại core" mà R-03/KR3.3 muốn loại trừ. Đồng thời, một Core *không* biết danh tính người dùng cũng là **privacy by design**: ở MVP không có đường nào để dữ liệu rò rỉ qua một lớp ownership chưa tồn tại (T5 trong Threat Model §8 của Brief).

ADR-003 đã thiết lập kiến trúc **Layered 4 lớp** với Dependency Rule một chiều `Presentation → Application → Core → Data` và đã giải quyết extensibility theo định dạng (Adapter + Registry → KR3.2). ADR-004 đặc tả **lớp [4] Data / User Layer** còn lại và trả lời câu hỏi: *làm sao Core phụ thuộc vào Data mà vẫn hoàn toàn vô can với danh tính người dùng, để M3 chỉ cần thay implementation chứ không sửa Core?*

## 2. Decision

**Core KHÔNG bao giờ phụ thuộc vào danh tính người dùng.** Toàn bộ trạng thái gắn người dùng / session được đặt sau một **port** duy nhất theo mẫu **Ports & Adapters (Hexagonal-lite)**: `StorageProvider`.

### 2.1. Port `StorageProvider` (verbatim — Brief §4)

```typescript
// DATA — port (extension point M3, KR3.3)
interface StorageProvider {
  save(session: DocumentSession): Promise<void>;
  load(id: string): Promise<DocumentSession | null>;
  clear(): Promise<void>;
}
// MVP impl: InMemoryStorageProvider (không persist — privacy by design R-03/NFR-05).
// M3 impl (defer): ServerStorageProvider có tenant scoping.
```

- Payload duy nhất đi qua port là **`DocumentSession`** (Domain Entity — Brief §5). Port **chỉ** có ba method `save / load / clear`; không thêm method, không rename.
- Core (`src/core/`: `DocumentAdapter`, `AdapterRegistry`, `SearchEngine`) và phần lớn Application (`src/app/`) làm việc trên `DocumentSession` / `RenderedDocument` / `ExtractedContent` thuần — **không** nhận tham số kiểu `userId` / `tenantId`, **không** import gì từ lớp Data ngoài *kiểu interface* `StorageProvider`.
- Application Layer phụ thuộc vào **abstraction** `StorageProvider` (port), **không** phụ thuộc vào implementation cụ thể. Implementation được inject từ ngoài (composition root) — đây là điểm hiện thực hoá Dependency Rule của ADR-003: mũi tên `Core → Data` là phụ thuộc vào *port*, không phải vào concrete class.

### 2.2. Implementation theo Milestone

| Milestone | Implementation | Hành vi | Why |
| :-- | :-- | :-- | :-- |
| **MVP (M1)** | `InMemoryStorageProvider` | Giữ `DocumentSession` trong bộ nhớ phiên; **không persist** ra ổ đĩa / network; `clear()` xoá sạch khi hết session. | Privacy by design (R-03, NFR-05): không có store nào để rò rỉ; không upload server (ADR-002). |
| **M3 (defer)** | `ServerStorageProvider` | Persist có **tenant scoping** (phân tách dữ liệu theo người dùng/tenant), gắn auth. | Kích hoạt extension point (FR-11.3, KR3.3) **mà không sửa Core**. |

> [!IMPORTANT]
> Ở MVP, `StorageProvider` là **extension point dành sẵn** — *không được exercise* bởi luồng nghiệp vụ M1 (xem Brief §4: contract → use-case mapping ghi rõ "không exercise ở MVP"). Nó tồn tại để **chốt hợp đồng (contract)** cho M3, không phải để thêm tính năng cho MVP. Đây là biên giới rõ ràng giữa "gài sẵn chỗ móc" (làm ngay) và "triển khai persistence/multi-tenant" (defer M3).

### 2.3. Sơ đồ port & adapter (pluggable without core change)

```mermaid
graph TD
    subgraph App["Application Layer (src/app/)"]
        DS["DocumentService (Facade)"]
    end

    subgraph Core["Document Processing Layer — CORE (src/core/)"]
        CoreNote["DocumentAdapter · AdapterRegistry · SearchEngine<br/>THUẦN — không biết userId / tenantId"]
    end

    subgraph Data["Data / User Layer (src/data/)"]
        Port{{"«interface» StorageProvider<br/>save / load / clear"}}
        InMem["InMemoryStorageProvider<br/>(MVP — no persist)"]
        Server["ServerStorageProvider<br/>(M3 — tenant scoping + auth)"]
    end

    DS -->|orchestrate| Core
    DS -.->|depends on PORT<br/>(abstraction only)| Port
    InMem -->|implements| Port
    Server -.->|implements · DEFERRED M3| Port

    style Server stroke-dasharray: 5 5
    style Port stroke-width:2px
```

Điểm cần thấy qua sơ đồ: Application/Core chỉ "biết" tới **interface** `StorageProvider`. Đổi từ `InMemoryStorageProvider` sang `ServerStorageProvider` chỉ là đổi mũi tên `implements` (inject implementation khác ở composition root) — **không có mũi tên nào từ Core/Application trỏ thẳng vào concrete class**, nên Core không cần sửa. Đó là cách KR3.3 được thoả mãn về mặt thiết kế.

## 3. Status

**Proposed.** Phụ thuộc và bổ trợ cho ADR-003 (Layered + Adapter-Registry) — ADR-004 đặc tả riêng lớp Data / User và extension point multi-user. Cần Security Auditor xác nhận posture privacy-by-design (R-03/NFR-05) trong Phase-2 mandatory gate (chi tiết threat model do `Spec-Security-DocsViewer.md` sở hữu).

## 4. Consequences

### 4.1. Pros (Tích cực)

- **Core bất biến qua các milestone:** Tiến lên multi-user ở M3 = viết thêm `ServerStorageProvider` + cấu hình inject, **không chạm Core** — thoả KR3.1 / KR3.3, NFR-06.
- **Privacy by default ở MVP (R-03 / NFR-05):** `InMemoryStorageProvider` không persist, không upload → không có store/đường rò rỉ; dữ liệu nhạy cảm bị `clear()` khi hết phiên (giảm nhẹ T5 của Threat Model §8 ở mức design).
- **Testability cao:** Core/Application test được hoàn toàn độc lập với storage thật bằng cách inject một stub `StorageProvider` (hợp đồng chỉ 3 method) — phục vụ chiến lược test Phase-5.
- **Hợp đồng hẹp, ổn định:** Port chỉ `save / load / clear` quanh `DocumentSession` → bề mặt phụ thuộc nhỏ, dễ giữ ổn định khi implementation thay đổi (DRY/KISS).
- **Ranh giới bảo mật rõ ràng:** Mọi vấn đề auth/tenant isolation bị "đẩy" về một lớp duy nhất (lớp Data), giúp threat model M3 khoanh vùng gọn thay vì rải khắp Core.

### 4.2. Cons (Đánh đổi tiêu cực)

- **Thêm một lớp gián tiếp (indirection) chưa sinh giá trị ngay ở MVP:** Có port + một implementation gần như "rỗng" (`InMemoryStorageProvider`) mà luồng M1 không thực sự gọi tới (xem §2.2). Đây là chi phí trả trước cho evolvability.
- **Rủi ro hợp đồng phỏng đoán:** Port được thiết kế *trước* khi có nhu cầu M3 thực tế; signature `save/load/clear` quanh `DocumentSession` có thể cần tinh chỉnh khi multi-tenant lộ yêu cầu thật (vd phân trang, query theo tenant). Chấp nhận như một hợp đồng MVP có thể versioned ở M3.

### 4.3. Trade-offs (Cân nhắc)

- **Evolvability ⟷ Simplicity:** Chọn trả một lượng indirection *tối thiểu* (đúng một port, một method-set hẹp, một implementation no-op) để mua khả năng mở rộng. Đây là điểm cân bằng có chủ đích giữa YAGNI và yêu cầu nền tảng R-03/KR3.3 — KHÔNG nhúng full user model (xem §5), cũng KHÔNG bỏ trống abstraction.
- **"Gài chỗ móc" ⟷ "Triển khai tính năng":** Ranh giới được chốt ở §2.2 — MVP chỉ commit *contract* của extension point; persistence + tenant scoping + auth là phần việc của M3. Điều này giữ scope MVP đúng MVP-Scope (chống R-04 scope creep) trong khi vẫn không vi phạm yêu cầu nền tảng.

## 5. Alternatives considered

### 5.1. Nhúng user context vào Core ngay từ MVP (Rejected)

Cho Core/Application nhận `userId` / `tenantId`, kiểm tra ownership/quyền truy cập ngay trong pipeline parse/render/extract.

- **Lý do từ chối:** **Premature** — MVP chỉ có Single-user (SRS §2.2), không có nhu cầu phân tách. Vi phạm **YAGNI / NFR-09** và làm Core "biết" danh tính người dùng → trực tiếp phá vỡ KR3.1. Tệ hơn, nó *mở rộng* attack surface privacy ngay ở MVP (mâu thuẫn R-03/NFR-05: tạo khái niệm ownership nhưng chưa có cơ chế bảo vệ tương xứng → defer threat model M3 trở nên vô nghĩa). Hướng này gánh chi phí và rủi ro của multi-tenant *trước khi* có yêu cầu, đúng thứ R-03 cảnh báo nên tránh.

### 5.2. Không có abstraction nào — Core gọi storage trực tiếp / không tách lớp Data (Rejected)

Bỏ port `StorageProvider`; ở MVP Core/Application giữ state nội bộ, đến M3 mới thêm persistence bằng cách sửa thẳng vào Core/Application.

- **Lý do từ chối:** Khi lên M3, mọi điểm Core/Application đang ôm state người dùng sẽ phải sửa để gắn server persistence + tenant scoping → đúng kịch bản **"viết lại core"** mà KR3.3 / NFR-06 / R-03 yêu cầu loại trừ. Phá vỡ KR3.3 (không có extension point rõ ràng) và để Core *ngầm* phụ thuộc vào cách lưu trữ. Tiết kiệm được rất ít ở MVP (port chỉ là một interface 3 method) nhưng trả giá đắt ở M3 — đây là khoản nợ kiến trúc không đáng vay.

> **Tổng kết lựa chọn:** ADR-004 là điểm cân bằng giữa hai cực bị loại — *vừa đủ* abstraction (một port hẹp dành sẵn) để KR3.3/NFR-06 đạt được, nhưng *không* nhúng user model sớm (giữ YAGNI và privacy-by-design R-03/NFR-05).

## 6. Traceability

| Yêu cầu / Risk | Vai trò trong ADR-004 | Tham chiếu SSOT |
| :-- | :-- | :-- |
| **NFR-05** | Tách lớp dữ liệu người dùng từ MVP; threat model multi-tenant defer M3 | [NFR §3 — NFR-05](../../020-Requirements/NFR-DocsViewer.md) |
| **NFR-06** | Extension point rõ ràng cho auth/multi-tenant trong kiến trúc layered | [NFR §2 — NFR-06](../../020-Requirements/NFR-DocsViewer.md) |
| **KR3.1** | Logic parse/extract (Core) tách rời tầng UI **và tầng người dùng** | [OKRs — Objective 3](../../010-Planning/OKRs.md) |
| **KR3.3** | `StorageProvider` port = điểm móc gắn auth/multi-tenant ở M3 | [OKRs — Objective 3](../../010-Planning/OKRs.md) |
| **R-03** | Privacy by design: InMemory không persist/upload; tách lớp ngay từ MVP | [Risk Register — R-03](../../010-Planning/Risk-Register.md) |
| **FR-11.3** | Hiện thực hoá extension point của FR-11 (kích hoạt ở M3) | [SRS — FR-11](../../020-Requirements/SRS-DocsViewer.md) |

> KR3.2 (thêm định dạng mới không sửa Core) thuộc phạm vi **ADR-003** (Adapter + Registry) — ADR-004 không claim KR3.2. Threat model multi-tenant đầy đủ thuộc `Spec-Security-DocsViewer.md`, defer M3.

## 7. Tài liệu tham khảo

- [NFR — DocsViewer](../../020-Requirements/NFR-DocsViewer.md)
- [SRS — DocsViewer](../../020-Requirements/SRS-DocsViewer.md)
- [OKRs — DocsViewer](../../010-Planning/OKRs.md)
- [Risk Register — DocsViewer](../../010-Planning/Risk-Register.md)
- [Glossary — DocsViewer](../../999-Resources/Glossary.md)
- [ADR-002 — Client-Side Processing](./ADR-002-Client-Side-Processing.md)
- [ADR-003 — Layered Adapter Registry](./ADR-003-Layered-Adapter-Registry.md)

---
*Generated by TNMCORE-OS Architect Role.*
