---
id: Story-Request-OTP
type: story
status: draft
linked-to: "../../020-Requirements/BRD/BRD-002-OTP-Login.md"
created: 2026-02-05
---

# User Story: Yêu cầu mã OTP qua Email

**As a** Người dùng chưa đăng nhập,
**I want to** nhập email để nhận mã OTP xác thực,
**So that** tôi có thể xác minh danh tính và tiến hành đăng nhập.

## Acceptance Criteria
1. Hệ thống có trường nhập Email hợp lệ.
2. Hệ thống kiểm tra Email có trong Database (hoặc cho phép đăng ký mới tùy logic).
3. Hệ thống gửi mã OTP 6 chữ số tới Email trong vòng 30 giây.
4. Thông báo cho người dùng "Mã OTP đã được gửi".
5. Giới hạn gửi lại mã (Resend) sau 60 giây.
