# 07 — Testing strategy proposal: coverage gaps and a coverage library

## Recommendation up front

Add **Jest's built-in coverage** (it already bundles Istanbul — no new
runtime dependency needed) with a `coverageThreshold` gate in CI, and
prioritize writing tests for `src/type-checks.ts`, which currently has
**zero** test coverage despite being the module both open PR #32
([05-pr32-null-check-in-isreference.md](05-pr32-null-check-in-isreference.md))
and most of `src/lookup.ts`'s logic depend on. For reporting/badges, use
**Codecov** via its GitHub Action (free for public repos) — or, if you'd
rather not depend on an external service, **`istanbul-badges-readme`** to
generate a local coverage badge from Jest's own output with no account
needed.

## Current state

| File | Lines | Exported surface | Test file | Coverage |
|---|---|---|---|---|
| `src/type-checks.ts` | 436 | ~30 type-guard functions (`isReference`, `isSchema`, `isParameter`, `isSecurityScheme`, …) | *(none)* | **0%** — never imported by any `*.test.ts` |
| `src/lookup.ts` | 153 | `IdLookup`, `InternalLookup` (10-method `Lookup` interface each) | `lookup.test.ts` (9 cases) | Only `getSchema` is tested, on both classes. The other 9 methods per class (`getCallback`, `getExample`, `getHeaders`, `getLink`, `getParam`, `getRequestBody`, `getResponse`, `getSecurityScheme`, `getSecuritySchemeByName`) are untested |
| `src/operation-grouping.ts` | 257 | `getIdForOperationGroup`, `getIdForOperation`, `getOpPath`, 3 grouping strategies | `operation-grouping.test.ts` (25 cases) | Good — all exports and all 3 strategies have dedicated `describe` blocks |
| `src/swagger.ts` | 896 | Types/interfaces only (no functions, no runtime logic) | — | N/A — nothing to unit test, erased at compile time |
| `src/test-functions.ts` | 12 | `pathsToOAS` test helper | used by both test files | Exercised indirectly; it's a helper, not product logic |
| `src/types.d.ts` | 32 | ambient declarations | — | N/A |

No coverage tooling exists today: `jest.config.js` has no `collectCoverage`
or `coverageThreshold`, `package.json` has no coverage script, and
`.github/workflows/node.js.yml` runs `npm test` with no `--coverage` flag
and nothing enforcing a floor.

## Gaps, in priority order

### 1. `type-checks.ts` has no tests at all

This is the highest-value gap. Every one of the ~30 exported predicates
(`isReference`, `isSchema`, `isParameter`, `isSecurityScheme`, etc.) is a
narrow, pure, easily-testable function — and yet none has a single test.
This isn't hypothetical risk: [PR #32](https://github.com/robertmassaioli/atlassian-openapi/pull/32)
exists specifically because `isReference(null)` threw instead of returning
`false`, and that bug shipped silently because nothing calls these
functions directly in a test. The rest of the predicates likely have
similar unguarded edge cases (e.g. `isMediaTypeWithExamples`,
`isMediaTypeWithExample`, and other paired discriminators — worth checking
each handles `null`/`undefined`/wrong-shape input the way its callers
assume).

### 2. `lookup.ts` is mostly untested outside the `getSchema` happy path

`lookup.test.ts` only exercises `getSchema` on `IdLookup` and
`InternalLookup`. The other 9 `Lookup` methods share the same
`performLookup` machinery, so a bug specific to, say, `getSecurityScheme`'s
special-cased `getSecuritySchemeByName` (`lookup.ts:123-125`, which
constructs a synthetic `$ref` string rather than reusing `performLookup`
directly) would not be caught today.

More importantly, `performLookup` (`lookup.ts:132-151`) **recurses when a
resolved reference is itself a reference** with no cycle or depth guard:

```ts
const result = pointerGet(this.schema, ref.slice(1));
if (TC.isReference(result)) {
  return this.performLookup(result, tCheck);   // no cycle detection
}
```

A malformed OpenAPI document with a circular `$ref` chain (`A → B → A`)
would recurse until a stack overflow, and there is currently no test that
would catch this — either to confirm it's an accepted limitation or to
prove a fix. This is a coverage gap and a latent correctness question in
one; worth a test that documents current behavior even if the fix itself is
out of scope for this proposal.

