---
id: OKRS-001
type: okrs
status: approved
created: 2026-02-04
updated: 2026-06-24
---

# 🎯 Objectives and Key Results (OKRs) — DocsViewer

## Mục lục

1. [Phạm vi áp dụng](#1-phạm-vi-áp-dụng)
2. [Objective 1 — Trải nghiệm xem đa định dạng](#objective-1--trải-nghiệm-xem-đa-định-dạng)
3. [Objective 2 — Trích xuất nội dung khai thác được](#objective-2--trích-xuất-nội-dung-khai-thác-được)
4. [Objective 3 — Nền tảng sẵn sàng mở rộng](#objective-3--nền-tảng-sẵn-sàng-mở-rộng)
5. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## 1. Phạm vi áp dụng

> [!NOTE]
> Bộ OKRs này gắn với chu kỳ **Milestone M1 (MVP)** — xem [Roadmap](./Roadmap.md). Vì dự án không có deadline cứng, chu kỳ đo theo milestone thay vì theo quý.

---

## Objective 1 — Trải nghiệm xem đa định dạng

> Người dùng xem được mọi định dạng lõi trên web, mượt và không cần cài phần mềm.

| KR   | Key Result (đo lường được)                                                              | Target  |
| :--- | :------------------------------------------------------------------------------------- | :------ |
| KR1.1 | Số định dạng xem được trên web (`.docx`, `.xlsx`, PDF)                                 | **3/3** |
| KR1.2 | Tỷ lệ tài liệu mẫu render **không lỗi nghiêm trọng** (mất nội dung/vỡ layout nặng)     | **≥ 90%** |
| KR1.3 | Thời gian mở & hiển thị trang đầu của tài liệu kích thước trung bình                   | **≤ 3 giây** |

---

## Objective 2 — Trích xuất nội dung khai thác được

> Nội dung trích xuất đủ chính xác để search và feed cho AI.

| KR   | Key Result (đo lường được)                                                              | Target  |
| :--- | :------------------------------------------------------------------------------------- | :------ |
| KR2.1 | Số định dạng trích xuất được nội dung text/data                                        | **3/3** |
| KR2.2 | Độ chính xác trích xuất text trên bộ tài liệu mẫu (so khớp nội dung gốc)               | **≥ 95%** |
| KR2.3 | Tỷ lệ truy vấn search trả về **đúng** tài liệu/đoạn chứa keyword                       | **≥ 90%** |

---

## Objective 3 — Nền tảng sẵn sàng mở rộng

> Kiến trúc cho phép tiến lên multi-user mà không phải viết lại core.

| KR   | Key Result (đo lường được)                                                              | Target  |
| :--- | :------------------------------------------------------------------------------------- | :------ |
| KR3.1 | Logic xử lý tài liệu (parse/extract) **tách rời** khỏi tầng UI và tầng người dùng      | **Đạt** |
| KR3.2 | Bổ sung 1 định dạng mới (vd `.pptx`) **không cần** sửa core viewer                     | **Đạt** (kiểm chứng ở M4) |
| KR3.3 | Có điểm móc (extension point) rõ ràng để gắn auth/multi-tenant ở M3                    | **Đạt** |

---

## Tài liệu tham khảo

- [Project Charter — DocsViewer](./Charter-DocsViewer.md)
- [MVP Scope — DocsViewer](./MVP-Scope.md)
- [Product Roadmap](./Roadmap.md)
- [Risk Register](./Risk-Register.md)
