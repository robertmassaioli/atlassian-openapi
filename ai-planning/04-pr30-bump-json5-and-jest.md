# 04 — PR #30: Bump json5 and jest

- **Link:** https://github.com/robertmassaioli/atlassian-openapi/pull/30
- **Author:** dependabot[bot]
- **Opened:** 2022-12-31
- **Mergeable state:** `CONFLICTING` / `DIRTY`

## What it changes

Dependabot-authored bump of `json5` (2.1.0 → 2.2.3, fixes a prototype
pollution vulnerability) and `jest` (23.6.0 → 29.3.1), bundled together
because of a shared dependency chain. Touches `package.json` (1 line) and
`package-lock.json` (+2989 / −4574 lines).

## Blast radius

- `json5` is required by `babel-core` and `ts-jest`, both inside the Jest 23
  **devDependency** tree — never reaches a published install.
- `jest` itself is the direct devDependency, so — same as
  [#23](01-pr23-bump-braces-and-jest.md) — this is a real major bump
  (23 → 29.3.1, a slightly newer point release than #23's 29.0.1).

## Relationship to PR #23

This PR **supersedes #23**: it's the same Jest 23→29 upgrade, at a newer
point release, bundled with a different (also dev-only) transitive fix. They
were opened four months apart by Dependabot as it kept retrying the same
underlying upgrade. There's no value in evaluating them separately or
landing both.

## Why it's stuck

Same blocker as #23: Jest 29 requires Node ≥14, but
`.github/workflows/node.js.yml` still tests Node 12/14/16 and
`bitbucket-pipelines.yml` still builds/publishes on `node:12`. Merging as-is
would silently break the Node 12 leg of both pipelines.

## Verdict: **Don't merge as-is**

Close this alongside #23 and do one deliberate Jest 23→29 upgrade PR instead,
which also resolves the Node 12 CI/publish pin. See
[01-pr23-bump-braces-and-jest.md](01-pr23-bump-braces-and-jest.md) for the
fuller reasoning — it applies here unchanged.