Also untested: external references (`$ref` not starting with `#`, which
`performLookup` intentionally returns `undefined` for), and dangling
internal references (pointer resolves to nothing).

### 3. No automated measurement, so gaps like the above go unnoticed

Nothing today would have flagged `type-checks.ts` as a 0%-covered file.
Without `collectCoverage` + a threshold, a regression (a new predicate
added without a test, or an existing one losing its only indirect exercise)
has no signal in CI.

## Recommended tooling

**Don't add a separate coverage runner** (e.g. `nyc`/Istanbul-CLI). Jest has
shipped Istanbul-based coverage built in since well before this repo's
current Jest 23, and it's still true after the Jest 23→29 upgrade proposed
separately in [04-pr30-bump-json5-and-jest.md](04-pr30-bump-json5-and-jest.md) —
so this works today and keeps working regardless of when/whether that
upgrade lands. Adding `nyc` alongside Jest would just duplicate
functionality Jest already has.

Concrete changes:

1. **`jest.config.js`** — turn on coverage collection and set a threshold:
   ```js
   collectCoverage: true,
   collectCoverageFrom: [
     "src/**/*.ts",
     "!src/**/*.test.ts",
     "!src/swagger.ts",       // types only, nothing to cover
     "!src/types.d.ts",
     "!src/test-functions.ts" // test helper, not product logic
   ],
   coverageReporters: ["text", "lcov"],
   coverageThreshold: {
     global: { statements: 70, branches: 60, functions: 70, lines: 70 },
     "./src/type-checks.ts": { statements: 90, branches: 85, functions: 90, lines: 90 },
     "./src/lookup.ts": { statements: 90, branches: 80, functions: 90, lines: 90 }
   }
   ```
   The per-file thresholds on `type-checks.ts` and `lookup.ts` are the
   point — a repo-wide average would let these two risk areas hide behind
   `operation-grouping.ts`'s already-good coverage.

2. **`package.json`** — no new dependency required, just a script:
   ```json
   "test:coverage": "jest --coverage"
   ```

3. **CI (`.github/workflows/node.js.yml`)** — run `npm test` with coverage
   on at least one matrix leg and fail the build on threshold breach (which
   `coverageThreshold` already does automatically — `jest` exits non-zero).
   Optionally upload the `lcov.info` it produces:
   - **Codecov** (`codecov/codecov-action@v4`): well-known, free for public
     repos, gives PR-comment coverage diffs and a README badge. Requires
     linking the repo on codecov.io (no secret needed for public repos).
   - **No-external-service alternative**: `istanbul-badges-readme` (small
     devDependency) reads Jest's `coverage-summary.json` and writes a
     coverage badge straight into `README.md` in the CI job itself — no
     third-party account, no data leaving GitHub Actions. Lower fidelity
     (just a percentage badge, no PR diff comments) but zero external
     dependency footprint, which may suit a small, low-traffic library like
     this one better than onboarding a SaaS.

Both options are compatible with Jest's built-in coverage output — the
choice is about reporting/visibility, not about how coverage gets
collected.

## Suggested new tests (to close the gaps above)

1. `src/type-checks.test.ts` (new file) — one `describe` block per
   predicate family, minimum cases per function: a valid match, a
   near-miss (wrong discriminant), and `null`/`undefined` input. This
   alone would take `type-checks.ts` from 0% to comparable-with-the-rest-
   of-the-repo, and it's exactly the kind of test PR #32's fix is missing.
2. `src/lookup.test.ts` additions — one test per currently-untested
   `Lookup` method (both `IdLookup` and `InternalLookup` where behavior
   differs), plus: external-ref handling, dangling-ref handling, and a
   circular-ref test that pins down current behavior (even a
   `expect(() => …).toThrow()` / documented depth limit is better than the
   silent gap that exists today).

## Verification

- `npm run test:coverage` produces a coverage summary and exits non-zero if
  any configured threshold isn't met.
- `coverage/lcov-report/index.html` (generated locally) shows
  `type-checks.ts` and `lookup.ts` at or above their per-file thresholds
  once the new tests above are added. `.gitignore` currently has no
  `coverage/` entry — add one as part of this work so generated reports
  aren't accidentally committed.
- CI run on a PR shows the coverage step passing/failing appropriately, and
  (if Codecov is chosen) a coverage diff comment appears on the PR.
