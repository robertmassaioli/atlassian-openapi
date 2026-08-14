import * as Generated from './swagger-v31-generated';
import { Swagger } from './swagger';

/**
 * This is the public `SwaggerV31` namespace, following the exact same
 * composition discipline `Swagger` (OpenAPI 3.0) does — see
 * `swagger-v31-generation-notes.md` for the itemized list of every
 * difference between the generated base and this file, and why each one
 * exists.
 *
 * The Atlassian extension types (`AtlassianNarrative`, `OAuth2Scopes`,
 * `XBearerType`, etc.) aren't OpenAPI-version-specific concepts, so they're
 * reused directly from `Swagger` rather than duplicated here.
 */
export namespace SwaggerV31 {
  // =======================================================================
  // Hand-maintained: types that touch Schema, Paths, or Responses (directly
  // or transitively), plus convenience types with no schema definition.
  // None of these are derived from swagger-v31-generated.ts — see
  // swagger-v31-generation-notes.md.
  // =======================================================================

  export type ParameterOrRef = Parameter | Reference;

  export type Method =
    | 'get'
    | 'put'
    | 'post'
    | 'delete'
    | 'options'
    | 'head'
    | 'patch'
    | 'trace';

  export type Parameter = ParameterWithSchema | ParameterWithContent;

  export type ParameterWithSchema =
    | ParameterWithSchemaWithExample
    | ParameterWithSchemaWithExamples;

  export type ParameterWithSchemaWithExample =
    | ParameterWithSchemaWithExampleInPath
    | ParameterWithSchemaWithExampleInQuery
    | ParameterWithSchemaWithExampleInHeader
    | ParameterWithSchemaWithExampleInCookie;

  export type ParameterWithSchemaWithExamples =
    | ParameterWithSchemaWithExamplesInPath
    | ParameterWithSchemaWithExamplesInQuery
    | ParameterWithSchemaWithExamplesInHeader
    | ParameterWithSchemaWithExamplesInCookie;

  export type ParameterWithContent =
    | ParameterWithContentInPath
    | ParameterWithContentNotInPath;

  export type MediaType = MediaTypeWithExample | MediaTypeWithExamples;

  export type Header = HeaderWithSchema | HeaderWithContent;

  export type HeaderWithSchema =
    | HeaderWithSchemaWithExample
    | HeaderWithSchemaWithExamples;

  export interface SwaggerV31 {
    openapi: string;
    info: Info;
    externalDocs?: ExternalDocumentation;
    servers?: Server[];
    security?: SecurityRequirement[];
    tags?: Tag[];
    /**
     * Optional in 3.1 (unlike 3.0) — a document can be webhooks-only or
     * components-only. The spec requires at least one of paths/webhooks/
     * components to be present; that cross-field constraint isn't
     * something a TS type can express, so it isn't enforced here.
     */
    paths?: Paths;
    webhooks?: {
      [name: string]: PathItem | Reference;
    };
    components?: Components;
    jsonSchemaDialect?: string;
    'x-atlassian-narrative'?: Swagger.AtlassianNarrative;
  }

  export interface PathItem {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: Operation;
    put?: Operation;
    post?: Operation;
    delete?: Operation;
    options?: Operation;
    head?: Operation;
    patch?: Operation;
    trace?: Operation;
    servers?: Server[];
    parameters?: ParameterOrRef[];
  }

  export interface Operation {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentation;
    operationId?: string;
    parameters?: ParameterOrRef[];
    requestBody?: RequestBody | Reference;
    responses: Responses;
    callbacks?: {
      [k: string]: Callback | Reference;
    };
    deprecated?: boolean;
    security?: SecurityRequirement[];
    servers?: Server[];
    'x-experimental'?: boolean;
    'x-preview'?: boolean;
    'x-atlassian-connect-scope'?: string;
    'x-atlassian-oauth2-scopes'?: Swagger.OAuth2Scopes[] | Swagger.OAuth2ScopesWithState[];
    'x-atlassian-data-security-policy'?: Swagger.DataSecurityPolicy[];
    'x-atlassian-auth-types'?: Swagger.AuthTypes[];
  }

