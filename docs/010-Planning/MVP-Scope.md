---
id: MVP-SCOPE-DOCSVIEWER
type: scope
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# 🎯 MVP Scope — DocsViewer

## Mục lục

1. [Mục tiêu MVP](#1-mục-tiêu-mvp)
2. [Nguyên tắc khoanh vùng MVP](#2-nguyên-tắc-khoanh-vùng-mvp)
3. [MVP Scope (In Scope)](#3-mvp-scope-in-scope)
4. [Full Scope (Để dành cho sau)](#4-full-scope-để-dành-cho-sau)
5. [Tham khảo giải pháp tương tự](#5-tham-khảo-giải-pháp-tương-tự)
6. [Go/No-Go Decision](#6-gono-go-decision)
7. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## 1. Mục tiêu MVP

MVP của DocsViewer nhằm chứng minh **giả thuyết cốt lõi**:

> *"Một web app có thể xem được `.docx`, `.xlsx`, PDF và trích xuất nội dung của chúng đủ tốt để search/feed AI — mà không cần cài đặt phần mềm."*

MVP **chưa** cần multi-user hoàn chỉnh; mục tiêu là validate **core View + Extract** trên 3 định dạng trước.

---

## 2. Nguyên tắc khoanh vùng MVP

Hai trục quyết định phạm vi (bám rủi ro kỹ thuật số 1 — xem [Risk Register](./Risk-Register.md)):

- **Trục định dạng:** Chốt cứng **3 định dạng** — `.docx`, `.xlsx`, PDF. Không mở rộng thêm trong MVP.
- **Trục độ sâu xử lý:** MVP = **View + trích xuất text/data cơ bản**. **Defer** (hoãn) các xử lý nâng cao: trích xuất có cấu trúc (structured extraction), nhận diện layout phức tạp, OCR cho PDF scan.

> [!IMPORTANT]
> Vì đội ngũ là solo + AI và không có deadline cứng, MVP ưu tiên **chiều sâu lõi** (3 định dạng chạy tốt) hơn là **chiều rộng tính năng** (nhiều định dạng/nhiều tính năng nhưng hời hợt).

---

## 3. MVP Scope (In Scope)

| # | Hạng mục                          | Mô tả                                                                                 |
| :- | :------------------------------- | :----------------------------------------------------------------------------------- |
| 1 | **Upload & xem PDF**             | Render PDF trên web (phân trang, zoom cơ bản).                                        |
| 2 | **Upload & xem `.docx`**         | Render nội dung Word (text, heading, bảng, hình cơ bản) ở mức trung thực chấp nhận được. |
| 3 | **Upload & xem `.xlsx`**         | Hiển thị sheet/bảng tính dạng grid (giá trị ô; công thức hiển thị kết quả).            |
| 4 | **Trích xuất nội dung**          | Bóc tách text từ `.docx`/PDF; bóc tách data dạng bảng từ `.xlsx`.                     |
| 5 | **Tìm kiếm trong nội dung**      | Search keyword trong nội dung đã trích xuất của tài liệu đang xem.                    |
| 6 | **Giao diện xem thống nhất**     | Một UI chung điều hướng giữa các loại tài liệu.                                       |
| 7 | **Nền tảng kiến trúc multi-user**| Thiết kế tách lớp để **về sau** gắn auth/multi-tenant mà không viết lại core.         |

---

## 4. Full Scope (Để dành cho sau)

| Hạng mục                                   | Lý do hoãn                                                        |
| :----------------------------------------- | :--------------------------------------------------------------- |
| **Auth & Multi-tenancy đầy đủ**            | Cần thiết cho team/khách, nhưng không bắt buộc để validate core. |
| **PowerPoint `.pptx` & định dạng khác**    | Mở rộng độ rộng sau khi 3 định dạng lõi ổn định.                 |
| **Convert tài liệu** (vd: Word→PDF, Excel→JSON) | Tính năng giá trị cao nhưng là lớp trên của View+Extract.   |
| **Structured extraction / OCR**            | Phức tạp, rủi ro cao; cần View+Extract cơ bản trước.            |
| **Chỉnh sửa (edit) tài liệu**              | Ngoài định vị "viewer"; phạm vi lớn.                            |
| **Real-time collaboration**                | Phức tạp hạ tầng; chưa cần cho giai đoạn đầu.                   |

---

## 5. Tham khảo giải pháp tương tự

> *(Quét nhanh — phục vụ định vị, không phải Research Notes đầy đủ.)*

| Giải pháp                          | Điểm mạnh                                  | Khoảng trống DocsViewer nhắm tới             |
| :--------------------------------- | :---------------------------------------- | :------------------------------------------ |
| Google Docs Viewer / Drive preview | Xem đa định dạng, hạ tầng mạnh             | Gắn chặt hệ sinh thái Google; khó tùy biến trích xuất/tích hợp AI |
| Microsoft Office Online            | Độ trung thực render cao                   | Nặng, phụ thuộc hệ sinh thái MS              |
| Lib open-source (PDF.js, SheetJS, docx-preview) | Nhúng được, miễn phí, kiểm soát cao | Là *thư viện* lẻ — cần ráp thành 1 web app View+Extract thống nhất |

> [!NOTE]
> Hướng tiếp cận khả dĩ cho MVP: **ráp các thư viện open-source** (PDF.js cho PDF, docx-preview/mammoth cho `.docx`, SheetJS cho `.xlsx`) thành một trải nghiệm xem + trích xuất thống nhất. Quyết định tech stack cụ thể sẽ chốt ở Phase thiết kế kiến trúc.

---

## 6. Go/No-Go Decision

| Tiêu chí Go                                                              | Trạng thái |
| :---------------------------------------------------------------------- | :--------- |
| Giá trị cốt lõi (View + Extract đa định dạng) rõ ràng & khả thi          | ✅          |
| Có thể tận dụng thư viện open-source ⇒ chi phí build hợp lý cho solo + AI | ✅          |
| Rủi ro kỹ thuật chính đã nhận diện & có hướng giảm thiểu                 | ✅ (xem Risk Register) |
| Không deadline cứng ⇒ áp lực thời gian thấp                              | ✅          |

> [!IMPORTANT]
> **Quyết định: 🟢 GO** — Tiến hành xây dựng MVP với phạm vi 3 định dạng (`.docx`, `.xlsx`, PDF) ở mức View + trích xuất cơ bản.
>
> ✅ _Đã phê duyệt bởi: trisjr (Accountable) — ngày 2026-06-24._

---

## Tài liệu tham khảo

- [Project Charter — DocsViewer](./Charter-DocsViewer.md)
- [Product Roadmap](./Roadmap.md)
- [OKRs](./OKRs.md)
- [Risk Register](./Risk-Register.md)
- [Phase 0 — Project Inception](../../knowledge-base/20-Project/SDLC-Phases/Phase-0-Project-Inception.md)
