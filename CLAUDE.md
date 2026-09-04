# Novel Jurídico — Codebase Guidelines

## Modules

A **module** is a self-contained feature area under `src/modules/<name>/`. There are three today: `home`, `student-summaries`, `flashcards`.

- `index.tsx` is the module's public API — the only file anything outside the module may import. Everything else in the module is a private implementation detail.
- `fragments/` holds components used only inside that module (page sections, local widgets). If a fragment is needed by a second module, promote it to `shared/components` instead of importing it across modules.
- **Modules never import from each other.** `src/modules/flashcards/**` must not import anything from `src/modules/home/**` or `src/modules/student-summaries/**`, and vice versa. Modules may only import from their own files and from `src/shared/**`. This is enforced by `.dependency-cruiser.cjs` and blocks commits (`npm run depcruise`).
- New features start as a new folder under `src/modules/`, following the same `index.tsx` + `fragments/` shape.

## Creating a new page

1. Decide which module it belongs to. If it's a variant or section of an existing module's feature, add it as a fragment under that module's `fragments/`. If it's a genuinely new feature area, create a new module folder (`index.tsx` + `fragments/`).
2. Page-only components (things that make no sense outside that one page) live in the module's `fragments/`, never in `shared/`.
3. Wire the module into the app by importing its `index.tsx` from `src/App.tsx` (or the router, once one exists). Only the module's `index.tsx` should ever be imported from outside the module.

## Theme usage

- Never hardcode hex colors. Always consume `colors` (and `typography`, `radii`, `spacing`) from `src/shared/theme/tokens.ts`.
- `src/shared/theme/antdTheme.ts` maps those tokens into an Ant Design `ThemeConfig`, built on `theme.darkAlgorithm` (the whole UI is dark-mode by design). Wrap the app root in `<ConfigProvider theme={antdTheme}>` — already done in `src/App.tsx` — and reuse the same `antdTheme` object in tests via `src/shared/test/test-utils.tsx`.
- `src/shared/theme/GlobalStyle.ts` is a styled-components `createGlobalStyle` for page-level resets (background, base font, link colors) that Ant Design's theme doesn't cover.
- Extending the theme: add new Ant Design component overrides to `antdTheme.ts`'s `components` block, referencing existing `colors`/`radii`/`spacing` tokens — don't introduce new literals inline.
- Adding a new token: only when an existing one doesn't semantically fit (e.g. a new state color). Reuse an existing token whenever the meaning matches, even if the current value happens to look close enough — tokens are named by role, not by shade.

## Component styling rule

Any component with non-trivial custom styling gets a sibling `styles.tsx` file that uses `styled-components` to restyle the underlying Ant Design component(s):

```
Card/
  Card.tsx     ← logic, composition, props
  styles.tsx   ← styled(...) wrappers, all visual concerns
```

`Card.tsx` should not contain styling logic (inline styles, conditional class names for visuals, etc.) — it imports styled components from `styles.tsx` and focuses on behavior and composition. Trivial styling (a single Ant Design prop like `size` or `type`) doesn't need a `styles.tsx`.

## SOLID / Single Responsibility

Keep components small and focused. A component that fetches data, transforms/formats it, and renders it should be split into pieces with one job each (e.g. a hook for fetching, a pure function for formatting, a component for rendering). Favor composition — small components assembled together — over large multi-purpose components.

## Input sanitization

Every value coming from user input must be validated before it's sent to an API or persisted:

- Define a `zod` schema for the input shape at the form boundary.
- Use it with `react-hook-form` (`zodResolver`) so invalid data never leaves the form.
- Never trust raw form state downstream of validation — read from the resolver's validated output, not directly off uncontrolled inputs.

## Testing

- Import `render` and `screen` (and anything else from React Testing Library) from `src/shared/test/test-utils.tsx`, not directly from `@testing-library/react`. It wraps components with the same `ConfigProvider`/theme used in production.
- Colocate `*.test.tsx` files next to what they test (e.g. `src/modules/home/index.test.tsx`).
- Run the full suite with `npm test` (or `npm run test:watch` while iterating).

## Commit workflow

- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) — enforced by commitlint on the `commit-msg` hook.
- The `pre-commit` hook runs, in order, failing fast on the first error:
  1. `lint-staged` — `prettier --write` + `eslint --fix` on staged files.
  2. `npm run depcruise` — blocks on cross-module import violations (errors); orphan-file warnings are printed but don't block.
  3. `npm test` — the full Vitest suite must pass.
- If a commit is rejected, the failure message tells you which stage failed — fix that (formatting, a cross-module import, or a failing test) and commit again. Don't bypass hooks with `--no-verify`.
