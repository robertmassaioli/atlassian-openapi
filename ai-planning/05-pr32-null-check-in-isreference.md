# 05 — PR #32: fix: null check in isReference util function

- **Link:** https://github.com/robertmassaioli/atlassian-openapi/pull/32
- **Author:** akilansengottaiyan
- **Opened:** 2024-02-07
- **Mergeable state:** `MERGEABLE` / `CLEAN`

## What it changes

```diff
 export function isReference(s: any): s is S.Reference {
-  return typeof s === 'object' && '$ref' in s;
+  return typeof s === 'object' && s !== null && '$ref' in s;
 }
```

`src/type-checks.ts` only, 1 line. `typeof null === 'object'` in JavaScript,
so `isReference(null)` currently evaluates `'$ref' in null`, which throws a
`TypeError` instead of returning `false`. The fix guards against that.

## Blast radius

`isReference` is an exported type-guard used to distinguish `Schema` from
`Reference` values throughout the library's public API — this is a real,
reachable correctness bug for any consumer that calls it on a value that
might be `null` (e.g. an optional/absent schema field). Fixing it is
strictly safer: it turns a crash into a correct `false`.

## Community signal

A community member (`tiago-garcia-deel`) commented on 2025-04-16 asking
Robert directly to merge this, indicating it's an active pain point outside
this repo, not just a theoretical fix.

## Gaps

There is no existing test for `isReference` (checked `src/*.test.ts` —
only `lookup.test.ts` and `operation-grouping.test.ts` exist). The fix
itself is obviously correct, but merging without a regression test leaves
this open to silent re-breakage later.

## Verdict: **Merge**

Clean, narrow, correct, low-risk, and actively requested. Recommend adding
one small test case (`isReference(null) === false`) alongside the merge so
the fix is guarded going forward — the PR's own diff doesn't include one.
