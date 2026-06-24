---
id: SRS-DOCSVIEWER
type: srs
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# 📖 SRS — DocsViewer

## Mục lục

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Other Non-functional Requirements](#5-other-non-functional-requirements)
6. [Tài liệu tham khảo](#6-tài-liệu-tham-khảo)

---

## 1. Introduction

### 1.1. Purpose

Tài liệu Software Requirements Specification (SRS) này đặc tả chi tiết yêu cầu phần mềm cho **MVP (Milestone M1)** của **DocsViewer** — web app cho phép **xem (View)** và **trích xuất (Extract)** nội dung tài liệu ngay trên trình duyệt, không cần cài đặt phần mềm. SRS là cầu nối giữa Product Requirements ([PRD-DocsViewer.md](./PRD-DocsViewer.md)) và pha thiết kế kiến trúc (Phase-2).

### 1.2. Document Conventions

- Ngôn ngữ: Tiếng Việt; thuật ngữ IT giữ nguyên English.
- **FR-xx** = Functional Requirement; **NFR-xx** = Non-functional Requirement. Sơ đồ ID **đồng bộ 1:1 với [PRD-DocsViewer.md](./PRD-DocsViewer.md)** (PRD là canonical).
- Mọi yêu cầu trong SRS này thuộc phạm vi **M1 (MVP)**. Nội dung M2/M3/M4 chỉ ghi 1 dòng "Out of scope (defer Mx)".
- Truy vết: mỗi FR/NFR liên kết về MVP-Scope, OKRs (KR) hoặc Risk Register (R).

### 1.3. Project Scope

MVP chốt cứng **3 định dạng**: `.docx`, `.xlsx`, **PDF**. Phạm vi xử lý ở mức **View + trích xuất text/data cơ bản** + search trong tài liệu đang xem + nền tảng kiến trúc tách lớp sẵn sàng multi-user. Ranh giới đầy đủ: xem [MVP-Scope](../010-Planning/MVP-Scope.md).

> [!NOTE]
> MVP **không** bao gồm: structured extraction/OCR, convert tài liệu, `.pptx`, auth/multi-tenancy đầy đủ, chỉnh sửa tài liệu, real-time collaboration — tất cả defer theo [Roadmap](../010-Planning/Roadmap.md).

---

## 2. Overall Description

### 2.1. Product Perspective

DocsViewer là **web app client-side** ráp từ các thư viện open-source (OSS) render/parse tài liệu thành một trải nghiệm **View + Extract thống nhất**. Sản phẩm là **self-contained**, không phụ thuộc hệ sinh thái Office/Google. Kiến trúc tách lớp Document Processing khỏi UI và lớp người dùng (xem **FR-11**) để đặt nền cho multi-user về sau (KR3.x).

### 2.2. User Classes and Characteristics

| User Class | MVP (M1) | Tương lai |
| :--------- | :------- | :-------- |
| **Single-user (Owner)** | Người dùng duy nhất, upload và xem tài liệu cục bộ trên phiên của mình. **Đây là user class duy nhất của MVP.** | — |
| **Multi-tenant users** | Out of scope (defer M3) | Auth, phân tách & bảo mật dữ liệu theo người dùng (R-03). |

### 2.3. Operating Environment

- Chạy trên **trình duyệt hiện đại** (Chrome, Edge, Firefox, Safari bản mới) — ràng buộc tương thích nêu tại **NFR-08**.
- Xử lý tài liệu chủ yếu phía **client-side**; chịu giới hạn trình duyệt về bộ nhớ/kích thước file (**NFR-07**, R-05).

---

## 3. System Features

> [!NOTE]
> 11 Functional Requirements dưới đây đồng bộ 1:1 với PRD §4 (cùng ID, cùng tính năng), mở rộng từ 7 hạng mục In-Scope của [MVP-Scope](../010-Planning/MVP-Scope.md). Tất cả thuộc **M1 (MVP)**.

### FR-01 — Upload tài liệu

- **Description:** Cho phép user nạp tài liệu vào hệ thống để xem & trích xuất.
- **Stimulus/Response:** User chọn/kéo-thả file → hệ thống validate định dạng + kích thước → chuyển sang nhận diện loại & render.
- **Functional Requirements:**
  - FR-01.1: Chấp nhận `.docx`, `.xlsx`, `.pdf`; từ chối định dạng ngoài 3 loại với thông báo rõ ràng (unhappy path).
  - FR-01.2: Áp ngưỡng kích thước file MVP (`MAX_FILE_SIZE`, xem **NFR-07**); từ chối file vượt ngưỡng.
  - FR-01.3: Thông báo lỗi thân thiện khi file hỏng/không hợp lệ — không crash.
- **Trace:** MVP-Scope #1–#3 · UC-02 · R-05.

### FR-02 — Xem PDF

- **Description:** Render PDF trên web với phân trang và zoom cơ bản.
- **Stimulus/Response:** User mở file PDF → hệ thống hiển thị trang đầu (≤ NFR-01), cho phép chuyển trang & zoom.
- **Functional Requirements:**
  - FR-02.1: Hiển thị nội dung theo trang (page navigation).
  - FR-02.2: Zoom in/out cơ bản.
- **Trace:** MVP-Scope #1 · UC-02 (A1) · KR1.1 · KR1.2 · KR1.3 · R-01.

### FR-03 — Xem `.docx`

- **Description:** Render nội dung Word (text, heading, bảng, hình cơ bản) ở mức Acceptable Fidelity.
- **Stimulus/Response:** User mở `.docx` → hệ thống render nội dung đã định dạng.
- **Functional Requirements:**
  - FR-03.1: Render text, heading, bảng, hình cơ bản.
  - FR-03.2: Đạt "độ trung thực chấp nhận được" theo **NFR-02** (không yêu cầu pixel-perfect).
- **Trace:** MVP-Scope #2 · UC-02 (A2) · KR1.1 · KR1.2 · R-01.

### FR-04 — Xem `.xlsx`

- **Description:** Hiển thị sheet/bảng tính dạng grid; công thức hiển thị kết quả.
- **Stimulus/Response:** User mở `.xlsx` → hệ thống hiển thị các sheet dạng grid.
- **Functional Requirements:**
  - FR-04.1: Hiển thị giá trị ô theo grid; chuyển đổi giữa các sheet.
  - FR-04.2: Công thức hiển thị **kết quả** (không yêu cầu re-compute engine công thức trong MVP).
- **Trace:** MVP-Scope #3 · UC-02 (A3) · KR1.1 · KR1.2 · R-01 · R-05.

### FR-05 — Giao diện xem thống nhất (Unified Viewer)

- **Description:** Một UI chung điều hướng giữa các loại tài liệu; nhận diện định dạng và định tuyến tới viewer phù hợp.
- **Stimulus/Response:** User mở tài liệu bất kỳ → hệ thống đọc loại file (extension/MIME) → chọn renderer/extractor đúng → trải nghiệm xem/điều hướng nhất quán cho cả 3 định dạng.
- **Functional Requirements:**
  - FR-05.1: Cùng một khung giao diện cho PDF/`.docx`/`.xlsx`; điều hướng nhất quán (mở, đóng, chuyển tài liệu).
  - FR-05.2: Phát hiện định dạng (extension/MIME) & định tuyến tới đúng pipeline; báo lỗi nếu định dạng không hỗ trợ.
- **Trace:** MVP-Scope #6 · UC-02 · O1 (Charter).

### FR-06 — Trích xuất text (PDF & `.docx`)

- **Description:** Bóc tách nội dung text từ PDF và `.docx` để phục vụ search/feed AI.
- **Stimulus/Response:** Sau khi tài liệu được mở → hệ thống trích xuất text của tài liệu.
- **Functional Requirements:**
  - FR-06.1: Trích xuất text cơ bản từ PDF (không OCR cho PDF scan — defer M2) và `.docx` (đoạn văn, heading, text trong bảng).
  - FR-06.2: Giữ nội dung đủ chính xác để search & feed AI — mục tiêu **NFR-03** (≥ 95%).
- **Trace:** MVP-Scope #4 · UC-03 · KR2.1 · KR2.2 · R-02.

### FR-07 — Trích xuất data bảng (`.xlsx`)

- **Description:** Bóc tách data dạng bảng (giá trị ô) từ bảng tính.
- **Stimulus/Response:** Sau khi `.xlsx` được mở → hệ thống trích xuất data dạng bảng theo từng sheet.
- **Functional Requirements:**
  - FR-07.1: Trích xuất giá trị ô theo hàng/cột, theo từng sheet.
  - FR-07.2: Đầu ra ở dạng có thể search/feed AI (text/tabular cơ bản).
- **Trace:** MVP-Scope #4 · UC-03 (A2) · KR2.1 · KR2.2 · R-02.

### FR-08 — Sao chép/Export nội dung trích xuất

- **Description:** Cho phép user copy/export text/data đã trích xuất để đưa vào hệ thống khác / feed AI.
- **Stimulus/Response:** User bấm copy/export → hệ thống đưa nội dung đã trích ra clipboard hoặc file đơn giản.
- **Functional Requirements:**
  - FR-08.1: Copy text ra clipboard.
  - FR-08.2: Export nội dung trích xuất (plain text/định dạng đơn giản).
- **Trace:** MVP-Scope #4 · UC-03 · O2 (Charter).

### FR-09 — Tìm kiếm trong tài liệu

- **Description:** Tìm kiếm keyword trong nội dung đã trích xuất của tài liệu đang xem.
- **Stimulus/Response:** User nhập keyword → hệ thống trả về đoạn/vị trí chứa keyword trong tài liệu hiện tại.
- **Functional Requirements:**
  - FR-09.1: Search keyword trong nội dung **tài liệu đang xem** (cross-document defer M2).
  - FR-09.2: Quy tắc khớp theo Business Rule của [BRD-006](./BRD/BRD-006-In-Document-Search.md); đạt **NFR-04** (≥ 90%).
- **Trace:** MVP-Scope #5 · UC-04 · KR2.3.

### FR-10 — Highlight & điều hướng kết quả

- **Description:** Đánh dấu (highlight) và nhảy giữa các kết quả khớp.
- **Stimulus/Response:** Sau khi search có kết quả → hệ thống highlight và cho phép next/prev giữa các kết quả.
- **Functional Requirements:**
  - FR-10.1: Highlight các vị trí khớp; hiển thị số lượng kết quả.
  - FR-10.2: Điều hướng next/prev giữa các kết quả (hành vi biên: wrap-around — xem BRD-006).
- **Trace:** MVP-Scope #5 · UC-04 (A1) · KR2.3.

### FR-11 — Layered Document Processing (nền tảng kiến trúc)

- **Description:** Tầng xử lý tài liệu (parse/render/extract) được **tách lớp**, độc lập khỏi tầng UI và tầng người dùng — yêu cầu nền tảng đảm bảo khả năng mở rộng multi-user và thêm định dạng mới mà không phải viết lại core.
- **Stimulus/Response:** Khi thêm định dạng mới hoặc gắn auth/multi-tenant → core viewer **không cần** sửa; chỉ bổ sung adapter/extension point.
- **Functional Requirements:**
  - FR-11.1: Logic parse/extract tách rời khỏi tầng UI và tầng người dùng — **KR3.1**.
  - FR-11.2: Thêm 1 định dạng mới (vd `.pptx`) không cần sửa core viewer — **KR3.2** (kiểm chứng ở M4).
  - FR-11.3: Cung cấp extension point rõ ràng để gắn auth/multi-tenant — **KR3.3** (kích hoạt ở M3).
- **Trace:** MVP-Scope #7 · **NFR-06** · KR3.1 / KR3.2 / KR3.3 · R-03.

---

## 4. External Interface Requirements

### 4.1. User Interfaces

- **Unified Viewer (FR-05):** một giao diện web duy nhất để upload, xem và search trên cả 3 định dạng, với điều hướng nhất quán. Chi tiết UX design: defer pha Design (`../040-Design/`).

### 4.2. Software Interfaces — Candidate OSS Libraries

> [!IMPORTANT]
> Các thư viện dưới đây là **candidate** (định hướng từ MVP-Scope §5). Quyết định tech stack chính thức do **Architect chốt ở Phase-2** (`../030-Specs/`).

| Định dạng | Candidate OSS | Vai trò |
| :-------- | :------------ | :------ |
| PDF       | **PDF.js**    | Render + extract text PDF (client-side). |
| `.docx`   | **docx-preview / mammoth** | Render & bóc tách text Word. |
| `.xlsx`   | **SheetJS**   | Parse & hiển thị bảng tính, extract data. |

> Ràng buộc phụ thuộc OSS (license/maintenance): xem R-06 (Risk Register).

### 4.3. Hardware & Communication Interfaces

- **Hardware:** Không yêu cầu phần cứng đặc biệt; chạy trên máy client qua trình duyệt (NFR-08).
- **Communication:** MVP xử lý **client-side** là chính; chưa yêu cầu giao thức server-side phức tạp (auth/storage defer M3). Tối thiểu hóa phụ thuộc mạng.

---

## 5. Other Non-functional Requirements

> [!NOTE]
> Phần này **tóm tắt** NFR-01..NFR-09 (đồng bộ 1:1 với PRD §5). Đặc tả đầy đủ (metric, điều kiện đo, acceptance, tham số `MAX_FILE_SIZE` & baseline) là SSOT tại [NFR-DocsViewer.md](./NFR-DocsViewer.md) — không lặp lại chi tiết tại đây.

| ID | Nhóm | Tóm tắt | Trace |
| :- | :--- | :------ | :---- |
| **NFR-01** | Performance | Mở & hiển thị trang đầu tài liệu trung bình ≤ 3 giây. | KR1.3 |
| **NFR-02** | Render Fidelity | ≥ 90% tài liệu mẫu render không lỗi nghiêm trọng (Acceptable Fidelity). | KR1.2 · R-01 |
| **NFR-03** | Extraction Accuracy | Độ chính xác trích xuất text ≥ 95% trên bộ mẫu. | KR2.2 · R-02 |
| **NFR-04** | Search Precision | ≥ 90% truy vấn search trả đúng đoạn/tài liệu. | KR2.3 |
| **NFR-05** | Security & Privacy | Tách lớp dữ liệu người dùng từ MVP; threat model multi-tenant defer M3. | R-03 · KR3.1 · KR3.3 |
| **NFR-06** | Extensibility / Scalability | Kiến trúc layered: thêm định dạng mới không sửa core; extension point cho auth/multi-tenant. | KR3.1 · KR3.2 · KR3.3 |
| **NFR-07** | Resource / Browser Limits | Tôn trọng giới hạn trình duyệt; áp ngưỡng `MAX_FILE_SIZE`; lazy render/phân trang. | R-05 |
| **NFR-08** | Compatibility | Chạy đúng trên trình duyệt hiện đại (Chrome/Edge/Firefox/Safari bản mới). | Charter §7.1 |
| **NFR-09** | Maintainability | Tuân KISS/YAGNI; ưu tiên OSS lib phổ biến, license tương thích. | R-06 · R-07 |

---

## 6. Tài liệu tham khảo

- [PRD — DocsViewer](./PRD-DocsViewer.md)
- [NFR — DocsViewer](./NFR-DocsViewer.md)
- [Project Charter — DocsViewer](../010-Planning/Charter-DocsViewer.md)
- [MVP Scope — DocsViewer](../010-Planning/MVP-Scope.md)
- [OKRs — DocsViewer](../010-Planning/OKRs.md)
- [Roadmap — DocsViewer](../010-Planning/Roadmap.md)
- [Risk Register — DocsViewer](../010-Planning/Risk-Register.md)
- [Traceability Matrix](./Traceability-Matrix.md)
- Architecture / SDD (Phase-2): `../030-Specs/`

---
*Generated by TNMCORE-OS BA Role.*
