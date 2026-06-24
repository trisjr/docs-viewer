---
id: GUIDE-CURSOR-CLI-SNIPPETS
type: user-guide
status: draft
created: 2026-05-02
updated: 2026-05-02
linked-to:
  - GUIDE-CURSOR-CLI-WORKFLOW-MAPPING
---

# Cursor CLI Snippets (English, Token-Optimized)

Use these as quick copy/paste prompts to emulate Antigravity/Gemini workflow in Cursor CLI.

## 1) Wake-Up

```text
Read AGENTS.md, docs/000-Index.md, knowledge-base/00-Index.md.
Return:
1) mandatory rules
2) relevant SSOT docs for this task
3) best role to activate
Do not edit files.
```

## 2) Explore (No Edits)

```text
Explore only. No file edits.
Analyze [PROBLEM] and propose 2-3 solution options with trade-offs.
List assumptions and missing context.
```

## 3) Plan (Approval Gate)

```text
Act as [ROLE].
Create a step-by-step plan for [TASK]:
- scope
- files to change
- implementation steps
- test/verification plan
- risks and rollback
Wait for my approval before editing files.
```

## 4) Apply (Implement Approved Plan)

```text
Implement only the approved plan for [TASK].
Keep changes minimal and in-scope.
After edits, run relevant checks (test/lint/build) and report results.
```

## 5) Verify (No New Logic)

```text
Verification mode only. No new feature logic.
Run relevant checks and return:
- pass/fail summary
- failing items
- residual risks
```

## 6) Review (Bug/Risk First)

```text
Review current changes by severity.
Prioritize:
1) bugs
2) regression risks
3) missing tests
Then provide concise recommendations.
```

## 7) Refactor Safety Gate

```text
Before refactoring [SYMBOL], show impact scope:
- direct callers
- likely affected areas
- risk level
Then propose a safe refactor sequence.
Do not edit files yet.
```

## 8) PR Prep

```text
Prepare PR-ready output for current branch:
- concise title options
- summary bullets (what/why)
- test plan checklist
- risk notes
Keep it short and reviewer-friendly.
```

## 9) Daily Use Flow (Compact)

```text
Wake-Up -> Explore -> Plan -> (Approve) -> Apply -> Verify -> Review -> PR Prep
```

---

Tip: store each block in your clipboard manager as named snippets (`wake`, `explore`, `plan`, `apply`, `verify`, `review`, `prprep`).