  export interface ParameterWithSchemaWithExampleInPath {
    name: string;
    in: 'path';
    description?: string;
    required: true;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'matrix' | 'label' | 'simple';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }

  export type SchemaType =
    | 'array'
    | 'boolean'
    | 'integer'
    | 'number'
    | 'object'
    | 'string'
    | 'null';

  /**
   * OpenAPI 3.1's Schema Object is, by design, a full JSON Schema 2020-12
   * document — the official OAI schema itself doesn't model it richly
   * either (it just delegates to a separate dialect/meta-schema). This
   * hand-modeled version covers the same keyword set as `Swagger.Schema`
   * (3.0), adjusted for what actually changed:
   *
   *  - `nullable` is gone — `type` can now include `"null"` and can be an
   *    array (`type: ["string", "null"]`), not just a single value.
   *  - `exclusiveMinimum`/`exclusiveMaximum` are numbers, not booleans.
   *  - `examples` (array) joins `example` (singular).
   *
   * Deliberately NOT modeled: `prefixItems`, `patternProperties` (at the
   * Schema level — distinct from the envelope's own use of the term),
   * `if`/`then`/`else`, `const`, `contains`/`minContains`/`maxContains`,
   * `unevaluatedProperties`, `dependentRequired`/`dependentSchemas`,
   * `$id`/`$anchor`/`$defs`, and a bare boolean as a whole Schema value.
   * These are real JSON Schema 2020-12 keywords a 3.1 document could use;
   * they're left as a follow-up rather than depending on a full JSON
   * Schema 2020-12 type package for a first version of 3.1 support — see
   * swagger-v31-generation-notes.md for the reasoning.
   */
  export interface Schema {
    title?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: any[];
    type?: SchemaType | SchemaType[];
    not?: Schema | Reference;
    allOf?: (Schema | Reference)[];
    oneOf?: (Schema | Reference)[];
    anyOf?: (Schema | Reference)[];
    items?: Schema | Reference;
    properties?: {
      [k: string]: Schema | Reference;
    };
    additionalProperties?: Schema | Reference | boolean;
    description?: string;
    format?: string;
    default?: any;
    discriminator?: Discriminator;
    readOnly?: boolean;
    writeOnly?: boolean;
    example?: any;
    examples?: any[];
    externalDocs?: ExternalDocumentation;
    deprecated?: boolean;
    xml?: Xml;
  }

  export interface ParameterWithSchemaWithExampleInQuery {
    name: string;
    in: 'query';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
    'x-showInExample'?: boolean;
  }

  export interface ParameterWithSchemaWithExampleInHeader {
    name: string;
    in: 'header';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'simple';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }

  export interface ParameterWithSchemaWithExampleInCookie {
    name: string;
    in: 'cookie';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'form';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }

  export interface ParameterWithSchemaWithExamplesInPath {
    name: string;
    in: 'path';
    description?: string;
    required: true;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'matrix' | 'label' | 'simple';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }

  export interface ParameterWithSchemaWithExamplesInQuery {
    name: string;
    in: 'query';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
    'x-showInExample'?: boolean;
  }

  export interface ParameterWithSchemaWithExamplesInHeader {
    name: string;
    in: 'header';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'simple';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }

  export interface ParameterWithSchemaWithExamplesInCookie {
    name: string;
    in: 'cookie';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'form';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }

  export interface ParameterWithContentInPath {
    name: string;
    in: 'path';
    description?: string;
    required?: true;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    content: {
      [k: string]: MediaType;
    };
  }

  export interface MediaTypeWithExample {
    schema?: Schema | Reference;
    example?: any;
    encoding?: {
      [k: string]: Encoding;
    };
  }

  export interface Encoding {
    contentType?: string;
    headers?: {
      [k: string]: Header;
    };
    style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
    explode?: boolean;
    allowReserved?: boolean;
  }

  export interface HeaderWithSchemaWithExample {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'simple';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }

  export interface HeaderWithSchemaWithExamples {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'simple';
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }

  export interface HeaderWithContent {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    content: {
      [k: string]: MediaType;
    };
  }

  export interface MediaTypeWithExamples {
    schema?: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
    encoding?: {
      [k: string]: Encoding;
    };
  }

