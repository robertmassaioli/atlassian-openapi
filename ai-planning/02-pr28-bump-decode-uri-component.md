# 02 — PR #28: Bump decode-uri-component from 0.2.0 to 0.2.2

- **Link:** https://github.com/robertmassaioli/atlassian-openapi/pull/28
- **Author:** dependabot[bot]
- **Opened:** 2022-12-08
- **Mergeable state:** `MERGEABLE` / `CLEAN`

## What it changes

Dependabot security bump of `decode-uri-component` from 0.2.0 to 0.2.2
(fixes a token-overwrite issue). Touches only `package-lock.json`
(+3 / −3 lines).

## Blast radius

`decode-uri-component` is required by `source-map-resolve`, required by
`snapdragon` — a transitive dependency several layers inside the Jest 23
**devDependency** tree. It never reaches a published install: `dependencies`
in `package.json` is only `jsonpointer` and `urijs`, and the `files` field
only publishes `lib/**` + `swagger.v3.json`. So this quiets a Dependabot
security alert but doesn't protect any actual consumer of this package —
the advisory never ships.

## Verdict: **Merge**

Trivial, clean, lockfile-only change with zero code risk. No reason to let
Dependabot keep re-flagging it. Worth confirming `npm ci && npm run build &&
npm test` still passes after merge (a lockfile can text-merge cleanly and
still resolve to an inconsistent tree, especially with the recent
`DISCOVER-3463` lockfile rewrite on master), but no substantive review is
needed beyond that.
