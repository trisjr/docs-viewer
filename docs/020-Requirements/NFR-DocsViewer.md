---
id: NFR-DOCSVIEWER
type: nfr
status: approved
created: 2026-06-24
updated: 2026-06-24
---

# 🛡️ NFR — DocsViewer

## Mục lục

1. [Mục đích & Cách đo](#1-mục-đích--cách-đo)
2. [Bảng NFR](#2-bảng-nfr)
3. [Chi tiết NFR trọng yếu](#3-chi-tiết-nfr-trọng-yếu)
4. [Tham số đo lường & ngưỡng](#4-tham-số-đo-lường--ngưỡng)
5. [Tài liệu tham khảo](#5-tài-liệu-tham-khảo)

---

## 1. Mục đích & Cách đo

Tài liệu này định nghĩa các **Non-Functional Requirements (NFR)** — yêu cầu về *chất lượng* (chứ không phải *chức năng*) của DocsViewer ở milestone **M1 (MVP)**. Sơ đồ ID **đồng bộ 1:1 với PRD §5** (PRD là canonical).

Nguyên tắc bắt buộc:

- **Đo được (Measurable):** Mỗi NFR phải có một chỉ số định lượng hoặc tiêu chí pass/fail rõ ràng — không dùng từ mơ hồ kiểu "nhanh", "ổn định". Các con số/ngưỡng tập trung tại [§4](#4-tham-số-đo-lường--ngưỡng) để Story/Test tham chiếu (không restate).
- **Truy vết được (Traceable):** Mỗi NFR phải gắn ngược về một **Key Result (KR)** trong [OKRs](../010-Planning/OKRs.md) và/hoặc một **Risk (R)** trong [Risk Register](../010-Planning/Risk-Register.md).
- **Đúng phạm vi (Scoped):** Chỉ cam kết những gì MVP cần. Yêu cầu chất lượng cho M2/M3/M4 chỉ ghi "Out of scope (defer Mx)".

> [!NOTE]
> Cách đo chung: dùng **bộ tài liệu mẫu** (§3) làm baseline cho cả render fidelity lẫn extraction accuracy. Đo theo milestone, không theo lịch cứng.

---

## 2. Bảng NFR

| ID     | Nhóm                          | Yêu cầu đo được                                                                                          | Trace KR/Risk        |
| :----- | :---------------------------- | :------------------------------------------------------------------------------------------------------ | :------------------- |
| NFR-01 | Performance                   | Thời gian mở & hiển thị **trang đầu** của tài liệu *kích thước trung bình* (baseline §4) **≤ 3 giây**.    | KR1.3                |
| NFR-02 | Render Fidelity               | **≥ 90%** tài liệu mẫu render đạt "độ trung thực chấp nhận được" (không mất nội dung / không vỡ layout nặng) trên cả 3 định dạng. | KR1.2 · **R-01 (9)** |
| NFR-03 | Extraction Accuracy           | Độ chính xác trích xuất text trên bộ tài liệu mẫu (so khớp nội dung gốc) **≥ 95%**.                       | KR2.2 · R-02 (6)     |
| NFR-04 | Search Precision              | **≥ 90%** truy vấn search trả về **đúng** đoạn/tài liệu chứa keyword trong nội dung đã trích xuất.        | KR2.3                |
| NFR-05 | Security & Privacy            | Kiến trúc **tách lớp dữ liệu người dùng** ngay từ MVP (parse/extract không phụ thuộc danh tính người dùng). Threat model & lưu trữ multi-tenant: Out of scope (defer M3). | R-03 (6) · KR3.1 · KR3.3 |
| NFR-06 | Extensibility / Scalability   | Kiến trúc **layered**: thêm 1 định dạng mới **không cần** sửa core viewer; có **extension point** rõ ràng để gắn auth/multi-tenant về sau. | KR3.1 · KR3.2 · KR3.3 |
| NFR-07 | Resource / Browser Limits     | Tôn trọng giới hạn bộ nhớ trình duyệt; áp ngưỡng kích thước file `MAX_FILE_SIZE` (§4); cân nhắc lazy render/phân trang cho file lớn. | R-05 (4)             |
| NFR-08 | Compatibility                 | Chạy đúng trên **trình duyệt hiện đại** bản mới: Chrome, Edge, Firefox, Safari (giả định Charter §7.1).   | Charter §7.1         |
| NFR-09 | Maintainability               | Tuân **KISS/YAGNI**; ưu tiên OSS lib phổ biến, cộng đồng lớn, license tương thích; cấu trúc module rõ ràng. | R-06 (2) · R-07 (4)  |

---

## 3. Chi tiết NFR trọng yếu

> Ba NFR dưới đây gắn với 3 rủi ro **trọng yếu** (Score ≥ 6) của dự án — cần định nghĩa chặt để có thể nghiệm thu.

### 🔴 NFR-02 — Render Fidelity (Độ trung thực render)

**Trace:** KR1.2 (≥ 90%) · **R-01 (Score 9 — rủi ro số 1).**

Render `.docx`/`.xlsx`/PDF trên browser khó đạt độ trung thực như app desktop (font, layout phức tạp, công thức Excel, hình ảnh nhúng). Hệ quả nếu thất bại: tài liệu hiển thị sai/vỡ ⇒ mất niềm tin vào giá trị cốt lõi "viewer". Vì là rủi ro cao nhất, NFR-02 **không** đặt mục tiêu pixel-perfect mà đặt mục tiêu *chấp nhận được*.

#### Định nghĩa "Acceptable Fidelity" (Độ trung thực chấp nhận được)

Một tài liệu được tính là render **đạt** khi thỏa **tất cả** tiêu chí sau:

- **Không mất nội dung:** Toàn bộ text, ô dữ liệu (Excel) và bảng hiển thị đầy đủ — không bị cắt, mất trang, mất sheet.
- **Không vỡ layout nặng:** Thứ tự đọc, heading, đoạn văn và cấu trúc bảng được giữ; cho phép sai khác nhỏ về font/khoảng cách/màu.
- **Hình ảnh nhúng cơ bản hiển thị được** (không yêu cầu chính xác tuyệt đối về vị trí/độ phân giải).
- **Excel:** giá trị ô đúng; công thức hiển thị **kết quả** (không yêu cầu re-compute đầy đủ engine công thức trong MVP).

Ngược lại, các lỗi tính là **nghiêm trọng (fail):** mất nội dung, mất trang/sheet, sai thứ tự đọc, bảng vỡ cấu trúc, trang trắng.

> [!IMPORTANT]
> Mọi AC liên quan tới độ trung thực render **PHẢI tham chiếu định nghĩa Acceptable Fidelity này** (không tự diễn đạt lại bằng từ định tính như "mức nhận biết được").

#### Bộ tài liệu mẫu (Sample Document Set)

Đây là baseline đo KR1.2. Bộ mẫu phải đa dạng để bộc lộ điểm yếu render sớm:

| Định dạng | Mẫu cần có                                                                 |
| :-------- | :------------------------------------------------------------------------ |
| PDF       | text thuần · nhiều cột · có hình ảnh · bảng · file nhiều trang             |
| `.docx`   | text + heading · bảng · hình nhúng · danh sách lồng nhau                   |
| `.xlsx`   | nhiều sheet · ô có công thức · bảng lớn · định dạng số/ngày                |

> Bộ mẫu được xây **ngay từ đầu M1** và dùng lại cho cả NFR-03. Mọi thay đổi lib render phải re-test trên toàn bộ bộ mẫu trước khi merge.

### 🟠 NFR-03 — Extraction Accuracy (Độ chính xác trích xuất)

**Trace:** KR2.2 (≥ 95%) · R-02 (Score 6).

Trích xuất sai ⇒ search trả kết quả sai, và nếu feed cho AI sẽ "rác vào rác ra". MVP **chỉ cam kết text/data cơ bản**:

- **`.docx` / PDF:** bóc tách **text** — đo độ chính xác bằng so khớp nội dung gốc trên bộ tài liệu mẫu, mục tiêu **≥ 95%**.
- **`.xlsx`:** bóc tách **data dạng bảng** (giá trị ô theo hàng/cột).
- Structured extraction (metadata, layout phức tạp) và **OCR cho PDF scan**: Out of scope (defer M2).

> Cùng dùng **bộ tài liệu mẫu** của NFR-02 làm tập đo, đảm bảo render fidelity và extraction accuracy được đánh giá trên cùng một baseline.

### 🟠 NFR-05 — Security & Privacy (Bảo mật & quyền riêng tư)

**Trace:** R-03 (Score 6) · KR3.1 · KR3.3.

Tài liệu người dùng upload thường **nhạy cảm**. Rủi ro thực sự phát sinh khi lên multi-user (M3), nhưng cách *phòng ngừa* phải được gài vào kiến trúc **từ MVP** để không phải viết lại core:

- **Tách lớp dữ liệu người dùng (data layer separation):** logic parse/extract và core viewer **không** phụ thuộc vào danh tính người dùng; mọi trạng thái gắn người dùng nằm ở một lớp tách biệt, có thể bổ sung sau.
- **Extension point cho auth/multi-tenant:** chừa điểm móc rõ ràng để gắn authentication & phân tách dữ liệu theo tenant ở M3 (KR3.3).
- **Threat model & lưu trữ multi-tenant đầy đủ:** Out of scope (defer M3) — sẽ lập threat model riêng trước khi mở multi-tenant.

---

## 4. Tham số đo lường & ngưỡng

> [!IMPORTANT]
> Các Story/Test **tham chiếu** các tham số dưới đây (không lặp lại con số trong AC) để khi giá trị thay đổi chỉ phải sửa một nơi.

### 4.1. `MAX_FILE_SIZE` — ngưỡng kích thước file (đề xuất — Architect chốt ở Phase-2)

Ngưỡng dung lượng file tối đa được chấp nhận khi upload (FR-01, NFR-07). Giá trị **đề xuất** cho MVP (cân bằng giữa nhu cầu thực tế và giới hạn bộ nhớ trình duyệt — R-05):

| Định dạng | `MAX_FILE_SIZE` (đề xuất) |
| :-------- | :------------------------ |
| PDF       | ≤ **25 MB**               |
| `.docx`   | ≤ **25 MB**               |
| `.xlsx`   | ≤ **15 MB**               |

> ⚠️ **Đây là giá trị đề xuất, chưa chốt.** Quyết định cuối thuộc về Architect (Phase-2) sau khi đo thực tế hiệu năng parse/render client-side. File vượt ngưỡng → từ chối với thông báo nêu rõ giới hạn.

### 4.2. Baseline "tài liệu kích thước trung bình" (fixture đo KR1.3 / NFR-01)

Tập fixture để đo thời gian mở trang đầu ≤ 3 giây. Đây là baseline do **BA sở hữu** (định nghĩa rõ để test viết được), có thể tinh chỉnh theo dữ liệu thực:

| Định dạng | Baseline "trung bình" |
| :-------- | :-------------------- |
| PDF       | ~20 trang · ~5 MB     |
| `.docx`   | ~30 trang · ~2 MB     |
| `.xlsx`   | ~3 sheet · ~5.000 ô   |

> Đo NFR-01 trên đúng các fixture này; file lớn hơn baseline có thể vượt 3 giây mà vẫn không vi phạm NFR-01 (sẽ được quản lý bằng lazy render — NFR-07).

---

## 5. Tài liệu tham khảo

- [PRD — DocsViewer](./PRD-DocsViewer.md)
- [SRS — DocsViewer](./SRS-DocsViewer.md)
- [OKRs](../010-Planning/OKRs.md)
- [Risk Register](../010-Planning/Risk-Register.md)
- [Traceability Matrix](./Traceability-Matrix.md)

---
*Generated by TNMCORE-OS BA Role.*
