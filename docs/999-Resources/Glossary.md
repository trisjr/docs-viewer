---
id: GLOSSARY-DOCSVIEWER
type: glossary
status: live
created: 2026-02-04
updated: 2026-06-24
---

# 📖 Glossary — DocsViewer (Từ điển thuật ngữ dự án)

> Ubiquitous Language của dự án **DocsViewer**. Đây là SSOT thuật ngữ **đặc thù dự án** (theo rule SSOT của CLAUDE.md). Thuật ngữ nền tảng của OS nằm tại `knowledge-base/01-Metas/Glossary.md`.

## Mục lục

1. [Sản phẩm & Định dạng](#1-sản-phẩm--định-dạng)
2. [View & Render](#2-view--render)
3. [Extraction & Search](#3-extraction--search)
4. [Kiến trúc & Mở rộng](#4-kiến-trúc--mở-rộng)
5. [Yêu cầu & Backlog](#5-yêu-cầu--backlog)
6. [Bảng đối soát Anh – Việt](#6-bảng-đối-soát-anh--việt)
7. [Tài liệu tham khảo](#7-tài-liệu-tham-khảo)

---

## 1. Sản phẩm & Định dạng

| Thuật ngữ | Định nghĩa |
| :--- | :--- |
| **DocsViewer** | Web app xem (View) + trích xuất (Extract) nội dung tài liệu `.docx`/`.xlsx`/PDF, không cần cài phần mềm. |
| **Định dạng lõi (Core Formats)** | 3 định dạng khoá cứng cho MVP: `.docx`, `.xlsx`, PDF. |
| **Milestone (M1–M4)** | Cột mốc giá trị của Roadmap: M1 Core Viewer (MVP) → M2 Search & Extract+ → M3 Multi-user → M4 mở rộng định dạng. |

## 2. View & Render

| Thuật ngữ | Định nghĩa |
| :--- | :--- |
| **Viewer** | Thành phần render & hiển thị một loại định dạng tài liệu trên web. |
| **Render** | Quá trình dựng & hiển thị nội dung tài liệu trên trình duyệt. |
| **Render Fidelity (Độ trung thực render)** | Mức độ hiển thị trên web giống bản gốc. |
| **Acceptable Fidelity (Độ trung thực chấp nhận được)** | Ngưỡng MVP: không pixel-perfect nhưng không mất nội dung / không vỡ layout nghiêm trọng (định nghĩa chặt tại NFR-02). |
| **Unified Viewer (Giao diện xem thống nhất)** | Một UI chung tự nhận diện định dạng & chọn viewer phù hợp; điều hướng nhất quán cho cả 3 định dạng. |

## 3. Extraction & Search

| Thuật ngữ | Định nghĩa |
| :--- | :--- |
| **Ingestion / Upload** | Quy trình đưa tài liệu vào hệ thống (chọn/kéo-thả file + validate định dạng & dung lượng). |
| **Extraction (Trích xuất)** | Bóc tách text/data từ tài liệu để phục vụ search & feed AI. |
| **Structured Extraction** | Trích xuất có cấu trúc (bảng/metadata phức tạp) — Out of scope, defer M2. |
| **OCR (Optical Character Recognition)** | Nhận dạng text từ ảnh / PDF scan — Out of scope, defer M2. |
| **Search Precision** | Tỷ lệ truy vấn search trả về đúng đoạn/tài liệu chứa keyword (NFR-04, KR2.3). |
| **In-Document Search** | Tìm keyword trong nội dung đã trích xuất của **tài liệu đang xem** (single-document; cross-document defer M2). |

## 4. Kiến trúc & Mở rộng

| Thuật ngữ | Định nghĩa |
| :--- | :--- |
| **Document Processing Layer** | Tầng logic parse/extract tách rời UI và tầng người dùng (enabler cho multi-user — FR-11, NFR-06). |
| **Extension Point** | Điểm móc kiến trúc để gắn định dạng mới hoặc auth/multi-tenant mà không sửa core. |
| **Multi-user / Multi-tenant** | Nhiều người dùng/tổ chức dùng chung, dữ liệu tách biệt — Out of scope MVP, defer M3. |
| **Single-user (MVP)** | Phạm vi MVP: chưa có auth/đa người dùng. |
| **`MAX_FILE_SIZE`** | Tham số ngưỡng kích thước file tối đa khi upload (đề xuất tại NFR §4.1, Architect chốt Phase-2). |

## 5. Yêu cầu & Backlog

| Thuật ngữ | Định nghĩa |
| :--- | :--- |
| **FR / NFR** | Functional Requirement / Non-functional Requirement (sơ đồ ID canonical theo PRD). |
| **INVEST** | Tiêu chí story tốt: Independent, Negotiable, Valuable, Estimable, Small, Testable. |
| **Gherkin (Given–When–Then)** | Cú pháp viết Acceptance Criteria máy đọc được. |
| **Unhappy Path** | Kịch bản lỗi/biên (ngược với happy path). |
| **Enabler Story** | Story kỹ thuật tạo nền tảng (vd tách lớp kiến trúc), không trực tiếp user-facing. |
| **MoSCoW** | Khung ưu tiên: Must / Should / Could / Won't. |
| **RICE** | Khung ưu tiên: Reach × Impact × Confidence / Effort. |

## 6. Bảng đối soát Anh – Việt

| English Term | Tiếng Việt | Khuyến nghị |
| :--- | :--- | :--- |
| Render | Dựng hiển thị | Dùng **render** |
| Extraction | Trích xuất | Dùng cả hai |
| Fidelity | Độ trung thực | Dùng **fidelity / độ trung thực** |
| Multi-tenant | Đa người thuê | Dùng **multi-tenant** |
| Acceptance Criteria | Tiêu chí nghiệm thu | Dùng **AC / Acceptance Criteria** |

---

## 7. Tài liệu tham khảo

- [PRD — DocsViewer](../020-Requirements/PRD-DocsViewer.md)
- [NFR — DocsViewer](../020-Requirements/NFR-DocsViewer.md)
- [Traceability Matrix](../020-Requirements/Traceability-Matrix.md)
- [Glossary nền tảng OS](../../knowledge-base/01-Metas/Glossary.md)

---
*Glossary dự án DocsViewer — quản lý bởi TNMCORE-OS BA Role.*
