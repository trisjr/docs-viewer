---
id: PRD-DOCSVIEWER
type: prd
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# 📄 PRD — DocsViewer

## Mục lục

1. [Executive Summary](#1-executive-summary)
2. [Background & Objectives](#2-background--objectives)
3. [Target Audience](#3-target-audience)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Flows & UX Requirements](#6-user-flows--ux-requirements)
7. [Success Metrics](#7-success-metrics)
8. [Out of Scope / Deferred](#8-out-of-scope--deferred)
9. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## 1. Executive Summary

**DocsViewer** là một web app duy nhất cho phép người dùng **Xem (View)** và **Trích xuất (Extract)** nội dung của nhiều định dạng tài liệu ngay trên trình duyệt, không cần cài đặt phần mềm chuyên dụng.

Giá trị cốt lõi: **"Xem mọi tài liệu ở một nơi + biến tài liệu thành dữ liệu khai thác được (feed AI/search)."**

MVP (Milestone M1) khoá cứng **3 định dạng lõi** — `.docx`, `.xlsx`, PDF — ở hai năng lực:

- **View đa định dạng:** render `.docx`, `.xlsx`, PDF trên web ở mức **Acceptable Fidelity** (độ trung thực chấp nhận được — không pixel-perfect nhưng không mất nội dung / vỡ layout nghiêm trọng).
- **Extract nội dung:** bóc tách text từ PDF/`.docx`, data dạng bảng từ `.xlsx`, phục vụ search trong tài liệu và feed cho AI.

Đồng thời, MVP đặt **nền tảng kiến trúc layered** (tách lớp Document Processing) để về sau gắn auth/multi-tenant và thêm định dạng mới mà không phải viết lại core.

---

## 2. Background & Objectives

### 2.1. Problem Statement

Để xem các loại tài liệu khác nhau (`.docx`, `.xlsx`, PDF), người dùng hiện phải cài nhiều phần mềm chuyên dụng, mở/đóng nhiều ứng dụng rời rạc (không có trải nghiệm xem thống nhất), và đặc biệt khó **trích xuất nhanh nội dung** để search hoặc đưa vào hệ thống khác (vd: feed cho AI/LLM). DocsViewer giải bài toán này bằng một web app View + Extract thống nhất.

### 2.2. Goals (SMART — gắn Key Result)

| ID | Mục tiêu | Đo lường (KR) |
| :- | :------- | :------------ |
| **O1** | Xem được `.docx`, `.xlsx`, PDF trên web ở Acceptable Fidelity, không cần cài app. | KR1.1 = 3/3 định dạng · KR1.2 ≥ 90% tài liệu mẫu render không lỗi nghiêm trọng · KR1.3 ≤ 3 giây mở+hiển thị trang đầu. |
| **O2** | Trích xuất text/data chính xác từ tài liệu để search & feed cho AI. | KR2.1 = 3/3 định dạng extract được · KR2.2 ≥ 95% độ chính xác trích xuất text · KR2.3 ≥ 90% truy vấn search trả đúng đoạn/tài liệu. |
| **O3** | Đặt nền tảng kiến trúc **multi-user-ready** để mở rộng phục vụ team/khách ở giai đoạn sau. | KR3.1 parse/extract tách rời UI & tầng user (Đạt) · KR3.2 thêm định dạng mới không sửa core (kiểm chứng M4) · KR3.3 có extension point gắn auth/multi-tenant ở M3 (Đạt). |

### 2.3. Non-Goals (Defer ngoài MVP)

- **Auth & Multi-tenancy đầy đủ** — Out of scope (defer M3).
- **PowerPoint `.pptx` & định dạng khác** — Out of scope (defer M4).
- **Convert tài liệu** (Word→PDF, Excel→JSON...) — Out of scope (defer M4).
- **OCR / Structured extraction** — Out of scope (defer M2).
- **Chỉnh sửa (edit) tài liệu** — Out of scope (ngoài định vị "viewer").
- **Real-time collaboration** — Out of scope (defer, chưa cần giai đoạn đầu).

---

## 3. Target Audience

| Persona | Mô tả | Giai đoạn |
| :------ | :---- | :-------- |
| **trisjr** | First user / Solo developer + Product Owner. Cần xem nhanh `.docx/.xlsx/pdf` và trích xuất nội dung để search/feed AI mà không cài phần mềm. | MVP (M1) |
| **Team / Khách (tương lai)** | Nhiều người dùng/tổ chức dùng chung, cần dữ liệu tách biệt (multi-tenant). Nguồn feedback mở rộng sản phẩm. | Defer M3 — kiến trúc MVP đã chuẩn bị extension point. |

---

## 4. Functional Requirements

| ID | Tính năng | Mô tả | Priority | MVP |
| :- | :-------- | :---- | :------- | :-: |
| FR-01 | Upload tài liệu | Chọn/kéo-thả file; validate định dạng (`.docx/.xlsx/pdf`) & ngưỡng kích thước; từ chối file sai/hỏng. | P0 (Must) | ✅ |
| FR-02 | Xem PDF | Render PDF trên web: phân trang, zoom cơ bản. | P0 (Must) | ✅ |
| FR-03 | Xem `.docx` | Render Word: text, heading, bảng, hình cơ bản ở mức Acceptable Fidelity. | P0 (Must) | ✅ |
| FR-04 | Xem `.xlsx` | Hiển thị sheet dạng grid (giá trị ô; công thức hiển thị kết quả); chuyển sheet. | P0 (Must) | ✅ |
| FR-05 | Giao diện xem thống nhất | Một UI chung; điều hướng giữa các loại tài liệu; nhận diện định dạng & chọn viewer phù hợp. | P0 (Must) | ✅ |
| FR-06 | Trích xuất text | Bóc tách text từ PDF và `.docx`. | P0 (Must) | ✅ |
| FR-07 | Trích xuất data bảng | Bóc tách data dạng bảng từ `.xlsx`. | P0 (Must) | ✅ |
| FR-08 | Sao chép/Export nội dung trích xuất | Cho phép copy/export text/data đã trích xuất (phục vụ search & feed AI). | P1 (Should) | ✅ |
| FR-09 | Tìm kiếm trong tài liệu | Search keyword trong nội dung đã trích xuất của tài liệu đang xem. | P0 (Must) | ✅ |
| FR-10 | Highlight & điều hướng kết quả | Đánh dấu (highlight) và nhảy giữa các kết quả khớp. | P1 (Should) | ✅ |
| FR-11 | Tách lớp Document Processing (enabler) | Logic parse/extract tách rời tầng UI & tầng user; có extension point cho định dạng mới + auth/multi-tenant về sau. | P0 (Must – architectural) | ✅ |

> Đặc tả chi tiết hành vi & ràng buộc của từng FR: xem [SRS-DocsViewer](./SRS-DocsViewer.md).

---

## 5. Non-Functional Requirements

Tóm tắt các NFR-01..NFR-09; chi tiết (đo lường, phương pháp verify) tại [NFR-DocsViewer](./NFR-DocsViewer.md).

| ID | Nhóm | Yêu cầu (đo được) |
| :- | :--- | :---------------- |
| NFR-01 | Performance | Mở & hiển thị trang đầu của tài liệu kích thước trung bình ≤ **3 giây**. |
| NFR-02 | Render Fidelity | ≥ **90%** tài liệu trong bộ mẫu render KHÔNG lỗi nghiêm trọng (không mất nội dung / vỡ layout nặng). |
| NFR-03 | Extraction Accuracy | Độ chính xác trích xuất text ≥ **95%** so khớp nội dung gốc trên bộ mẫu. |
| NFR-04 | Search Precision | ≥ **90%** truy vấn search trả về đúng đoạn/tài liệu chứa keyword. |
| NFR-05 | Security & Privacy | MVP single-user; giảm thiểu lưu trữ lâu dài (chốt cụ thể ở Phase-2); tách lớp dữ liệu người dùng sẵn sàng cho multi-tenant; threat model chi tiết defer M3. |
| NFR-06 | Extensibility / Scalability | Kiến trúc layered: thêm định dạng mới không sửa core viewer; có extension point gắn auth/multi-tenant. |
| NFR-07 | Resource / Browser Limits | Đặt ngưỡng kích thước file MVP; xét lazy render/phân trang để tránh quá tải bộ nhớ trình duyệt. |
| NFR-08 | Compatibility | Hỗ trợ trình duyệt hiện đại bản mới: Chrome, Edge, Firefox, Safari. |
| NFR-09 | Maintainability | Tuân KISS/YAGNI; ưu tiên OSS lib phổ biến, cộng đồng lớn, license tương thích. |

---

## 6. User Flows & UX Requirements

Ba luồng người dùng chính của MVP (chi tiết Main/Alternative/Exception flow tại các Use Case tương ứng):

### 6.1. Upload → View (UC-02)

User chọn/kéo-thả file → hệ thống validate định dạng + size → nhận diện loại tài liệu → chọn viewer phù hợp → render → hiển thị trang đầu (≤ 3 giây) → user điều hướng (cuộn/phân trang/chuyển sheet/zoom). Lỗi (sai định dạng, vượt size, file hỏng, render lỗi một phần) phải được thông báo rõ ràng, không làm crash app.

> Chi tiết: [UC-02 — Tải lên & Xem tài liệu](./Use-Cases/UC-02-Upload-View-Document.md).

### 6.2. Extract → Export (UC-03)

Khi tài liệu được mở, hệ thống trích xuất text/data ở nền → user xem nội dung đã trích → user **copy** ra clipboard hoặc **export** (plain text/đơn giản) để feed AI hay đưa sang hệ thống khác. Nếu trích xuất thất bại hoặc nội dung rỗng (ảnh/PDF scan), vẫn cho xem (view) và thông báo "không có text trích xuất được".

> Chi tiết: [UC-03 — Trích xuất & Sao chép/Export nội dung](./Use-Cases/UC-03-Extract-Export-Content.md).

### 6.3. Search trong tài liệu (UC-04)

User nhập keyword → hệ thống tìm trong nội dung đã trích xuất của tài liệu đang xem → **highlight** kết quả → user nhảy giữa các kết quả (next/prev) kèm số lượng kết quả. Nếu không có kết quả → báo "không tìm thấy"; nếu tài liệu chưa trích xong → báo "đang xử lý, thử lại".

> Chi tiết: [UC-04 — Tìm kiếm trong nội dung tài liệu](./Use-Cases/UC-04-Search-In-Document.md).

**UX Requirements chung:** giao diện xem thống nhất (Unified Viewer) cho cả 3 định dạng; thông báo lỗi thân thiện & có hướng dẫn; ưu tiên KISS — đơn giản, dễ dùng cho người dùng đơn lẻ.

---

## 7. Success Metrics

MVP đạt mục tiêu khi chạm các target Key Result sau (gắn O1/O2/O3):

| KR | Mô tả | Target |
| :- | :---- | :----- |
| KR1.1 | Số định dạng xem được trên web (`.docx`, `.xlsx`, PDF). | **3/3** |
| KR1.2 | Tỷ lệ tài liệu mẫu render không lỗi nghiêm trọng. | **≥ 90%** |
| KR1.3 | Thời gian mở & hiển thị trang đầu (tài liệu kích thước trung bình). | **≤ 3 giây** |
| KR2.1 | Số định dạng trích xuất được nội dung text/data. | **3/3** |
| KR2.2 | Độ chính xác trích xuất text trên bộ mẫu (so khớp nội dung gốc). | **≥ 95%** |
| KR2.3 | Tỷ lệ truy vấn search trả về đúng tài liệu/đoạn chứa keyword. | **≥ 90%** |
| KR3.1 | Logic parse/extract tách rời khỏi UI & tầng người dùng. | **Đạt** |
| KR3.2 | Bổ sung 1 định dạng mới không cần sửa core viewer. | **Đạt** (kiểm chứng M4) |
| KR3.3 | Có extension point rõ ràng để gắn auth/multi-tenant ở M3. | **Đạt** |

> Bộ OKRs đầy đủ: [OKRs](../010-Planning/OKRs.md).

---

## 8. Out of Scope / Deferred

| Hạng mục | Lý do hoãn | Milestone |
| :------- | :--------- | :-------- |
| Structured extraction / OCR (PDF scan) | Phức tạp, rủi ro cao; cần View + Extract cơ bản trước. | Defer M2 |
| Search xuyên nhiều tài liệu / semantic-AI search | Mở rộng độ sâu sau khi search trong tài liệu ổn định. | Defer M2 |
| Auth & Multi-tenancy đầy đủ (threat model, lưu trữ) | Cần cho team/khách nhưng không bắt buộc để validate core. | Defer M3 |
| PowerPoint `.pptx` & định dạng khác | Mở rộng độ rộng sau khi 3 định dạng lõi ổn định. | Defer M4 |
| Convert tài liệu (Word→PDF, Excel→JSON...) | Lớp trên của View + Extract. | Defer M4 |
| Chỉnh sửa (edit) tài liệu | Ngoài định vị "viewer"; phạm vi lớn. | Out of scope |
| Real-time collaboration | Phức tạp hạ tầng; chưa cần giai đoạn đầu. | Out of scope |

---

## Tài liệu tham khảo

- [Project Charter — DocsViewer](../010-Planning/Charter-DocsViewer.md)
- [MVP Scope — DocsViewer](../010-Planning/MVP-Scope.md)
- [OKRs](../010-Planning/OKRs.md)
- [Risk Register](../010-Planning/Risk-Register.md)
- [SRS — DocsViewer](./SRS-DocsViewer.md)
- [NFR — DocsViewer](./NFR-DocsViewer.md)
- [BRD-003 — Upload & Ingestion](./BRD/BRD-003-Upload-Ingestion.md)
- [BRD-004 — Multi-Format Viewing](./BRD/BRD-004-Multi-Format-Viewing.md)
- [BRD-005 — Content Extraction](./BRD/BRD-005-Content-Extraction.md)
- [BRD-006 — In-Document Search](./BRD/BRD-006-In-Document-Search.md)
- [UC-02 — Tải lên & Xem tài liệu](./Use-Cases/UC-02-Upload-View-Document.md)
- [UC-03 — Trích xuất & Export nội dung](./Use-Cases/UC-03-Extract-Export-Content.md)
- [UC-04 — Tìm kiếm trong tài liệu](./Use-Cases/UC-04-Search-In-Document.md)
- [Traceability Matrix — DocsViewer](./Traceability-Matrix.md)

---
*Generated by TNMCORE-OS BA Role.*
