# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bản chất Repo (đọc trước tiên)

Đây là một **workspace của TNMCORE-OS** — một "Hệ điều hành" AI-Native, Spec-Driven cho team phát triển phần mềm. Đây **không phải** một code project thông thường:

- **Không có** `package.json`, build system, linter hay test runner. `src/` và `test/` là thư mục rỗng (placeholder).
- Phần lớn nội dung là **documentation** (Markdown, tổ chức theo Dewey Decimal) và **định nghĩa hành vi Agent** (`.agent/`, `.claude/`).
- `README.md`, `AGENTS.md`, `.gitignore` là **symlinks** trỏ về Hub gốc `/Users/trisjr/Projects/Tenomad/TNMCore-OS`. Khi cần ngữ cảnh đầy đủ về OS, đọc các file này (chúng mô tả Hub, không phải riêng workspace).
- `.agent/`, `.claude/`, `docs/`, `knowledge-base/`, `openspec/` là thư mục local thật của workspace.

`AGENTS.md` là **Primary Context** nạp đầu tiên cho mọi Agent; đọc nó để hiểu Identity, Core Principles và Universal Workflow 6 bước.

## Khởi động bắt buộc

**LUÔN bắt đầu phiên bằng `/wake-up`** trước khi làm bất kỳ task nào. Lệnh này nạp `AGENTS.md`, README, "Hiến pháp" từ `knowledge-base/` (Coding-Standards, Project-Governance, After-Action-Review, SDLC-Agile-Workflow), Master Index của `docs/`, rồi trình menu kích hoạt Role. Không tự động nạp Skill — chờ User chọn Role.

> Lưu ý drift trong `.claude/commands/wake-up.md` (sẽ lỗi nếu chạy nguyên trạng — verify path trước khi dựa vào): nó `view_file "docs/000-Index.md"` nhưng file đó **không tồn tại** trong workspace; menu cũng nhắc `resources/` và các role `head-of-unit`/`pod-lead`/`pod-member` **không có file** trong `.agent/roles/`. Chỉ 12 role có file thật (xem `.agent/roles/`). Đừng giả định các path đó tồn tại.

## Slash Commands & CLI

Claude Code đọc slash commands từ `.claude/commands/`:

- **`/wake-up`** — khởi động hệ thống (xem trên).
- **`/opsx-*`** — quy trình Spec-Driven qua OpenSpec: `new`, `explore`, `continue`, `apply`, `verify`, `sync`, `archive`, `bulk-archive`, `ff` (full-flow), `handoff`. Các lệnh này bao bọc OpenSpec CLI.
- **`/memo`** — Learning Loop: đúc kết bài học sau task, lưu vào `knowledge-base/45-Role-Memory/{role}/`.

OpenSpec CLI (cần cho luồng coding) cài global:
```bash
npm install -g @fission-ai/openspec@latest
openspec new change "<name>"      # tạo scaffold tại openspec/changes/<name>/
openspec status --change "<name>"
```

`tnm-os` CLI (binary nằm ở Hub gốc; dùng để scaffold project + logwork → ClickUp; chi tiết tại `docs/cli-guide.md`). Yêu cầu Node.js ≥ 22 và `.env` có `TNMCORE_HUB_DIR`, `MEMBER_SHORT_NAME`:
```bash
tnm-os init --name=<p> --type=worker|client|service   # tạo project mới
tnm-os init-log                                        # tạo logwork tuần cho active projects
tnm-os log --title="..." --task-id=... --pr="URL|Title"
tnm-os sync [--week=2026-W20]                          # đẩy log lên ClickUp
```

## Kiến trúc

### `.agent/` ↔ `.claude/` là hai bản chiếu của cùng một hệ Agent

Claude Code chỉ đọc **`.claude/`** (commands/agents/skills/rules) — sửa hành vi cho Claude Code thì sửa ở đây. `.agent/` là bản nguồn IDE-agnostic; nếu thay đổi mang tính cross-tool thì cập nhật cả hai cho khớp:

| `.agent/` (nguồn canonical, IDE-agnostic) | `.claude/` (bản chiếu cho Claude Code) |
| :---------------------------------------- | :------------------------------------- |
| `roles/*.md` (Persona + Mindset)          | `agents/*.md` (subagent definitions)   |
| `workflows/*.md`                          | `commands/*.md` (slash commands)       |
| `rules/*.md`                              | `rules/*.md`                           |
| `skills/`                                 | `skills/`                              |

### Mô hình 3 lớp: Role → Skill → Workflow

"**Identity First**": xác định Role (mindset, `.agent/roles/*.md`) **trước**, rồi mới kích hoạt Skill (tools, `.agent/skills/`), thực thi qua Workflow (slash command). Kích hoạt Role bằng: *"Hãy đóng vai trò [Tên Role]"* hoặc *"Dùng vai trò [ROLE] để [hành động] dựa trên [input]"*.

### SSOT & phân loại Dewey

Tri thức tách hai nơi, **tuyệt đối không trùng lặp**:

- **`docs/`** = tài liệu **đặc thù dự án**, mã Dewey **3 chữ số**: `010-Planning`, `020-Requirements`, `022-User-Stories`, `030-Specs`, `035-QA`, `040-Design`, `050-Research`, `060-Manuals`, `070-Deployment`, `080-Operations`, `090-Archive`, `999-Resources`. Mỗi thư mục có file `*-MOC.md` (Map of Content) làm index — cập nhật MOC khi thêm file.
- **`knowledge-base/`** = tri thức **nền tảng** dùng chung, mã Dewey **2 chữ số**: `01-Metas` (Glossary), `10-Technical` (Coding-Standards), `20-Project` (Governance, SDLC), `30-Domain`, `40-Memory` (After-Action-Review), `45-Role-Memory` (bộ nhớ riêng từng role), `99-Templates`.

### Spec-Driven Development (OpenSpec)

Không code khi chưa có Spec được duyệt. Mỗi change sống tại `openspec/changes/<name>/` theo artifact-driven workflow; dùng các lệnh `/opsx-*` để đi qua chu kỳ Spec-First → Code-Later.

### Learning Loop

Sau khi hoàn thành implementation quan trọng / fix bug khó / nhận preference đặc thù từ User: chủ động đề xuất `/memo`, lưu file mới (kèm timestamp, dùng template `knowledge-base/99-Templates/Template-Role-Memory.md`) vào `45-Role-Memory/{role}/`. Trước khi bắt đầu task của một role, đọc memory cũ của role đó.

## Quy ước cần biết

Rule đầy đủ nằm tại `.claude/rules/` & `.agent/rules/` (đọc khi cần — không chắc chúng tự auto-load vào context). Những điểm dễ bỏ sót, tóm tắt tại đây làm "safety net":

- **Ngôn ngữ**: nội dung Markdown viết **Tiếng Việt**, giữ nguyên thuật ngữ IT bằng **English**. File kiến thức (không phải workflow/rule) cần có Table of Contents ở đầu và References ở cuối.
- **Header file code**: file tạo mới / sửa đáng kể phải có dòng đầu `// AI Coding` (JS/TS) hoặc `# AI Coding` (Python/Shell), kèm block comment mô tả.
- **Scripts**: mọi automation script đặt trong `/scripts` tại root, không rải ở thư mục khác.
- **Plan & Approve**: trình Step-by-Step Plan và giải thích "tại sao" trước mọi thay đổi file system; chỉ tự ý thực hiện hành động read-only (list/read/grep) để lấy ngữ cảnh.
- **Anti-Hallucination**: verify bằng tool (đọc file, grep) trước khi khẳng định; không đoán nội dung/đường dẫn.
