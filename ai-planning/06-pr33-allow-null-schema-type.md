# 06 — PR #33: Allow "null" type

- **Link:** https://github.com/robertmassaioli/atlassian-openapi/pull/33
- **Author:** tomec-martin
- **Opened:** 2024-06-20
- **Mergeable state:** `CONFLICTING` / `DIRTY`

## What it changes

```diff
-export type SchemaType = "array" | "boolean" | "integer" | "number" | "object" | "string";
+export type SchemaType = "array" | "boolean" | "integer" | "number" | "object" | "string" | "null";
```

`src/swagger.ts` only, 1 line. PR description cites
`draft-bhutton-json-schema-01` (JSON Schema 2020-12) as justification for
`"null"` being a valid schema `type`.

The `CONFLICTING` state is **purely cosmetic**: on current `master`,
`SchemaType` has been reformatted from a single-line union to a multi-line
one (swagger.ts:346-352). The semantic change — adding `"null"` to the
union — is a one-line reapply once that's accounted for.

## Why this needs a decision, not just a conflict resolution

This repository's README states it targets **OpenAPI 3.0**:

> This package contains Typescript typings for OpenAPI 3.0 with Atlassian
> extensions included... Atlassian code and tooling that is based on
> OpenAPI 3.0 should use this library.

OpenAPI 3.0 already has a mechanism for expressing nullability, and this
library already implements it: `Schema.nullable?: boolean` at
`swagger.ts:388`. In OpenAPI 3.0, `type: "null"` as a literal schema type
value is **not valid** — nullability is expressed via `nullable: true`
alongside a non-null `type`. `type: "null"` as a standalone type is JSON
Schema 2020-12 / **OpenAPI 3.1** semantics — which is exactly the spec the
PR cites, just not the one this library says it targets.

So the fix is either:
- correct, if this library is meant to start accepting OpenAPI 3.1-flavored
  schemas (in which case it should be scoped and documented as such, since
  3.1 also changes other things this library doesn't yet model), or
- a hole that lets structurally invalid OpenAPI 3.0 documents type-check
  without complaint, if the library is meant to stay 3.0-only.

## Blast radius

`SchemaType` is an **exported, published type**. This package auto-publishes
a new version on every merge to master
(`npm version 1.0.${BITBUCKET_BUILD_NUMBER}` in `bitbucket-pipelines.yml`).
Widening a published union type is a breaking change for any consumer with
an exhaustive `switch (schema.type)` — it would newly fail to compile for
them without a major version bump or a heads-up.

## Verdict: **Don't merge as-is**

The one-line diff undersells the decision buried in it. Recommend Robert
decide explicitly whether this library takes on OpenAPI 3.1-style `"null"`
typing (and how that interacts with the existing `nullable` field) before
this lands, and treat the eventual change as semver-significant given the
exported-type breakage risk. If the answer is "yes, support it," reapply the
same one-line change against the current multi-line `SchemaType` definition.
