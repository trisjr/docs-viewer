# tnm-os CLI Guide

CLI tool cho TNMCore-OS — Quản lý project, logwork, và đồng bộ báo cáo.

## Cài đặt

```bash
./install.sh
source ~/.zshrc   # hoặc ~/.bash_profile / ~/.bashrc tùy shell
```

Script tự động:
- Set executable permissions cho CLI và toàn bộ command scripts
- Thêm `tnm-os` vào PATH và tạo alias trong shell profile
- Cài đặt tab completion (Zsh/Bash)
- Tạo/cập nhật `.env` với `TNMCORE_HUB_DIR`

## Biến môi trường bắt buộc

File `.env` ở root project cần có:

| Variable | Mô tả                                            |
|---|--------------------------------------------------|
| `TNMCORE_HUB_DIR` | Đường dẫn đến Hub directory (tự set bởi install) |
| `MEMBER_SHORT_NAME` | Tên viết tắt member (VD: `TrisJr`)               |

## Commands

### `tnm-os init`

Khởi tạo project mới.

```bash
tnm-os init --name=my-project --type=worker
tnm-os init --name=hpma-worker --type=worker --path=./projects
```

| Option | Required | Default | Mô tả |
|---|---|---|---|
| `--name` | Yes | — | Tên project |
| `--type` | No | `worker` | Loại: `worker`, `client`, `service` |
| `--path` | No | `.` | Thư mục đích |

Cấu trúc tạo ra theo type:

- **worker**: `src/`, `docs/`, `tests/`
- **client**: `src/`, `public/`, `docs/`
- **service**: `src/`, `api/`, `docs/`

Mỗi project đều có `README.md`, `.env.example`, `.gitignore`.

> **Lưu ý:** Nếu thư mục đích đã tồn tại, CLI sẽ báo lỗi và dừng lại. Sau khi tạo xong, CLI hiển thị gợi ý các bước tiếp theo (cd vào thư mục, copy `.env.example`).

---

### `tnm-os init-log`

Khởi tạo file logwork tuần cho tất cả active projects.

```bash
tnm-os init-log
```

Chạy Node.js script `init-weekly-logworks.js` với `MEMBER_SHORT_NAME` từ `.env`.

---

### `tnm-os log`

Ghi log công việc vào local SSOT. Hỗ trợ nhiều PR URLs.

```bash
# Log cơ bản
tnm-os log --title="Fixed bug in auth"

# Với task ID và PR
tnm-os log --task-id=abc123 --title="Feature done" --project=HPMA \
  --pr="https://github.com/org/repo/pull/42"

# PR với tiêu đề tự định nghĩa
tnm-os log --title="Update UI" \
  --pr="https://github.com/org/repo/pull/50|Add dark mode toggle"

# Nhiều PR
tnm-os log --task-id=abc456 --title="Refactor API" --project=HPMA \
  --pr="https://.../101|Extract utils" \
  --pr="https://.../102|Update tests"
```

| Option | Required | Default | Mô tả |
|---|---|---|---|
| `--title` (hoặc `--summary`) | Yes | — | Tiêu đề công việc |
| `--task-id` | No | — | ClickUp Task ID (tự tạo URL) |
| `--project` | No | `PROJECT_SHORT_NAME` hoặc `HPMA` | Tên project |
| `--pr` | No | — | PR URL hoặc `URL|Title`. Dùng nhiều lần |
| `--status` | No | `Done` | `Done`, `In Progress`, `Pending`, `Blocked` |

---

### `tnm-os sync`

Đồng bộ task log của tuần lên ClickUp.

```bash
tnm-os sync                    # Tuần hiện tại
tnm-os sync --week=W20         # Tuần 20
tnm-os sync --week=2026-W20    # Tuần 20 năm 2026
```

| Option | Required | Default | Mô tả |
|---|---|---|---|
| `--week` | No | Tuần hiện tại | Format: `W20` hoặc `2026-W20` |

---

### `tnm-os help`

Hiển thị trợ giúp tổng quan.

```bash
tnm-os help
tnm-os --help
tnm-os -h
```

Xem help cho lệnh cụ thể:

```bash
tnm-os init --help
tnm-os log --help
tnm-os sync --help
```

## Tab Completion

Đã tự động cài bởi `install.sh`. Nhấn TAB 2 lần để xem suggestions.

- **Zsh**: `~/.zsh/completions/_tnm-os`
- **Bash**: `/etc/bash_completion.d/tnm-os` (fallback: sourced trong `~/.bashrc` nếu không có quyền ghi vào `/etc/bash_completion.d/`)

## Workflow thường

```bash
# 1. Khởi tạo logwork đầu tuần
tnm-os init-log

# 2. Ghi log trong ngày
tnm-os log --title="Hoàn thành feature X" --project=HPMA

# 3. Đồng bộ lên ClickUp cuối tuần
tnm-os sync
```
