import * as Generated from './swagger-v3-generated';

/**
 * This is the public `Swagger` namespace. Its shape is composed from two
 * sources:
 *
 *  - `swagger-v3-generated.ts` — genuine, unedited json-schema-to-typescript
 *    output, regeneratable via `npm run generate:swagger-v3-base`. 27 of the
 *    ~61 types below are plain aliases to it.
 *  - Hand-maintained declarations below for everything else: the 34 types
 *    that (directly or transitively) touch `Schema`, `Paths`, or
 *    `Responses` — none of which the generator can produce correctly (see
 *    `swagger-v3-generation-notes.md` for exactly why) — plus Atlassian's
 *    own extensions and a couple of convenience types with no schema
 *    definition at all.
 *
 * See `swagger-v3-generation-notes.md` for the full itemized list of every
 * difference between the generated base and this file, and why each one
 * exists — that file is the checklist to work through whenever
 * `swagger-v3.json` changes upstream.
 */
export namespace Swagger {
  // =======================================================================
  // Hand-maintained: types that touch Schema, Paths, or Responses (directly
  // or transitively), plus Atlassian-only extensions and convenience types
  // with no schema definition. None of these are derived from
  // swagger-v3-generated.ts — see swagger-v3-generation-notes.md.
  // =======================================================================

  export type ParameterOrRef = Parameter | Reference;

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

  export interface SwaggerV3 {
    openapi: string;
    info: Info;
    externalDocs?: ExternalDocumentation;
    servers?: Server[];
    /**
     * A declaration of which security mechanisms can be used across the API. The list of values includes alternative
     * security requirement objects that can be used. Only one of the security requirement objects need to be satisfied
     * to authorize a request. Individual operations can override this definition.
     */
    security?: SecurityRequirement[];
    tags?: Tag[];
    paths: Paths;
    components?: Components;
    'x-atlassian-narrative'?: AtlassianNarrative;
  }

  export interface AtlassianNarrative {
    documents: NarrativeDocument[];
  }

  export interface NarrativeDocument {
    title: string;
    anchor: string;
    body: string;
  }

  export type Method =
    | 'get'
    | 'put'
    | 'post'
    | 'delete'
    | 'options'
    | 'head'
    | 'patch'
    | 'trace';

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

  /**
   * New OAuth2 scopes
   * @see https://hello.atlassian.net/wiki/spaces/redfox/pages/1046875420/RFC+OAuth+scopes+deprecation+in+Jira+-+DAC
   */
  export interface OAuth2Scopes {
    deprecated: boolean;
    scopes: string[];
    documentation?: string;
  }

  /**
   * OAuth2 scopes with scope's state
   * @see https://hello.atlassian.net/wiki/spaces/redfox/pages/1304762888/OpenAPI+-+DAC+contract
   */
  export interface OAuth2ScopesWithState {
    state: OAuth2ScopesState;
    scopes: string[];
    scheme?: string;
    documentation?: string;
  }

  export type OAuth2ScopesState = 'Current' | 'Deprecated' | 'Beta';

  /**
   * Data Security Policy for App Access
   * @see https://hello.atlassian.net/wiki/spaces/ECOTRUST/pages/3047963369/DACI+-+Swagger+OpenAPI+custom+property+for+app+access
   */
  export interface DataSecurityPolicy {
    'app-access-rule-exempt': boolean;
  }

  /**
   * custom extension required to render scope title in dac based on scope type
   *
   * api-token - Authentication with API Tokens
   *
   * repository-access-token - Authentication with repository access token
   *
   * project-access-token - Authentication with project access token
   *
   * workspace-access-token - Authentication with workspace access token
   *
   * identity-oauth2 - Authentication with platform OAuth2
   *
   * forge-oauth2 - Authentication with platform OAuth2 for Forge apps
   *
   * @see https://hello.atlassian.net/wiki/spaces/BB/pages/4484370299/Add+API+Token+scopes+to+bitbucket+documentation
   */
  export type AuthTypes =
    | 'api-token'
    | 'repository-access-token'
    | 'project-access-token'
    | 'workspace-access-token'
    | 'identity-oauth2'
    | 'forge-oauth2';

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
    /**
     * A declaration of which security mechanisms can be used for this operation. The list of values includes alternative
     * security requirement objects that can be used. Only one of the security requirement objects need to be satisfied
     * to authorize a request. This definition overrides any declared top-level security. To remove a top-level security
     * declaration, an empty array can be used.
     */
    security?: SecurityRequirement[];
    servers?: Server[];
    'x-experimental'?: boolean;
    'x-preview'?: boolean;
    'x-atlassian-connect-scope'?: string;
    'x-atlassian-oauth2-scopes'?: OAuth2Scopes[] | OAuth2ScopesWithState[];
    'x-atlassian-data-security-policy'?: DataSecurityPolicy[];
    'x-atlassian-auth-types'?: AuthTypes[];
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
    | 'string';

  export interface Schema {
    title?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
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
    type?: SchemaType;
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
    nullable?: boolean;
    discriminator?: Discriminator;
    readOnly?: boolean;
    writeOnly?: boolean;
    example?: any;
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
  }

  // =======================================================================
  // Auto-derived: plain aliases to swagger-v3-generated.ts. These types
  // don't (transitively) reference Schema, Paths, or Responses, so the
  // generated shape is exactly right — including 5 that are renamed here
  // to match this library's historical casing (see
  // swagger-v3-generation-notes.md), and 2 (ApiKeySecurityScheme,
  // BearerHttpSecurityScheme) that also gain an Atlassian extension field.
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
    | OAuth2SecurityScheme
    | OpenIdConnectSecurityScheme;

  export type HttpSecurityScheme =
    | NonBearerHttpSecurityScheme
    | BearerHttpSecurityScheme;

  export interface ApiKeySecurityScheme extends Generated.APIKeySecurityScheme {
    'x-bearer-type'?: XBearerType;
  }

  export interface BearerHttpSecurityScheme extends Generated.BearerHTTPSecurityScheme {
    'x-bearer-type'?: XBearerType;
  }

  export type XBearerType = XBearerTypeAsap | XBearerTypeSLAUTH;

  export interface XBearerTypeAsap {
    type: 'asap';
  }

  export interface XBearerTypeSLAUTH {
    type: 'slauth';
    audience: string;
    defaultSlauthEnvironment?: string;
  }
}
