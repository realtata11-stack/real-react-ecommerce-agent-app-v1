# My Store

The storefront for the My Store shop: customers browse products, fill a cart and place an order.

## Language

- Talk to the user in Thai. Keep technical terms in English.
- Write specs and tickets in Thai with English technical terms.
- Write code, comments, UI text and commit messages in English.

## What to build

- The client's request is `docs/brief/client-brief.md`. Read it before planning any work.
- The design is `docs/brief/design-notes.md` plus the images in `docs/brief/screenshots/`.
- Where the screenshots and the brief disagree, the brief wins.

## Fixed decisions

- React 19, TypeScript, Vite, Tailwind CSS v4.
- Server data goes through TanStack Query. It is installed but not wired up yet.
- The API address comes from `import.meta.env.VITE_API_BASE_URL`. Never hard-code it.
- Every other choice (routing, state, forms, UI libraries, folder structure) is open. Agree it with the user before adding a dependency.

## Checks

- `npm run check` runs typecheck, lint, tests and build. It must pass before every commit.
- Run one part alone with `npm run typecheck`, `npm run lint`, `npm run test` or `npm run build`.

## Agent skills

### Issue tracker

Specs and tickets are local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The default five labels. New specs and tickets get `ready-for-agent`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.
