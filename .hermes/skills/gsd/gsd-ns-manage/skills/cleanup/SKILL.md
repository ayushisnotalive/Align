---
name: gsd-cleanup
description: "Archive accumulated phase directories from completed milestones"
version: "1.14.0"
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - AskUserQuestion
---

<objective>
Archive phase directories from completed milestones into `.planning/milestones/v{X.Y}-phases/`.

Use when `.planning/phases/` has accumulated directories from past milestones.
</objective>

<execution_context>
@/home/ayushz/storage/CST studies/all projects/Align/.hermes/gsd-core/workflows/cleanup.md
</execution_context>

<process>
Execute end-to-end.
Identify completed milestones, show a dry-run summary, and archive on confirmation.
</process>
