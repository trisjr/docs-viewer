---
id: CHARTER-DOCSVIEWER
type: charter
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# 📜 Project Charter — DocsViewer

## Mục lục

1. [Thông tin Dự án](#1-thông-tin-dự-án)
2. [Business Case (Lý do tồn tại)](#2-business-case-lý-do-tồn-tại)
3. [Tầm nhìn & Mục tiêu](#3-tầm-nhìn--mục-tiêu)
4. [Phạm vi tổng thể (High-Level Scope)](#4-phạm-vi-tổng-thể-high-level-scope)
5. [Yêu cầu cốt lõi (High-Level Requirements)](#5-yêu-cầu-cốt-lõi-high-level-requirements)
6. [Stakeholders & RACI Matrix](#6-stakeholders--raci-matrix)
7. [Giả định & Ràng buộc (Assumptions & Constraints)](#7-giả-định--ràng-buộc-assumptions--constraints)
8. [Chỉ số thành công (Success Metrics)](#8-chỉ-số-thành-công-success-metrics)
9. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## 1. Thông tin Dự án

| Thuộc tính           | Chi tiết                                                              |
| :------------------- | :------------------------------------------------------------------- |
| **Tên sản phẩm**     | **DocsViewer**                                                       |
| **Loại sản phẩm**    | Web App (multi-user, hướng tới team/khách)                           |
| **Loại dự án**       | Personal project (phát triển bởi 1 cá nhân + AI)                     |
| **Sponsor / Owner**  | trisjr                                                               |
| **Product Manager**  | trisjr                                                               |
| **Đội phát triển**   | trisjr (solo developer) + Claude (AI pair programmer)               |
| **Timeline**         | Không có deadline cố định — vận hành theo **milestone** (xem Roadmap) |
| **Ngân sách**        | Cá nhân — ưu tiên open-source & free-tier infrastructure            |
| **Trạng thái duyệt** | ✅ Approved bởi trisjr — ngày 2026-06-24                            |

---

## 2. Business Case (Lý do tồn tại)

Hiện nay, để xem các loại tài liệu khác nhau (`.docx`, `.xlsx`, PDF), người dùng phải:

- Cài đặt nhiều phần mềm chuyên dụng (Microsoft Office, PDF reader...).
- Mở/đóng nhiều ứng dụng khác nhau, không có trải nghiệm xem thống nhất.
- Khó khăn khi cần **trích xuất nhanh nội dung** để tìm kiếm (search) hoặc đưa vào hệ thống khác (vd: feed cho AI/LLM).

**DocsViewer** giải quyết bài toán này bằng **một web app duy nhất**, cho phép người dùng:

1. **Xem (View)** nhiều định dạng tài liệu ngay trên trình duyệt — không cần cài đặt phần mềm.
2. **Trích xuất (Extract)** nội dung text/data từ tài liệu để phục vụ search, phân tích, hoặc tích hợp AI.

> [!NOTE]
> Giá trị cốt lõi: **"Xem mọi tài liệu ở một nơi + biến tài liệu thành dữ liệu khai thác được."**

---

## 3. Tầm nhìn & Mục tiêu

### 3.1. Tầm nhìn (Vision)

> Trở thành một nền tảng web nhẹ, thống nhất để **xem và khai thác nội dung** của mọi định dạng tài liệu phổ biến, sẵn sàng phục vụ cá nhân lẫn team.

### 3.2. Mục tiêu (Objectives) — đo lường được

| ID | Mục tiêu                                                                                          |
| :- | :----------------------------------------------------------------------------------------------- |
| O1 | Xem được `.docx`, `.xlsx`, PDF trên web với **độ trung thực chấp nhận được**, không cần cài app. |
| O2 | **Trích xuất** text/data chính xác từ tài liệu để search & feed cho AI.                          |
| O3 | Đặt nền tảng kiến trúc **multi-user** để mở rộng phục vụ team/khách ở giai đoạn sau.             |

> Các chỉ số định lượng chi tiết được định nghĩa tại [OKRs](./OKRs.md).

---

## 4. Phạm vi tổng thể (High-Level Scope)

| Trong phạm vi (In Scope)                                  | Ngoài phạm vi (Out of Scope) — ít nhất ở giai đoạn đầu        |
| :------------------------------------------------------- | :----------------------------------------------------------- |
| Web app xem tài liệu `.docx`, `.xlsx`, PDF              | App desktop / mobile native                                  |
| Trích xuất nội dung text/data từ tài liệu               | Chỉnh sửa (edit) nội dung tài liệu                           |
| Upload & hiển thị tài liệu trên giao diện thống nhất     | Real-time collaboration (đồng chỉnh sửa nhiều người)        |
| Tìm kiếm trong nội dung đã trích xuất                    | Convert tài liệu sang định dạng khác (có thể xét ở Full Scope) |
| Nền tảng kiến trúc sẵn sàng cho multi-user              | PowerPoint `.pptx` & các định dạng khác (Full Scope sau)     |

> Ranh giới chi tiết **MVP vs Full Scope** và quyết định Go/No-Go: xem [MVP-Scope](./MVP-Scope.md).

---

## 5. Yêu cầu cốt lõi (High-Level Requirements)

- **R1 — Đa định dạng:** Hỗ trợ render `.docx`, `.xlsx`, PDF trên web.
- **R2 — Trích xuất nội dung:** Bóc tách text (và data dạng bảng với Excel) từ tài liệu.
- **R3 — Tìm kiếm:** Cho phép search trong nội dung đã trích xuất.
- **R4 — Trải nghiệm thống nhất:** Một giao diện xem chung cho mọi định dạng.
- **R5 — Sẵn sàng multi-user:** Kiến trúc cho phép bổ sung auth & phân tách dữ liệu người dùng về sau.

---

## 6. Stakeholders & RACI Matrix

### 6.1. Danh sách Stakeholders

| Stakeholder          | Vai trò                                                        |
| :------------------- | :------------------------------------------------------------ |
| **trisjr**           | Sponsor, Product Manager, Developer chính, người dùng đầu tiên |
| **Claude (AI)**      | AI pair programmer — hỗ trợ research, design, code, tài liệu  |
| **End-users (tương lai)** | Team/khách sử dụng sản phẩm — nguồn feedback           |

### 6.2. RACI Matrix

> **R** = Responsible (người làm) · **A** = Accountable (người chịu trách nhiệm cuối) · **C** = Consulted (tham vấn) · **I** = Informed (được thông báo)

| Hoạt động                          | trisjr | Claude (AI) | End-users |
| :--------------------------------- | :----: | :---------: | :-------: |
| Định hướng chiến lược & Vision     |   A/R  |      C      |     I     |
| Xác định Requirements              |   A/R  |      C      |    C/I    |
| Thiết kế kiến trúc                 |    A   |     R/C     |     -     |
| Implementation (coding)            |    A   |      R      |     -     |
| QA / Kiểm thử                      |    A   |     R/C     |     I     |
| Deployment & Vận hành              |   A/R  |      C      |     I     |
| Quyết định Go/No-Go                |   A/R  |      C      |     I     |

> [!NOTE]
> Do dự án phát triển bởi 1 cá nhân + AI, **trisjr giữ vai trò Accountable cho toàn bộ** các hoạt động; Claude đảm nhận phần lớn **Responsible** ở khâu thực thi (code, tài liệu, research) dưới sự định hướng và phê duyệt của trisjr.

---

## 7. Giả định & Ràng buộc (Assumptions & Constraints)

### 7.1. Giả định (Assumptions)

- Người dùng sử dụng **trình duyệt hiện đại** (Chrome, Edge, Firefox, Safari bản mới).
- Tài liệu đầu vào **hợp lệ, không hỏng** và có dung lượng hợp lý (ngưỡng cụ thể chốt ở MVP-Scope).
- Các thư viện open-source render/parse tài liệu (vd: PDF.js, SheetJS, docx-preview) **đủ tốt** cho nhu cầu MVP.

### 7.2. Ràng buộc (Constraints)

- **Nguồn lực:** 1 developer + AI ⇒ ưu tiên **KISS/YAGNI**, tận dụng tối đa thư viện sẵn có, tránh over-engineering.
- **Ngân sách:** Cá nhân ⇒ ưu tiên **open-source** và **free-tier hosting**.
- **Nền tảng:** Web ⇒ chịu các giới hạn của trình duyệt (kích thước file, bộ nhớ, độ trung thực render).
- **Thời gian:** Không deadline cứng ⇒ kế hoạch theo **milestone**, linh hoạt điều chỉnh.

---

## 8. Chỉ số thành công (Success Metrics)

DocsViewer được xem là thành công ở giai đoạn đầu khi:

- ✅ Người dùng mở & xem được cả 3 định dạng (`.docx`, `.xlsx`, PDF) trên web mà không cần cài phần mềm.
- ✅ Nội dung trích xuất đủ chính xác để **search ra đúng kết quả** và feed cho AI mà không sai lệch lớn.
- ✅ Kiến trúc cho phép bổ sung multi-user mà **không phải viết lại core**.

> Bộ chỉ số định lượng (target số liệu): xem [OKRs](./OKRs.md).

---

## Tài liệu tham khảo

- [MVP Scope — DocsViewer](./MVP-Scope.md)
- [Product Roadmap](./Roadmap.md)
- [OKRs](./OKRs.md)
- [Risk Register](./Risk-Register.md)
- [Planning MOC](./Planning-MOC.md)
- [Phase 0 — Project Inception](../../knowledge-base/20-Project/SDLC-Phases/Phase-0-Project-Inception.md)

---
*Generated by TNMCORE-OS PM Role.*
