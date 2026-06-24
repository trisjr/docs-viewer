---
id: RISK-REGISTER-DOCSVIEWER
type: risk-register
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# ⚠️ Risk Register — DocsViewer

## Mục lục

1. [Cách đánh giá rủi ro](#1-cách-đánh-giá-rủi-ro)
2. [Risk Log](#2-risk-log)
3. [Chi tiết rủi ro trọng yếu](#3-chi-tiết-rủi-ro-trọng-yếu)
4. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## 1. Cách đánh giá rủi ro

- **Probability (Xác suất):** Low (1) · Med (2) · High (3)
- **Impact (Ảnh hưởng):** Low (1) · Med (2) · High (3)
- **Score = Probability × Impact** (1–9). Score ≥ 6 ⇒ rủi ro **trọng yếu**, cần kế hoạch giảm thiểu chủ động.

---

## 2. Risk Log

| ID   | Mô tả rủi ro                                                                 | Prob. | Impact | Score | Kế hoạch giảm thiểu                                                                 | Owner   |
| :--- | :-------------------------------------------------------------------------- | :---- | :----- | :---- | :--------------------------------------------------------------------------------- | :------ |
| R-01 | **Độ trung thực render** kém trên web cho `.docx`/`.xlsx`/PDF (vỡ layout)   | High  | High   | **9** | Chốt "độ trung thực chấp nhận được" ở MVP; chọn lib mạnh (PDF.js, docx-preview, SheetJS); test trên bộ tài liệu mẫu đa dạng. | trisjr  |
| R-02 | **Độ chính xác trích xuất** thấp ⇒ search/AI sai lệch                       | Med   | High   | **6** | Tập trung text/data cơ bản trước; defer structured extraction/OCR; đo bằng KR2.2/KR2.3. | trisjr  |
| R-03 | **Bảo mật & privacy tài liệu** khi lên multi-user (tài liệu thường nhạy cảm) | Med   | High   | **6** | Thiết kế tách lớp người dùng từ đầu; hoãn lưu trữ multi-tenant tới M3 với threat model riêng. | trisjr  |
| R-04 | **Scope creep** — thêm định dạng/tính năng ngoài 3 định dạng lõi             | High  | Med    | **6** | Khoanh cứng MVP 3 định dạng; mọi mở rộng đẩy sang Full Scope/Roadmap.              | trisjr  |
| R-05 | **Giới hạn trình duyệt** với file lớn (bộ nhớ, hiệu năng render)             | Med   | Med    | **4** | Đặt ngưỡng kích thước file MVP; xét lazy render/phân trang.                        | trisjr  |
| R-06 | **Phụ thuộc thư viện open-source** (bug, bỏ maintain, license)               | Low   | Med    | **2** | Ưu tiên lib phổ biến, cộng đồng lớn; kiểm tra license tương thích.                 | trisjr  |
| R-07 | **Bandwidth solo dev** — 1 người + AI, dễ quá tải khi phạm vi phình to       | Med   | Med    | **4** | Tuân KISS/YAGNI; ưu tiên milestone; tận dụng AI cho phần thực thi.                 | trisjr  |

---

## 3. Chi tiết rủi ro trọng yếu

### 🔴 R-01 — Độ trung thực render (Score 9)

Đây là **rủi ro số 1**. Render `.docx`/`.xlsx`/PDF trên browser khó đạt độ trung thực như app desktop (font, layout phức tạp, công thức Excel, hình ảnh nhúng).

- **Hệ quả:** Tài liệu hiển thị sai/vỡ ⇒ mất niềm tin người dùng vào giá trị cốt lõi "viewer".
- **Hành động:** Định nghĩa rõ **"độ trung thực chấp nhận được"** trong MVP (không cần pixel-perfect); xây bộ **tài liệu mẫu test** đa dạng ngay từ đầu để đo KR1.2.

### 🟠 R-02 — Độ chính xác trích xuất (Score 6)

Trích xuất sai ⇒ search trả kết quả sai, và nếu feed cho AI sẽ "rác vào rác ra".

- **Hành động:** MVP chỉ cam kết **text/data cơ bản**; đo bằng KR2.2 (≥95%) trên bộ mẫu; hoãn OCR/structured extraction.

### 🟠 R-03 — Bảo mật & privacy tài liệu (Score 6)

Khi lên multi-user (M3), tài liệu người dùng upload thường **nhạy cảm**.

- **Hành động:** Ngay từ MVP, **tách lớp dữ liệu người dùng** trong kiến trúc (KR3.1/KR3.3); lập **threat model** riêng trước khi mở multi-tenant ở M3.

### 🟠 R-04 — Scope creep (Score 6)

Rủi ro tự nhiên của personal project không deadline: dễ "tiện tay" thêm định dạng/tính năng.

- **Hành động:** MVP-Scope là **hợp đồng**; mọi ý tưởng mới ghi vào Roadmap Full Scope, không nhét vào M1.

---

## Tài liệu tham khảo

- [Project Charter — DocsViewer](./Charter-DocsViewer.md)
- [MVP Scope — DocsViewer](./MVP-Scope.md)
- [Product Roadmap](./Roadmap.md)
- [OKRs](./OKRs.md)
