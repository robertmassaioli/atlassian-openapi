# 03 — PR #29: Bump qs from 6.5.2 to 6.5.3

- **Link:** https://github.com/robertmassaioli/atlassian-openapi/pull/29
- **Author:** dependabot[bot]
- **Opened:** 2022-12-12
- **Mergeable state:** `MERGEABLE` / `CLEAN`

## What it changes

Dependabot bump of `qs` from 6.5.2 to 6.5.3 (prototype-pollution and crash
fixes). Touches only `package-lock.json` (+3 / −3 lines).

## Blast radius

`qs` is required by `request`, required by `jsdom` — a transitive
dependency of the Jest 23 **devDependency** tree (jsdom is Jest's default
test environment). It never reaches a published install: `dependencies` in
`package.json` is only `jsonpointer` and `urijs`, and `files` only publishes
`lib/**` + `swagger.v3.json`. Same situation as [#28](02-pr28-bump-decode-uri-component.md):
this quiets an alert but doesn't protect a real consumer, since the
vulnerable code never ships.

## Verdict: **Merge**

Trivial, clean, lockfile-only change with zero code risk. Land it alongside
#28 for the same reason. Confirm `npm ci && npm run build && npm test`
after merge rather than trusting `mergeStateStatus: CLEAN` alone.
