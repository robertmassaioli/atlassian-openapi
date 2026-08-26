# swagger-v31-generated.ts: generation notes

`swagger-v31-generated.ts` is produced by:

```
npm run generate:swagger-v31-base
```

which runs:

```
json2ts -i swagger-v3.1.json -o src/swagger-v31-generated.ts --unreachableDefinitions --style.singleQuote --no-unknownAny
```

It is never hand-edited. `swagger-v31.ts` composes it into the public
`SwaggerV31` namespace, following the same discipline
`swagger-v3-generation-notes.md` documents for 3.0 — read that first if
you haven't; this file only covers what's specific to 3.1.

## Where `swagger-v3.1.json` came from

The official OpenAPI 3.1 JSON Schema (fetched from
`spec.openapis.org/oas/3.1/schema/2025-11-23`, the canonical dated
publication) is written in a genuinely advanced JSON Schema 2020-12 style —
`$dynamicRef`/`$dynamicAnchor` (dynamic-scope resolution so a Schema Object
can refer to "whatever dialect this document declares"), `unevaluatedProperties`,
and `anyOf`/`if`-`then`-`else`-based extension composition throughout.
`json-schema-to-typescript` cannot process it: `$dynamicRef` isn't
supported, its own pre-generation validator has a real bug (confirmed by
reading `validator.js` directly) that false-positives on any schema
defining a *field* literally named `deprecated` — extremely common in
OpenAPI — and even after working around both of those, its dereferencer
chokes on the schema's self-referential `specification-extensions`
pattern.

Rather than keep patching around an increasingly official-but-incompatible
source, `swagger-v3.1.json` is instead **derived directly from
`swagger-v3.json`** (this repo's existing 3.0 schema, already proven to
work with this pipeline) with only the verified, real 3.1 differences
applied:

- `openapi` pattern: `^3\.0\.\d(-.+)?$` → `^3\.1\.\d+(-.+)?$`
- `paths` removed from the root `required` array — a 3.1 document can be
  webhooks-only or components-only (verified against the official schema's
  `anyOf` constraint, which itself can't be expressed as a required-array
  entry — TypeScript has no way to encode "at least one of these three" as
  a type, so it isn't enforced, only `paths` being individually optional
  is)
- `jsonSchemaDialect` and `webhooks` added as new root properties
- `components.pathItems` added
- `license.identifier` added
- `Schema.nullable` removed; `Schema.type` widened to allow an array of
  values and the `"null"` value
- `Schema.exclusiveMinimum`/`exclusiveMaximum` changed from boolean to
  number
- `Schema.examples` (array) added alongside the existing `example`
  (singular)

This means `swagger-v3.1.json` is not a byte-for-byte copy of the official
schema — it's a **practical, tool-compatible equivalent**, verified field-
by-field against the real one. If a future OpenAPI 3.1.x/3.2.x revision
changes something not in the list above, it won't be reflected here
automatically; re-diff against the official schema when that matters.

## Same taint analysis as 3.0, same result

Because `swagger-v3.1.json` was derived from `swagger-v3.json` rather than
rewritten from scratch, it has the exact same structural style — and
running the same transitive-taint analysis from Phase 0 against the fresh
3.1 generated output gives **the identical split**: the same 34 types need
hand-declaration (`Schema`, `Paths`, `Responses`, and everything that
transitively touches them — `Operation`, `PathItem`, `Components`, every
`Parameter*`/`MediaType*`/`Header*` variant, etc.), and the same 27 stay
plain aliases to the generated file.

One difference worth calling out: **`License` is a plain alias**, so its
new `identifier` field is picked up automatically with zero hand-
maintenance — a live example of what Phase 0's split was for.

## Atlassian extensions: reused, not duplicated

`AtlassianNarrative`, `NarrativeDocument`, `OAuth2Scopes`,
`OAuth2ScopesWithState`, `OAuth2ScopesState`, `DataSecurityPolicy`,
`AuthTypes`, and `XBearerType` (+ its two variants) aren't
OpenAPI-version-specific concepts, so `swagger-v31.ts` imports and reuses
them from `Swagger` (the 3.0 namespace) rather than redeclaring them. This
does mean `swagger-v31.ts` depends on `swagger.ts`; a future cleanup could
extract these into a third, version-agnostic file that both import from
instead, but that would mean touching the already-established
`swagger.ts`, so it's left as a follow-up rather than done here.

The same `x-experimental`/`x-preview`/`x-atlassian-connect-scope`/
`x-atlassian-oauth2-scopes`/`x-atlassian-data-security-policy`/
`x-atlassian-auth-types` fields on `Operation`, `x-bearer-type` on
`ApiKeySecurityScheme`/`BearerHttpSecurityScheme`, and `x-showInExample` on
the three query-parameter-ish types carry over from 3.0 unchanged.

## New in 3.1: `MutualTlsSecurityScheme`

`SecurityScheme.type` gains `"mutualTLS"` as a valid value in 3.1 (verified
against the official schema — no additional required fields beyond `type`/
`description`). Added as `MutualTlsSecurityScheme` and included in the
`SecurityScheme` union.

## The Schema build-vs-depend decision

OpenAPI 3.1's Schema Object is, by design, a full JSON Schema 2020-12
document. Two options existed for modeling it:

1. **Hand-model a bounded, practical keyword set** (what's done here),
   matching exactly how `Swagger.Schema` (3.0) already works.
2. **Depend on an existing JSON Schema 2020-12 TypeScript type package**,
   getting a more complete/exhaustive model for free.

Chose (1), for three reasons:

- The official OAI schema itself doesn't bundle a rich Schema model into
  the envelope schema either — it deliberately defers to a separate
  dialect/meta-schema document (`{"$dynamicAnchor": "meta", "type":
  ["object", "boolean"]}` is the *entire* definition). A bounded, hand-
  modeled approach is consistent with how the spec's own authors chose to
  scope this, not a shortcut.
- Consistency: one mental model across `Swagger.Schema` and
  `SwaggerV31.Schema`, both maintained the same way.
- This library has zero type-only dependencies today; adding one for this
  would be a meaningfully bigger change than the rest of Phase 1.

`SwaggerV31.Schema` covers the same keyword set as `Swagger.Schema`,
adjusted for the changes listed above. It deliberately does **not** model:
`prefixItems`, `patternProperties` (at the Schema level), `if`/`then`/
`else`, `const`, `contains`/`minContains`/`maxContains`,
`unevaluatedProperties`, `dependentRequired`/`dependentSchemas`,
`$id`/`$anchor`/`$defs`, or a bare boolean as a whole Schema value. These
are real JSON Schema 2020-12 keywords a 3.1 document could legitimately
use — this is a known, documented gap, not a silent omission. Worth
revisiting if a real consumer needs one of them.
