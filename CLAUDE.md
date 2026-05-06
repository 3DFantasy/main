## Pre-merge checks

Before declaring any task "complete", run ALL FIVE checks. Each catches a class of failure the others miss — do not declare done from a subset:

```bash
npm run typecheck       # tsc — whole-program type errors
npm run lint            # ESLint — see .eslintrc.cjs
npm test                # Vitest: unit + integration (needs threedf_test DB)
npm run test:e2e        # Playwright: real browser against the production build (needs threedf_test DB)
npm run build           # Remix vite:build — full production bundle
```

What each uniquely catches:

-   **typecheck** — whole-program type errors. Vitest only typechecks the files it executes; `tsc` walks the entire graph and surfaces issues in files no test imports yet.
-   **lint** — stale-closure `useEffect` deps (`react-hooks/exhaustive-deps`), missing `key` props in `.map()`, dead variables, a11y regressions. Errors fail the script; warnings are advisory.
-   **test** — Vitest unit (jsdom, no DB) plus integration (real Postgres against `threedf_test`, hits actual DAOs and Remix loaders/actions). Redis, Puppeteer, Microsoft Graph, and `@azure/identity` are mocked at the module boundary in `vitest.setup.ts`.
-   **test:e2e** — the only check that exercises a real Chromium against the Remix production build. Playwright's `webServer` runs `npm run build && npm start` with `DISABLE_RESQUE=true` and the full `.env.test` injected, so e2e is isolated from the dev `.env`.
-   **build** — runs the production Vite + Remix pipeline. Only this catches `.server.ts`/client boundary leaks, route file format issues, and Vite resolution failures that don't surface in dev or unit tests.

**Prerequisites for `test` and `test:e2e`:** the `threedf_test` Postgres DB must be reachable and migrated (see "Testing → Local setup"). The test helpers refuse any DB whose name doesn't end in `_test` — see `tests/helpers/db.ts::assertTestDatabase`.

CI runs all five via `.github/workflows/test.yml` (single job named `test`) on every PR and on pushes to `main`. CI uses an ephemeral `postgres:16` service rather than the Pi. A green CI run is the floor, not a victory lap — flaky tests and missing coverage still hide bugs.

## Plan Mode Instruction

Review this plan thoroughly before making any code changes. For every issue or recommendation, explain the concrete tradeoffs, give me an opinionated recommendation, and ask for my input before assuming a direction.

My engineering preferences (use these to guide your recommendations):

-   DRY is important—flag repetition aggressively.
-   Well-tested code is non-negotiable; I'd rather have too many tests than too few.
-   I want code that’s "engineered enough" — not under-engineered (fragile, hacky) and not over-engineered (premature abstraction, unnecessary complexity).
-   I err on the side of handling more edge cases, not fewer; thoughtfulness > speed.
-   Bias toward explicit over clever.

1. Architecture review
   Evaluate:

-   Overall system design and component boundaries.
-   Dependency graph and coupling concerns.
-   Data flow patterns and potential bottlenecks.
-   Scaling characteristics and single points of failure.
-   Security architecture (auth, data access, API boundaries).

2. Code quality review
   Evaluate:

-   Code organization and module structure.
-   DRY violations—be aggressive here.
-   Error handling patterns and missing edge cases (call these out explicitly).
-   Technical debt hotspots.
-   Areas that are over-engineered or under-engineered relative to my preferences.

3. Test review
   Evaluate:

-   Test coverage gaps (unit, integration, e2e).
-   Test quality and assertion strength.
-   Missing edge case coverage—be thorough.
-   Untested failure modes and error paths.

4. Performance review
   Evaluate:

-   N+1 queries and database access patterns.
-   Memory-usage concerns.
-   Caching opportunities.
-   Slow or high-complexity code paths.

For each issue you find
For every specific issue (bug, smell, design concern, or risk):

-   Describe the problem concretely, with file and line references.
-   Present 2–3 options, including “do nothing” where that’s reasonable.

For each option, specify: implementation effort, risk, impact on other code, and maintenance burden.
Give me your recommended option and why, mapped to my preferences above.
Then explicitly ask whether I agree or want to choose a different direction before proceeding.

Workflow and interaction

-   Do not assume my priorities on timeline or scale.
-   After each section, pause and ask for my feedback before moving on.

BEFORE YOU START:
Ask if I want one of two options:
1/ BIG CHANGE: Work through this interactively, one section at a time (Architecture → Code Quality → Tests → Performance) with at most 4 top issues in each section.
2/ SMALL CHANGE: Work through interactively ONE question per review section

FOR EACH STAGE OF REVIEW: output the explanation and pros and cons of each stage’s questions AND your opinionated recommendation and why, and then use AskUserQuestion. Also NUMBER issues and then give LETTERS for options and when using AskUserQuestion make sure each option clearly labels the issue NUMBER and option LETTER so the user doesn't get confused. Make the recommended option always the 1st option.
