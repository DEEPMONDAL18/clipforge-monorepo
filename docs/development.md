# ClipForge Development & Code Quality Guidelines

## Strict Typing Standards

1. **No `any` Policy**: The use of `any` is strictly prohibited and flagged as an error by ESLint (`@typescript-eslint/no-explicit-any`).
2. **Explicit Interfaces**: All DTOs, parameters, and service dependencies must be explicitly typed under `src/types/`.
3. **Zod Runtime Validation**: All external input (environment variables, request bodies, path parameters) must be validated using Zod schemas before entering domain logic.

---

## Code Quality Commands

```bash
# Type check all TypeScript workspace code
npm run type-check

# Lint workspace and enforce coding conventions
npm run lint

# Automatically format codebase using Prettier
npm run format
```

---

## Git Workflow & Pre-commit Hooks

Husky and `lint-staged` are configured at the repository root. On every commit:

- Modified TS/TSX files are automatically checked with ESLint and Prettier.
- Unformatted or invalid files will prevent commits until corrected.
