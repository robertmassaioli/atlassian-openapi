# 01 — PR #23: Bump braces and jest

- **Link:** https://github.com/robertmassaioli/atlassian-openapi/pull/23
- **Author:** dependabot[bot]
- **Opened:** 2022-09-02
- **Mergeable state:** `CONFLICTING` / `DIRTY`

## What it changes

Dependabot-authored bump of `braces` (1.8.5 → 3.0.2) and `jest`
(23.6.0 → 29.0.1), which have to move together because of a shared
dependency chain. Touches `package.json` (1 line) and `package-lock.json`
(+3063 / −4637 lines).

## Blast radius

- `braces` is a transitive dependency of `micromatch`, itself pulled in by
  `jest-config`/`jest-haste-map`/`jest-runtime`/`sane`/`test-exclude` —
  entirely inside the Jest 23 **devDependency** tree. It does not reach a
  published install (`dependencies` in `package.json` is only `jsonpointer`
  and `urijs`; `files` only ships `lib/**` + `swagger.v3.json`).
- `jest` itself is a direct devDependency (`package.json` currently pins
  `"jest": "^23.6.0"`), so this is a real major-version bump (23 → 29),
  not just a transitive patch.

## Why it's stuck

Bumping Jest from 23 to 29 is a legitimate, overdue upgrade, but it's not a
drop-in dependency bump — Jest 29 requires Node ≥14. This repo's CI/publish
pipeline is not there yet:

- `.nvmrc` says `14` (fine).
- `.github/workflows/node.js.yml` still runs the test matrix on
  **Node 12, 14, and 16**.
- `bitbucket-pipelines.yml` still builds and publishes on **`node:12`**.

Merging this PR as-is would leave the Node 12 legs of both pipelines broken
without warning. That's very likely *why* it's sitting in `CONFLICTING`
state — it's stale enough that `package-lock.json` has drifted underneath
it (note the recent `DISCOVER-3463` lockfile rewrite on master).

## Relationship to PR #30

[PR #30](04-pr30-bump-json5-and-jest.md) bundles the same Jest 23→29 bump
(to a slightly newer point release, 29.3.1) alongside a `json5` bump. It is
effectively a superset of this PR. There is no reason to land both.

## Verdict: **Don't merge as-is**

Close this PR (and #30) and do one deliberate Jest 23→29 upgrade as its own
PR, which also drops the Node 12 leg from `.github/workflows/node.js.yml`
and `bitbucket-pipelines.yml` (or explicitly decides to keep supporting
Node 12 with an older Jest). That PR should be hand-run through
`npm ci && npm run build && npm test`, not merged on the strength of a green
lockfile diff.
