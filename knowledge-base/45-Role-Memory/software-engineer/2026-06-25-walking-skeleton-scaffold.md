---
id: MEM-SWE-001
type: memory
status: active
role: software-engineer
created: 2026-06-25
updated: 2026-06-25
---

# 🧑‍💻 Role Memory: Walking-Skeleton Scaffold (Client-Side SPA)

## 📌 1. Tóm tắt (Summary)

Đúc kết từ task **Phase 4 — Scaffold DocsViewer** (`/opsx-apply scaffold-project`): dựng **walking skeleton** 4 lớp + Shared Kernel cho một client-side SPA (TS 5 / React 19 / Vite 6 / Tailwind v4 / Vitest 4), enforce Dependency Rule một chiều + 2 extension point, đưa `dev`/`build`/`test` xanh ngay từ commit đầu. Memory này lưu các pattern + bẫy thực tế để lần scaffold sau nhanh và không tái phạm.

## 🧩 2. Mẫu hình & Giải pháp (Patterns & Solutions)

### A. Core Pattern — Walking Skeleton (composition tách khỏi DOM-mount)
- **Bối cảnh áp dụng:** scaffold codebase để enforce kiến trúc *trước* khi viết feature logic.
- **Cách thực hiện:**
  - Tách phần wiring (register adapters + inject services) ra `composition.ts` **thuần & testable**; `main.tsx` chỉ làm side-effect mount DOM → smoke test tái dùng `createComposition()` thay vì import `main.tsx` (vốn gọi `createRoot` lên `#root` không tồn tại trong jsdom).
  - Composition root chỉ **register / inject / mount**, **KHÔNG** gọi path có thể throw (`render`/`extract` đang stub) lúc khởi động → shell mount không crash.
  - Stub theo kiểu **interface-conformant** + `throw new NotImplementedError(...)` (greppable để feature phase "fill"); riêng `canHandle` của adapter thì impl thật (rẻ, có giá trị test ngay).

### B. Solution Recipes (Công thức thành công)
- **Injected dep mà `noUnusedLocals` không báo lỗi:** TS `noUnusedLocals` soi cả `private` field chưa đọc (TS6138). Stub service nhận dep qua DI nhưng chưa dùng → dùng `protected readonly` cho parameter property (giữ DI, hợp lý cho base class) thay vì hack `void this.x`. Kèm `noUnusedParameters: false` để stub giữ tên param đúng theo contract.
- **Pin version đúng ADR mà không đoán patch:** `npm install --save-exact <pkg>@<major>` (vd `react@19`, `vite@6`, `tailwindcss@4`) → npm chọn latest trong major + ghi exact vào `package.json`.
- **Build không cần `tsc -b`/`composite`:** dùng **một** `tsconfig.json` + script `"build": "tsc --noEmit && vite build"` → né rủi ro project-references yêu cầu `composite: true`.
- **Path alias đa lớp:** khai báo ở **cả** `tsconfig.json` (`paths`) **và** `vite.config.ts` (`resolve.alias`) — Vitest đọc lại vite config nên test cũng resolve được; alias bare `domain/ui/app/core/data`.
- **Enforce Dependency Rule rẻ (YAGNI):** viết test static-scan import của `src/core` (cấm import `ui|app|data`) và `src/domain` (innermost, cấm import lớp nào) bằng `node:fs` + regex, thay vì cài ESLint boundaries.

## ⚠️ 3. Bẫy sai lầm & Cách tránh (Pitfalls & Prevention)
- **`import.meta.url` chết trong Vitest/jsdom:** `fileURLToPath(new URL('...', import.meta.url))` ném `TypeError: The URL must be of scheme file` khi `environment: 'jsdom'`. → Trong test, định vị path bằng `process.cwd()` (vitest chạy từ project root).
- **`.gitignore` rule thư mục KHÔNG neo root nuốt subdir cùng tên:** rule `data/` (và `src/`) ignore luôn `src/data/`, `test/data/` ở mọi cấp → cả **Data layer** + test suýt biến mất khỏi git dù `build`/`test` vẫn xanh (gitignore không ảnh hưởng filesystem). → **LUÔN** soi `git status --short` + `git check-ignore -v <path>` trước khi commit scaffold; neo rule về `/data/` nếu chỉ muốn cấp root.
- **Đừng tin doc về symlink:** CLAUDE.md ghi `.gitignore` là symlink nhưng `ls -la` cho thấy file thường. → Verify bằng `ls -la`/`git check-ignore`, không khẳng định khi chưa kiểm tra.
- **OpenSpec scenario phải đúng 4 dấu `#`:** `#### Scenario:` mới được parse; sai cấp heading → silent fail. `openspec validate --strict` bắt được (mỗi requirement cần ≥1 scenario) → luôn chạy strict sau khi soạn spec.

## 🎯 4. Ưu tiên của người dùng (User Preferences)
- **Phong cách quy trình:** `/opsx-*` tạo **SPEC artifact**, KHÔNG phải code — code chỉ sinh ở `/opsx-apply`. Mỗi state change (apply / archive / commit) cần **Plan & Approve mới**, không auto-run dù User đã gõ slash command trước đó.
- **Commit message:** 1 dòng `<type>(<scope>): <short summary>`, **KHÔNG** Co-authored; summary tiếng Anh theo convention repo.
- **Kiến trúc:** ưu tiên **walking skeleton chạy được** hơn thin scaffold; source tree bám **SDD §4 verbatim**, deviation (thêm file phụ trợ) phải khai báo rõ trong `design.md`.
- **Tiêu chuẩn code:** content/comment **tiếng Việt** giữ IT term English; mọi file code có header `// AI Coding`; không inline comment; ưu tiên KISS/YAGNI.

## 🔗 5. Tài liệu liên quan (Related Artifacts)
- [Archived change — scaffold-project](../../../openspec/changes/archive/2026-06-25-scaffold-project/proposal.md)
- [Baseline spec — platform-foundation](../../../openspec/specs/platform-foundation/spec.md)
- [SDD §4 — Source Tree](../../../docs/030-Specs/Architecture/SDD-DocsViewer.md)
- [Composition root](../../../src/composition.ts) · [main.tsx](../../../src/main.tsx)
- Commit: `6c071ed feat(scaffold): walking skeleton 4-layer + shared kernel + extension points`

---
*Generated by TNMCORE-OS Role Memory System.*
