---
id: BRD-002
type: brd
status: draft
created: 2026-02-05
---

# BRD: Hệ thống xác thực OTP qua Email

## 1. Mục tiêu kinh doanh (Business Goals)
Cung cấp phương thức xác thực bảo mật và tiện lợi cho người dùng thông qua Email, giảm bớt sự phụ thuộc vào mật khẩu truyền thống và tăng tính bảo mật cho tài khoản.

## 2. Phạm vi yêu cầu (Scope)
- Gửi mã OTP 6 số tới Email người dùng.
- Xác thực mã OTP trong thời gian hiệu lực (5 phút).
- Giới hạn số lần gửi OTP (Rate Limit) để tránh spam.

## 3. Quy trình nghiệp vụ (Business Process)
1. Người dùng yêu cầu đăng nhập bằng Email.
2. Hệ thống tạo OTP và gửi qua Email.
3. Người dùng nhập mã OTP vào ứng dụng.
4. Hệ thống đối soát mã và cho phép truy cập nếu khớp.

---
## Tài liệu tham khảo
- [PRD-TNMCORE-OS](./PRD-TNMCORE-OS.md)
