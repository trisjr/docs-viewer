---
id: SPECS-MOC
type: moc
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# 🗺️ Specs MOC — Map of Content (030-Specs)

> Index trung tâm cho toàn bộ artifact **Phase 2 — Architecture Design** của DocsViewer. Đây là entry-point Architect nạp đầu tiên khi vào `030-Specs/`.

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Architecture (SDD + ADR)](#2-architecture-sdd--adr)
3. [API (Module Contracts + Integration)](#3-api-module-contracts--integration)
4. [Schema (Domain Data Model)](#4-schema-domain-data-model)
5. [Security (Threat Model)](#5-security-threat-model)
6. [Phase-2 Gate Checklist](#6-phase-2-gate-checklist)
7. [Tài liệu tham khảo](#7-tài-liệu-tham-khảo)

---

## 1. Tổng quan kiến trúc

**DocsViewer** (M1/MVP) là **web app client-side SPA** — parse/render/extract 100% trong browser, **không backend / không DB**, deploy static free-tier. Kiến trúc **Layered 4 lớp** (Presentation → Application → Core → Data) với **Dependency Rule một chiều**; Core (Document Processing) là lớp thuần, không phụ thuộc UI hay danh tính người dùng — đặt nền cho việc thêm định dạng (Adapter/Registry) và gắn auth/multi-tenant (StorageProvider port) **mà không viết lại core** (FR-11, KR3.x).

| Quyết định nền tảng | ADR |
| :-- | :-- |
| Tech stack (React 19 + TS + Vite + Tailwind CSS; PDF.js / docx-preview / mammoth / SheetJS) | [ADR-001](./Architecture/ADR-001-Tech-Stack.md) |
| Xử lý 100% client-side, không backend MVP | [ADR-002](./Architecture/ADR-002-Client-Side-Processing.md) |
| Layered 4 lớp + Adapter/Registry (format extensibility) | [ADR-003](./Architecture/ADR-003-Layered-Adapter-Registry.md) |
| Data-Layer Separation (StorageProvider port) | [ADR-004](./Architecture/ADR-004-Data-Layer-Separation.md) |

---

## 2. Architecture (SDD + ADR)

| Artifact | Mô tả | Status |
| :-- | :-- | :-- |
| [SDD-DocsViewer](./Architecture/SDD-DocsViewer.md) | System Design Document — kiến trúc tổng thể, sơ đồ Mermaid 4 lớp, component design, **project structure / source tree (Shared Kernel `src/domain/`)**, search strategy, resource limits, performance, extensibility, traceability | draft |
| [ADR-001-Tech-Stack](./Architecture/ADR-001-Tech-Stack.md) | Quyết định tech stack + license posture (thay thế stub `ADR-001-Init-Architecture` đã remove) | proposed |
| [ADR-002-Client-Side-Processing](./Architecture/ADR-002-Client-Side-Processing.md) | Client-side only, không backend/DB ở MVP | proposed |
| [ADR-003-Layered-Adapter-Registry](./Architecture/ADR-003-Layered-Adapter-Registry.md) | Kiến trúc layered + Adapter/Registry pattern (KR3.1/KR3.2) | proposed |
| [ADR-004-Data-Layer-Separation](./Architecture/ADR-004-Data-Layer-Separation.md) | Tách lớp dữ liệu người dùng + extension point M3 (NFR-05/KR3.3) | proposed |

---

## 3. API (Module Contracts + Integration)

> [!NOTE]
> DocsViewer MVP **không** có external HTTP/REST API. "API Specs" của Phase-2 được hiện thực hóa thành **internal TypeScript module contracts** (client-side). Server API reserved cho M3.

| Artifact | Mô tả | Status |
| :-- | :-- | :-- |
| [Spec-Module-Contracts](./API/Spec-Module-Contracts.md) | 8 module contract (FileFormat, UploadValidationResult, DocumentAdapter, AdapterRegistry, SearchEngine+normalize, DocumentService, SearchService, StorageProvider) + Contract→Use Case mapping (UC-02/03/04) + bao phủ FR-01..11 | draft |
| [Spec-Integration-OSS-Libraries](./API/Spec-Integration-OSS-Libraries.md) | Tích hợp OSS lib (PDF.js / docx-preview / mammoth / SheetJS): API cụ thể, Worker usage, version-pinning, license & maintenance (R-06), fallback per format | draft |

---

## 4. Schema (Domain Data Model)

> [!NOTE]
> MVP **không** có database/persistence. "DB Schema" được hiện thực hóa thành **Domain Data Model in-memory/runtime**; persistence reserved cho M3 qua `StorageProvider` port.

| Artifact | Mô tả | Status |
| :-- | :-- | :-- |
| [DB-Entity-DocsViewer](./Schema/DB-Entity-DocsViewer.md) | Domain Data Model in-memory + Mermaid `erDiagram` (DocumentSession, RenderedDocument, ExtractedContent, SearchIndex, SearchMatch, SearchResultSet, FileFormat, MAX_FILE_SIZE) | draft |

---

## 5. Security (Threat Model)

| Artifact | Mô tả | Status |
| :-- | :-- | :-- |
| [Spec-Security-DocsViewer](./Security/Spec-Security-DocsViewer.md) | Threat Model client-side (T1–T7: XSS qua docx HTML, zip-bomb, malicious PDF, prototype pollution, data exposure, export injection, supply-chain) + trust-boundary diagram + data-layer separation + **Security Auditor sign-off (APPROVED-WITH-CONDITIONS)** | draft |

---

## 6. Phase-2 Gate Checklist

Đối chiếu 5 tiêu chí chuyển Phase tại [Phase-2-Architecture-Design §5](../../knowledge-base/20-Project/SDLC-Phases/Phase-2-Architecture-Design.md):

- [x] **SDD có sơ đồ kiến trúc (Mermaid)** — [SDD §2](./Architecture/SDD-DocsViewer.md) (graph 4 lớp + Web Worker boundary).
- [x] **Ít nhất 1 ADR cho quyết định tech stack** — [ADR-001-Tech-Stack](./Architecture/ADR-001-Tech-Stack.md) (+ ADR-002/003/004).
- [x] **API Specs cover hết các Use Cases chính** — [Spec-Module-Contracts §7](./API/Spec-Module-Contracts.md) ánh xạ UC-02/UC-03/UC-04 đầy đủ.
- [x] **DB Schema normalized + có ER Diagram** — [DB-Entity-DocsViewer](./Schema/DB-Entity-DocsViewer.md) (Mermaid `erDiagram`, in-memory domain model, entity single-responsibility).
- [x] **Security Spec đã được Security Auditor review** — [Spec-Security §7](./Security/Spec-Security-DocsViewer.md) sign-off **APPROVED-WITH-CONDITIONS** (5 điều kiện chuyển sang Phase-3 code review).

> [!IMPORTANT]
> **Gate Phase-2: 5/5 tiêu chí ĐẠT (objectively met)** — sẵn sàng cho **trisjr (Accountable, theo Charter RACI)** sign-off để chuyển sang **Phase 3 (Product Design)** / Phase 4 (Implementation).
>
> Lưu ý minh bạch: sign-off security tại [§7 Spec-Security](./Security/Spec-Security-DocsViewer.md#7-security-auditor-review) do **AI Security-Auditor role** thực hiện (cơ chế review chuẩn của TNMCORE-OS). 5 điều kiện security (CSP, DOMPurify, PDF.js hardening, SCA, export sanitize) là yêu cầu verify ở Phase-3 implementation/code-review, **không** phải blocker của gate.

---

## 7. Tài liệu tham khảo

- [PRD — DocsViewer](../020-Requirements/PRD-DocsViewer.md)
- [SRS — DocsViewer](../020-Requirements/SRS-DocsViewer.md)
- [NFR — DocsViewer](../020-Requirements/NFR-DocsViewer.md)
- [Requirements MOC](../020-Requirements/Requirements-MOC.md)
- [Phase 2 — Architecture Design (SDLC)](../../knowledge-base/20-Project/SDLC-Phases/Phase-2-Architecture-Design.md)
- [Spec Template](./Spec-Template.md)

---
*Generated by TNMCORE-OS Architect Role.*
