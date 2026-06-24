---
id: PLAN-PROJECTS-001
type: registry
status: live
created: 2026-03-09
updated: 2026-03-09
---

# 📋 Projects Registry

Đây là Single Source of Truth (SSOT) lưu trữ thông tin tất cả các dự án mà bạn tham gia. Khi chạy Daily Report Workflow, Agent sẽ **BẮT BUỘC** đọc file này để lấy danh sách dự án và mapping ClickUp List/Folder ID.

## Mục lục

1. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
2. [Danh sách dự án](#danh-sách-dự-án)

---

## Hướng dẫn sử dụng

| Trường                  | Mô tả                                                                                                                                 |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Tên Dự Án**           | Tên project rõ ràng                                                                                                                   |
| **Short Name**          | Tên viết tắt ngắn gọn dùng làm tiền tố (prefix) cho các task tracking và báo cáo                                                      |
| **Project ID**          | ID dùng để tra cứu kỹ thuật. <br>- ClickUp: `List/Folder ID`<br>- GitHub: `owner/repo` (có thể là danh sách)<br>- Jira: `Project Key` |
| **Trạng thái (Status)** | `Active` \| `On Hold` \| `Completed`                                                                                                  |
| **Hệ thống Quản lý**    | ClickUp, GitHub Issue, Jira, v.v.                                                                                                     |
| **Link**                | Link tới nơi quản lý chính của project                                                                                                |

> **Lưu ý cho Agent:** Khi chạy workflow (như Daily Report), chỉ lọc dự án có Status = `Active`. Dùng `Project ID` để gọi Tool tương ứng (ClickUp hoặc GitHub MCP).

---

## Danh sách dự án

### TNMCORE-OS

- **Short Name:** `CoreOS`
- **Project ID:** _(thêm ID - ví dụ ClickUp Folder ID)_
- **Hệ thống Quản lý:** _(thêm tên hệ thống - ví dụ ClickUp)_
- **Trạng thái:** `On Hold`
- **Link:** _(thêm link)_
- **Mô tả:** Hệ điều hành AI-Native cho team.

### TNM - Treubär

- **Short Name:** `Treubar`
- **Project ID:** 901810462307
- **Hệ thống Quản lý:** ClickUp
- **Trạng thái:** `Active`
- **Link:** https://app.clickup.com/9018436962/v/o/s/90188540315
- **Mô tả:** Hệ thống Loyalty Treubär là giải pháp quản trị lòng trung thành giúp doanh nghiệp tích điểm, phân hạng hội viên và tự động hóa quy trình tặng voucher cho khách hàng.

### PMSVB - HTQT DL Dự Án

- **Short Name:** `PMSVB`
- **Project ID:** 90189082762
- **Hệ thống Quản lý:** ClickUp
- **Trạng thái:** `On Hold`
- **Link:** https://app.clickup.com/9018436962/v/s/90187417782
- **Mô tả:** Hệ thống quản lý dự án PMSVB là giải pháp quản trị dự án giúp doanh nghiệp quản lý dự án, phân công công việc và theo dõi tiến độ dự án.

### HPMA - Hoang Anh Performance Marketing Agency

- **Short Name:** `HPMA`
- **Project ID:**
  - `tenomad-company/hpma-os`
  - `tenomad-company/Ads-Management-Backend`
  - `tenomad-company/Ads-Management-User`
  - `tenomad-company/Ads-Management-Admin`
- **Hệ thống Quản lý:** GitHub Issue
- **Trạng thái:** `Active`
- **Link:** https://github.com/tenomad-company/hpma-os
- **Mô tả:** Nền tảng quản lý cho thuê tài khoản quảng cáo Facebook (Ads Account). Hệ thống cho phép các **Công ty khách hàng (Company)** thuê tài khoản quảng cáo từ Agency, nạp tiền vào ví nội bộ, và quản lý chi tiêu quảng cáo qua **Business Manager (BM)** của Facebook.

### DocsViewer

- **Short Name:** `DocsViewer`
- **Project ID:** _(chưa gắn — personal project, chưa có ClickUp/GitHub)_
- **Hệ thống Quản lý:** _(chưa có)_
- **Trạng thái:** `Active`
- **Link:** _(local: `/Users/trisjr/Projects/Personal/docs-viewer`)_
- **Mô tả:** Web app **xem (View)** và **trích xuất (Extract)** nội dung tài liệu `.docx`, `.xlsx`, PDF. Hướng tới sản phẩm multi-user cho team/khách; phát triển bởi trisjr + AI (Claude).

---

## Tài liệu tham khảo

- [Template Daily Report](../999-Resources/Templates/Template-Daily-Report.md)
- [Project Documentation Index](../000-Index.md)
