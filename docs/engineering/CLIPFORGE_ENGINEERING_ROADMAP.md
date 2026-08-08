# ClipForge Engineering Roadmap

## Purpose

This document is the authoritative engineering scope reference for the remaining ClipForge implementation phase.

Antigravity MUST read this document before beginning any ENG-008 through ENG-014 task.

The roadmap sequence MUST NOT be changed unless explicitly approved by the CTO.

---

# Repository Roles

## Repository A — Target

`Clipping Software`

The production ClipForge monorepo.

All implementation work occurs here.

---

## Repository B — Reference

`clipforge-frontend`

The original Lovable-generated frontend.

This repository is STRICTLY READ ONLY.

It may be inspected and used as an implementation/design reference.

It must never be modified as part of the ClipForge migration.

---

# Global Engineering Rules

These rules apply to ENG-008 through ENG-014.

## Architecture

The approved ClipForge architecture is authoritative.

Do not redesign the architecture.

Do not introduce unrelated technologies.

Do not perform unrelated refactoring.

Use the smallest engineering change required to complete the ticket.

---

## Reference Repository

`clipforge-frontend` is a reference implementation only.

Do not blindly copy:

- API assumptions
- service implementations
- backend contracts
- authentication
- business logic
- routing architecture
- upload architecture

Production ClipForge architecture takes precedence.

---

## Verification

Work incrementally.

After each logical implementation batch, verify:

```bash
npm install
npm run type-check
npm run lint
npm run build
```
