# Contributing

How work is planned, written and merged in this repository.

## Planning

- The backlog lives in [docs/ROADMAP.md](docs/ROADMAP.md). Every item has an id (`WEB-05`, `ORD-01`…), an area tag and a priority.
- One roadmap item → one issue → one branch → one small PR.
- A milestone closes only when its Definition of Done is met.

## Branches

```
<type>/<milestone>-<item-id>-<short-description>
```

| Example                                        | When                           |
| ---------------------------------------------- | ------------------------------ |
| `feat/m1-web-05-product-detail-page`           | New behavior                   |
| `fix/m1-cat-01-text-search-accents`            | Bug fix                        |
| `refactor/m2-ord-01-order-state-table`         | No functional change           |
| `chore/m1-chore-02-remove-inline-comments`     | Tooling, dependencies, cleanup |
| `docs/m1-roadmap-contributing-and-pr-template` | Documentation only             |

Lowercase, words separated by `-`, no personal names, no dates.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <imperative summary, max 72 chars>

<body: what changed and why, wrapped at 72 chars>

Refs: WEB-05
```

- **Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`.
- **Scopes:** the module or app touched: `api`, `web`, `contracts`, `infra`, `catalog`, `vendors`, `orders`, `auth`, `delivery`, `payments`, `storage`, `ci`, `deps`.
- One purpose per commit. Tests go in the same commit as the code they cover.
- The body explains intent and trade-offs; the diff already shows the lines.
- No co-author trailers and no tool attribution in commits or PRs.

Example:

```
feat(contracts): add server-side unit price calculation

Adds calculateUnitPrice and validateSelections so the web preview and
the checkout compute prices with the same rules. Select options add
their priceDelta; text options never change the price. Invalid or
missing selections are reported as a list instead of throwing, so the
UI can show every problem at once.

Refs: CAT-06
```

## Code

- **English** for identifiers, error messages, logs and tests.
- **No inline comments.** Code should explain itself through names and small functions.
  - HTTP endpoints are documented with OpenAPI decorators (`@nestjs/swagger`).
  - Anything a decorator cannot describe and that is not obvious from the signature (a non-trivial invariant, a unit, a business rule) is documented with **JSDoc** on the function, class or type.
- **UI copy** never lives in components: it goes in `apps/web/src/i18n/messages/<locale>/<namespace>.json`.
- **Money** is an integer amount in centavos (`Money`), formatted only at the edge (`formatPrice`).
- **Validation** at every boundary with the Zod schemas from `@macrodetails/contracts`.
- **Architecture:** modules talk to each other only through their `index.ts` (ADR 0002). Ports are abstract classes in `domain/`; adapters live in `infrastructure/`.

## Pull requests

- Use the [PR template](.github/pull_request_template.md). Write "None" instead of deleting Breaking changes, Security and Rollback.
- Title in Conventional Commits format, e.g. `feat(web): add product detail page`.
- Before opening: `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`, plus `pnpm test:e2e` when the API changes.
- Merge only with CI green.
