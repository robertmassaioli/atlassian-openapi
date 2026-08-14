# swagger-v3-generated.ts: generation notes

`swagger-v3-generated.ts` is produced by:

```
npm run generate:swagger-v3-base
```

which runs:

```
json2ts -i swagger-v3.json -o src/swagger-v3-generated.ts --unreachableDefinitions --style.singleQuote --no-unknownAny
```

It is never hand-edited. `swagger.ts` composes it into the actual public
`Swagger` namespace, adding Atlassian-specific extensions and a handful of
naming/typing refinements that predate this split and are being preserved
for backward compatibility. This file is the itemized record of exactly
what that composition does and why, produced by a full structural diff
against the raw tool output (2026-08-14) — use it as the checklist when
reconciling after a future `swagger-v3.json` change.

## Renamed types (public name kept, generated name aliased)

The schema's own `definitions` keys use different casing than the public
API does. These are pure aliases — no shape change:

| Generated (raw schema casing) | Public (`Swagger.*`) |
|---|---|
| `APIKeySecurityScheme` | `ApiKeySecurityScheme` |
| `HTTPSecurityScheme` | `HttpSecurityScheme` |
| `NonBearerHTTPSecurityScheme` | `NonBearerHttpSecurityScheme` |
| `BearerHTTPSecurityScheme` | `BearerHttpSecurityScheme` |
| `XML` | `Xml` |

## Convenience types with no schema definition at all

Not derived from `swagger-v3.json` — always hand-declared:

- `ParameterOrRef` (`= Parameter | Reference`)
- `Method` (the `"get" | "put" | ... | "trace"` union)

## Atlassian extensions — new fields added to generated interfaces

Each of these is `interface X extends Generated.Y { ...new fields... }`:

| Public interface | Generated base | Added fields |
|---|---|---|
| `SwaggerV3` | `SwaggerV3` | `"x-atlassian-narrative"?: AtlassianNarrative` |
| `Operation` | `Operation` | `"x-experimental"`, `"x-preview"`, `"x-atlassian-connect-scope"`, `"x-atlassian-oauth2-scopes"`, `"x-atlassian-data-security-policy"`, `"x-atlassian-auth-types"` |
| `ApiKeySecurityScheme` | `APIKeySecurityScheme` | `"x-bearer-type"?: XBearerType` |
| `BearerHttpSecurityScheme` | `BearerHTTPSecurityScheme` | `"x-bearer-type"?: XBearerType` |
| `ParameterWithSchemaWithExampleInQuery` | (same name) | `"x-showInExample"?: boolean` |
| `ParameterWithSchemaWithExamplesInQuery` | (same name) | `"x-showInExample"?: boolean` |
| `ParameterWithContentNotInPath` | (same name) | `"x-showInExample"?: boolean` |

## Atlassian-only types with no schema definition at all

Always hand-declared, never derived: `AtlassianNarrative`,
`NarrativeDocument`, `OAuth2Scopes`, `OAuth2ScopesWithState`,
`OAuth2ScopesState`, `DataSecurityPolicy`, `AuthTypes`, `XBearerType`,
`XBearerTypeAsap`, `XBearerTypeSLAUTH`.

## Interfaces that cannot be derived from the generated output at all

`json-schema-to-typescript` has two known limitations that make these three
interfaces come out wrong (not just differently-shaped) if generated
naively — they are fully hand-declared in `swagger.ts`, matching the
public shape exactly, and not connected to `swagger-v3-generated.ts` at all:

- **`Schema`** — `required` and `enum` both have `minItems: 1` in the
  schema, which the tool renders as tuple types (`[string, ...string[]]`)
  rather than `string[]`. Verified by direct `tsc` test: a tuple type
  cannot be widened back to a plain array through `extends` — it's a hard
  compile error, not a style choice. Public shape keeps `required?:
  string[]` / `enum?: any[]`.
- **`Paths`** — the schema expresses `paths` via `patternProperties: {
  "^\/": ... }` rather than `additionalProperties`. The tool cannot
  translate `patternProperties` into a TS index signature at all; fresh
  output is a literally empty `{}`. Public shape keeps `[path: string]:
  PathItem`.
- **`Responses`** — same `patternProperties` limitation (pattern
  `[1-5](?:\d{2}|XX)` for HTTP status codes). Fresh output is `{ default?:
  Response | Reference }`, missing every actual status-code key. Public
  shape keeps `[type: string]: Response | Reference`.

If `swagger-v3.json` changes any of these three definitions, the change
has to be applied to `swagger.ts`'s hand-declared version by reading the
diff — it will not show up automatically via the generated file.

## Everything else

Every other interface/type is a plain alias (`export type X =
Generated.X;`) — same fields, same types, no changes. They additionally
gain a widened `[k: string]: any` index signature from the generated file
(the schema's `patternProperties: {"^x-": {}}` + `additionalProperties:
false` combination isn't precisely representable in TS, so the tool falls
back to allowing any string key). This is a backward-compatible widening,
not a narrowing — anything that satisfied the old, more specific shape
still satisfies the new one — verified by the full existing test suite
passing unchanged.
