# Open PR evaluation — summary

Evaluated 2026-08-13. The repo had 0 open GitHub issues and 6 open pull
requests at the time of review; "issue" in the originating request is read as
"pull request" throughout, since that's the only reading consistent with the
data and with "worth merging in."

| # | PR | Title | State | Verdict |
|---|----|-------|-------|---------|
| [01](01-pr23-bump-braces-and-jest.md) | [#23](https://github.com/robertmassaioli/atlassian-openapi/pull/23) | Bump braces and jest | CONFLICTING | **Don't merge as-is** — close in favor of one deliberate Jest upgrade |
| [02](02-pr28-bump-decode-uri-component.md) | [#28](https://github.com/robertmassaioli/atlassian-openapi/pull/28) | Bump decode-uri-component 0.2.0→0.2.2 | MERGEABLE | **Merge** |
| [03](03-pr29-bump-qs.md) | [#29](https://github.com/robertmassaioli/atlassian-openapi/pull/29) | Bump qs 6.5.2→6.5.3 | MERGEABLE | **Merge** |
| [04](04-pr30-bump-json5-and-jest.md) | [#30](https://github.com/robertmassaioli/atlassian-openapi/pull/30) | Bump json5 and jest | CONFLICTING | **Don't merge as-is** — supersedes #23, still blocked |
| [05](05-pr32-null-check-in-isreference.md) | [#32](https://github.com/robertmassaioli/atlassian-openapi/pull/32) | fix: null check in isReference | MERGEABLE | **Merge** (add a regression test) |
| [06](06-pr33-allow-null-schema-type.md) | [#33](https://github.com/robertmassaioli/atlassian-openapi/pull/33) | Allow "null" type | CONFLICTING | **Don't merge as-is** — needs a 3.0-vs-3.1 decision first |

## The short answer

**Merge #28, #29, and #32.** All three are clean, low-risk, and either
trivial dependency hygiene or a genuinely correct bug fix that a community
member is actively waiting on.

**Don't merge #23, #30, or #33 as they stand** — not because they're wrong in
spirit, but because each one is hiding a decision that shouldn't be made by
just clicking merge:

- **#23 and #30 are the same decision twice.** Both bundle a Jest 23→29
  major-version bump (#30 is the newer, more complete version — it
  supersedes #23). That's a legitimate thing to want, but it needs its own
  PR: `.github/workflows/node.js.yml` still tests Node 12/14/16 and
  `bitbucket-pipelines.yml` still builds and publishes on `node:12`, and
  Jest 29 needs Node ≥14. Landing either PR as-is would silently break the
  Node 12 CI/publish leg. Recommend closing both dependabot PRs and doing
  one deliberate upgrade that also fixes the Node pin.
- **#33 changes the shape of a published type based on the wrong spec
  version.** The README states this library targets **OpenAPI 3.0**, and
  `Schema.nullable?: boolean` (swagger.ts:388) is already OpenAPI 3.0's real
  mechanism for nullability. `type: "null"` as a schema value comes from
  JSON Schema 2020-12 / OpenAPI 3.1 — the PR's own cited spec confirms this.
  Beyond the spec mismatch, it widens the exported `SchemaType` union, which
  is a breaking change for any consumer with an exhaustive `switch` over it,
  and this package auto-publishes on every merge to master. Worth
  revisiting if/when the library takes on OpenAPI 3.1 support deliberately,
  not as a one-line drive-by.

## A note on the two "security" bumps

#28 (`decode-uri-component`) and #29 (`qs`) both patch real advisories, but
neither package is reachable from a published install: they're transitive
dependencies of the Jest 23 devDependency tree
(`qs`←`request`←`jsdom`; `decode-uri-component`←`source-map-resolve`←`snapdragon`),
and `package.json`'s `files` field only ships `lib/**` and `swagger.v3.json`.
Merging them is still worthwhile — it's free, it quiets Dependabot, and it
costs nothing — but it doesn't protect any consumer of this package today.
