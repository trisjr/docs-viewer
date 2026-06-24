---
id: Story-Verify-OTP
type: story
status: draft
linked-to: "../../020-Requirements/BRD/BRD-002-OTP-Login.md"
created: 2026-02-05
---

# User Story: Xác thực mã OTP để vào hệ thống

**As a** Người dùng đã nhận mã OTP,
**I want to** nhập mã OTP vào ứng dụng,
**So that** tôi có thể hoàn tất quá trình đăng nhập và truy cập vào hệ thống.

## Acceptance Criteria
1. Hệ thống có 6 ô nhập liệu hoặc 1 trường nhập 6 ký tự số.
2. Hệ thống kiểm tra tính chính xác của mã OTP.
3. Nếu mã đúng và còn hiệu lực, người dùng được chuyển hướng vào Dashboard.
4. Nếu mã sai, hiển thị thông báo lỗi "Mã OTP không chính xác".
5. Nếu mã hết hạn, hiển thị thông báo "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới".
