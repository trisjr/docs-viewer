---
id: GUIDE-CURSOR-CLI-WORKFLOW-MAPPING
type: user-guide
status: draft
created: 2026-05-02
updated: 2026-05-02
linked-to:
  - AGENTS.md
  - OS-Cheatsheet.md
  - OS-Handbook.md
---

# Mapping Workflow Antigravity/Gemini sang Cursor CLI

Mục tiêu tài liệu này là chuẩn hoa quy trình quen thuộc (slash commands/workflows) để dùng được ngay trong Cursor CLI, giữ nguyên triet ly `Discovery -> Design -> Plan -> Implement -> Verify -> Retro`.

## 1) Nguyen tac mapping

- Khong map 1:1 theo ten lenh; map theo **intent** (muc dich thao tac).
- Dung prompt template co cau truc de tai tao slash workflow.
- Dung rules/hook de ep ky luat thay vi nho thu cong.
- Moi task lon van theo quy trinh: Discovery -> Plan (approve) -> Implementation -> Verification.

## 2) Bang quy doi nhanh

| Antigravity/Gemini flow | Cursor CLI equivalent | Prompt mau de go nhanh |
| :--- | :--- | :--- |
| `/wake-up` | Nap context dau phien + xac nhan role + SSOT | `Doc AGENTS.md, docs/000-Index.md, knowledge-base/00-Index.md. Tom tat context va hoi toi role muon kich hoat.` |
| `/opsx:new` | Tao implementation plan va artifacts | `Dong vai Engineer. Tao step-by-step plan cho [TASK], liet ke file se sua, test plan va rui ro.` |
| `/opsx:explore` | Kham pha/phan tich truoc khi code | `Chi explore, chua sua file. Phan tich 2-3 huong giai quyet [PROBLEM], neu can thi de xuat trade-off.` |
| `/opsx:apply` | Thuc thi theo plan da duyet | `Thuc thi theo plan da duyet. Sua file can thiet, bao cao tung thay doi ngan gon.` |
| `/opsx:verify` | Chay test/lint/build + regression check | `Chay test/lint/build lien quan. Bao cao ket qua, loi, va de xuat cach xu ly neu fail.` |
| `/code-reviewer` | Review mode (bug/risk/test gap first) | `Review thay doi hien tai theo muc do nghiem trong. Uu tien bug, regression risk, thieu test.` |

## 3) Prompt templates de thay slash command

### Template A - Wake-up

```text
Doc AGENTS.md, docs/000-Index.md, knowledge-base/00-Index.md.
Tom tat:
1) Rules bat buoc
2) SSOT can dung cho task nay
3) De xuat role phu hop nhat
Chua sua file.
```

### Template B - Planning

```text
Dong vai [ROLE]. Lap plan cho [TASK] theo format:
- Scope
- File du kien thay doi
- Step-by-step implementation
- Test/verification plan
- Rui ro va rollback
Cho toi approve truoc khi sua file.
```

### Template C - Apply

```text
Thuc thi theo plan da duyet.
Sua file toi thieu can thiet, khong lam vuot scope.
Sau khi sua xong: chay test/lint/build lien quan va bao cao ket qua.
```

### Template D - Verify

```text
Chi verify, khong doi logic moi.
Chay bo kiem tra lien quan, tong hop:
- Pass/fail
- Loi con ton dong
- Danh sach risk con lai
```

## 4) Macro workflow khuyen nghi trong Cursor CLI

1. Bat dau task: dung Template A.
2. Chon role va tao plan: dung Template B.
3. Sau khi approve: dung Template C.
4. Truoc khi ket thuc: dung Template D.
5. Neu can review chat luong: dung prompt review tu bang quy doi.

## 5) Luu y quan trong

- Neu task co tac dong rong, bat buoc bao scope/risk truoc khi sua.
- Uu tien thay doi nho, de test, de rollback.
- Luon chi ro file da sua, ly do, va cach verify.
- Neu context lon, chia task theo 2-3 turn nho de giam hallucination.

---

Neu can "cam giac nhu slash command", co the luu cac template tren thanh snippets trong editor/clipboard manager de go nhanh.