  export interface ParameterWithContentNotInPath {
    name: string;
    in: 'query' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    content: {
      [k: string]: MediaType;
    };
    'x-showInExample'?: boolean;
  }

  export interface RequestBody {
    description?: string;
    content: {
      [k: string]: MediaType;
    };
    required?: boolean;
  }

  export interface Paths {
    [path: string]: PathItem;
  }

  export interface Responses {
    [type: string]: Response | Reference;
  }

  export interface Response {
    description: string;
    headers?: {
      [k: string]: Header | Reference;
    };
    content?: {
      [k: string]: MediaType;
    };
    links?: {
      [k: string]: Link | Reference;
    };
  }

  export interface Callback {
    [k: string]: PathItem;
  }

  export interface Components {
    schemas?: {
      [k: string]: Schema | Reference;
    };
    responses?: {
      [k: string]: Response | Reference;
    };
    parameters?: {
      [k: string]: Parameter | Reference;
    };
    examples?: {
      [k: string]: Example | Reference;
    };
    requestBodies?: {
      [k: string]: RequestBody | Reference;
    };
    headers?: {
      [k: string]: Header | Reference;
    };
    securitySchemes?: {
      [k: string]: SecurityScheme | Reference;
    };
    links?: {
      [k: string]: Link | Reference;
    };
    callbacks?: {
      [k: string]: Callback | Reference;
    };
    /** New in 3.1 — a reusable, $ref-able bucket of named Path Item Objects. */
    pathItems?: {
      [k: string]: PathItem | Reference;
    };
  }

  // =======================================================================
  // Auto-derived: plain aliases to swagger-v31-generated.ts. These types
  // don't (transitively) reference Schema, Paths, or Responses, so the
  // generated shape is exactly right — including 5 renamed to match this
  // library's historical 3.0 casing for consistency (see
  // swagger-v31-generation-notes.md), and 2 that also gain an Atlassian
  // extension field. License picks up its new `identifier` field for free,
  // since it's a plain alias.
  // =======================================================================

  export type Info = Generated.Info;
  export type Contact = Generated.Contact;
  export type License = Generated.License;
  export type ExternalDocumentation = Generated.ExternalDocumentation;
  export type Server = Generated.Server;
  export type ServerVariable = Generated.ServerVariable;
  export type SecurityRequirement = Generated.SecurityRequirement;
  export type Tag = Generated.Tag;
  export type Reference = Generated.Reference;
  export type Discriminator = Generated.Discriminator;
  export type Xml = Generated.XML;
  export type Example = Generated.Example;
  export type Link = Generated.Link;
  export type LinkWithOperationRef = Generated.LinkWithOperationRef;
  export type LinkWithOperationId = Generated.LinkWithOperationId;
  export type OAuth2SecurityScheme = Generated.OAuth2SecurityScheme;
  export type OAuthFlows = Generated.OAuthFlows;
  export type ImplicitOAuthFlow = Generated.ImplicitOAuthFlow;
  export type PasswordOAuthFlow = Generated.PasswordOAuthFlow;
  export type ClientCredentialsFlow = Generated.ClientCredentialsFlow;
  export type AuthorizationCodeOAuthFlow = Generated.AuthorizationCodeOAuthFlow;
  export type OpenIdConnectSecurityScheme = Generated.OpenIdConnectSecurityScheme;
  export type NonBearerHttpSecurityScheme = Generated.NonBearerHTTPSecurityScheme;

  export type SecurityScheme =
    | ApiKeySecurityScheme
    | HttpSecurityScheme
    | MutualTlsSecurityScheme
    | OAuth2SecurityScheme
    | OpenIdConnectSecurityScheme;

  export type HttpSecurityScheme =
    | NonBearerHttpSecurityScheme
    | BearerHttpSecurityScheme;

  export interface ApiKeySecurityScheme extends Generated.APIKeySecurityScheme {
    'x-bearer-type'?: Swagger.XBearerType;
  }

  export interface BearerHttpSecurityScheme extends Generated.BearerHTTPSecurityScheme {
    'x-bearer-type'?: Swagger.XBearerType;
  }

  /** New in 3.1 — mutual TLS as a first-class security scheme type. */
  export interface MutualTlsSecurityScheme {
    type: 'mutualTLS';
    description?: string;
  }
}
