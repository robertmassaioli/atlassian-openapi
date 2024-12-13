export namespace Swagger {
  /* tslint:disable */
  /**
   * This file was automatically generated by json-schema-to-typescript.
   * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
   * and run json-schema-to-typescript to regenerate this file.
   */

  export type ParameterOrRef = Parameter | Reference;

  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Parameter".
   */
  export type Parameter = ParameterWithSchema | ParameterWithContent;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchema".
   */
  export type ParameterWithSchema =
    | ParameterWithSchemaWithExample
    | ParameterWithSchemaWithExamples;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExample".
   */
  export type ParameterWithSchemaWithExample =
    | ParameterWithSchemaWithExampleInPath
    | ParameterWithSchemaWithExampleInQuery
    | ParameterWithSchemaWithExampleInHeader
    | ParameterWithSchemaWithExampleInCookie;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExamples".
   */
  export type ParameterWithSchemaWithExamples =
    | ParameterWithSchemaWithExamplesInPath
    | ParameterWithSchemaWithExamplesInQuery
    | ParameterWithSchemaWithExamplesInHeader
    | ParameterWithSchemaWithExamplesInCookie;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithContent".
   */
  export type ParameterWithContent =
    | ParameterWithContentInPath
    | ParameterWithContentNotInPath;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "MediaType".
   */
  export type MediaType = MediaTypeWithExample | MediaTypeWithExamples;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Header".
   */
  export type Header = HeaderWithSchema | HeaderWithContent;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "HeaderWithSchema".
   */
  export type HeaderWithSchema =
    | HeaderWithSchemaWithExample
    | HeaderWithSchemaWithExamples;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Link".
   */
  export type Link = LinkWithOperationRef | LinkWithOperationId;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "SecurityScheme".
   */
  export type SecurityScheme =
    | ApiKeySecurityScheme
    | HttpSecurityScheme
    | OAuth2SecurityScheme
    | OpenIdConnectSecurityScheme;
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "HTTPSecurityScheme".
   */
  export type HttpSecurityScheme =
    | NonBearerHttpSecurityScheme
    | BearerHttpSecurityScheme;

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
    "x-atlassian-narrative"?: AtlassianNarrative;
  }

  export interface AtlassianNarrative {
    documents: NarrativeDocument[];
  }

  export interface NarrativeDocument {
    title: string;
    anchor: string;
    body: string;
  }

  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Info".
   */
  export interface Info {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: Contact;
    license?: License;
    version: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Contact".
   */
  export interface Contact {
    name?: string;
    url?: string;
    email?: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "License".
   */
  export interface License {
    name: string;
    url?: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ExternalDocumentation".
   */
  export interface ExternalDocumentation {
    description?: string;
    url: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Server".
   */
  export interface Server {
    url: string;
    description?: string;
    variables?: {
      [k: string]: ServerVariable;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ServerVariable".
   */
  export interface ServerVariable {
    enum?: string[];
    default: string;
    description?: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "SecurityRequirement".
   *
   * If the security scheme is of type "oauth2" or "openIdConnect",
   * then the value is a list of scope names required for the execution.
   * For other security scheme types, the array MUST be empty.
   *
   * Lists the required security schemes to execute this operation. The name used for each property MUST correspond
   * to a security scheme declared in the Security Schemes under the Components Object.
   *
   * Security Requirement Objects that contain multiple schemes require that all schemes MUST be satisfied for a
   * request to be authorized. This enables support for scenarios where multiple query parameters or HTTP headers
   * are required to convey security information.
   *
   * When a list of Security Requirement Objects is defined on the Open API object or Operation Object, only
   * one of Security Requirement Objects in the list needs to be satisfied to authorize the request.
   */
  export interface SecurityRequirement {
    [k: string]: string[];
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Tag".
   */
  export interface Tag {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentation;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Paths".
   */
  export interface Paths {
    [path: string]: PathItem;
  }
  export type Method =
    | "get"
    | "put"
    | "post"
    | "delete"
    | "options"
    | "head"
    | "patch"
    | "trace";
  /**
   * This interface was referenced by `Paths`'s JSON-Schema definition
   * via the `patternProperty` "^\/".
   *
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "PathItem".
   */
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

  export type OAuth2ScopesState = "Current" | "Deprecated" | "Beta";

  /**
   * Data Security Policy for App Access
   * @see https://hello.atlassian.net/wiki/spaces/ECOTRUST/pages/3047963369/DACI+-+Swagger+OpenAPI+custom+property+for+app+access
   */
  export interface DataSecurityPolicy {
    "app-access-rule-exempt": boolean;
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
    | "api-token"
    | "repository-access-token"
    | "project-access-token"
    | "workspace-access-token"
    | "identity-oauth2"
    | "forge-oauth2";

  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Operation".
   */
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
    "x-experimental"?: boolean;
    "x-preview"?: boolean;
    "x-atlassian-connect-scope"?: string;
    "x-atlassian-oauth2-scopes"?: OAuth2Scopes[] | OAuth2ScopesWithState[];
    "x-atlassian-data-security-policy"?: DataSecurityPolicy[];
    "x-atlassian-auth-type"?: AuthTypes[];
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExampleInPath".
   */
  export interface ParameterWithSchemaWithExampleInPath {
    name: string;
    in: "path";
    description?: string;
    required: true;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "matrix" | "label" | "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }

  export type SchemaType =
    | "array"
    | "boolean"
    | "integer"
    | "number"
    | "object"
    | "string";

  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Schema".
   */
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
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Reference".
   */
  export interface Reference {
    $ref: string;
    [k: string]: any;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Discriminator".
   */
  export interface Discriminator {
    propertyName: string;
    mapping?: {
      [k: string]: string;
    };
    [k: string]: any;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "XML".
   */
  export interface Xml {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExampleInQuery".
   */
  export interface ParameterWithSchemaWithExampleInQuery {
    name: string;
    in: "query";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
    "x-showInExample"?: boolean;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExampleInHeader".
   */
  export interface ParameterWithSchemaWithExampleInHeader {
    name: string;
    in: "header";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExampleInCookie".
   */
  export interface ParameterWithSchemaWithExampleInCookie {
    name: string;
    in: "cookie";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "form";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExamplesInPath".
   */
  export interface ParameterWithSchemaWithExamplesInPath {
    name: string;
    in: "path";
    description?: string;
    required: true;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "matrix" | "label" | "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Example".
   */
  export interface Example {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExamplesInQuery".
   */
  export interface ParameterWithSchemaWithExamplesInQuery {
    name: string;
    in: "query";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
    "x-showInExample"?: boolean;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExamplesInHeader".
   */
  export interface ParameterWithSchemaWithExamplesInHeader {
    name: string;
    in: "header";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithSchemaWithExamplesInCookie".
   */
  export interface ParameterWithSchemaWithExamplesInCookie {
    name: string;
    in: "cookie";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "form";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithContentInPath".
   */
  export interface ParameterWithContentInPath {
    name: string;
    in: "path";
    description?: string;
    required?: true;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    content: {
      [k: string]: MediaType;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "MediaTypeWithExample".
   */
  export interface MediaTypeWithExample {
    schema?: Schema | Reference;
    example?: any;
    encoding?: {
      [k: string]: Encoding;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Encoding".
   */
  export interface Encoding {
    contentType?: string;
    headers?: {
      [k: string]: Header;
    };
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    explode?: boolean;
    allowReserved?: boolean;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "HeaderWithSchemaWithExample".
   */
  export interface HeaderWithSchemaWithExample {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    example?: any;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "HeaderWithSchemaWithExamples".
   */
  export interface HeaderWithSchemaWithExamples {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "HeaderWithContent".
   */
  export interface HeaderWithContent {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    content: {
      [k: string]: MediaType;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "MediaTypeWithExamples".
   */
  export interface MediaTypeWithExamples {
    schema?: Schema | Reference;
    examples: {
      [k: string]: Example | Reference;
    };
    encoding?: {
      [k: string]: Encoding;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ParameterWithContentNotInPath".
   */
  export interface ParameterWithContentNotInPath {
    name: string;
    in: "query" | "header" | "cookie";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    content: {
      [k: string]: MediaType;
    };
    "x-showInExample"?: boolean;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "RequestBody".
   */
  export interface RequestBody {
    description?: string;
    content: {
      [k: string]: MediaType;
    };
    required?: boolean;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Responses".
   */
  export interface Responses {
    [type: string]: Response | Reference;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Response".
   */
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
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "LinkWithOperationRef".
   */
  export interface LinkWithOperationRef {
    operationRef?: string;
    parameters?: {
      [k: string]: any;
    };
    requestBody?: any;
    description?: string;
    server?: Server;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "LinkWithOperationId".
   */
  export interface LinkWithOperationId {
    operationId?: string;
    parameters?: {
      [k: string]: any;
    };
    requestBody?: any;
    description?: string;
    server?: Server;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Callback".
   */
  export interface Callback {
    [k: string]: PathItem;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "Components".
   */
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
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "APIKeySecurityScheme".
   */
  export interface ApiKeySecurityScheme {
    type: "apiKey";
    name: string;
    in: "header" | "query" | "cookie";
    description?: string;
    "x-bearer-type"?: XBearerType;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "NonBearerHTTPSecurityScheme".
   */
  export interface NonBearerHttpSecurityScheme {
    scheme: string;
    description?: string;
    type: "http";
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "BearerHTTPSecurityScheme".
   */
  export interface BearerHttpSecurityScheme {
    scheme: "bearer";
    bearerFormat?: string;
    type: "http";
    description?: string;
    "x-bearer-type"?: XBearerType;
  }

  export type XBearerType = XBearerTypeAsap | XBearerTypeSLAUTH;

  export interface XBearerTypeAsap {
    type: "asap";
  }

  export interface XBearerTypeSLAUTH {
    type: "slauth";
    audience: string;
    defaultSlauthEnvironment?: string;
  }

  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "OAuth2SecurityScheme".
   */
  export interface OAuth2SecurityScheme {
    type: "oauth2";
    flows: OAuthFlows;
    description?: string;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "OAuthFlows".
   */
  export interface OAuthFlows {
    implicit?: ImplicitOAuthFlow;
    password?: PasswordOAuthFlow;
    clientCredentials?: ClientCredentialsFlow;
    authorizationCode?: AuthorizationCodeOAuthFlow;
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ImplicitOAuthFlow".
   */
  export interface ImplicitOAuthFlow {
    authorizationUrl: string;
    refreshUrl?: string;
    scopes: {
      [k: string]: string;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "PasswordOAuthFlow".
   */
  export interface PasswordOAuthFlow {
    tokenUrl: string;
    refreshUrl?: string;
    scopes?: {
      [k: string]: string;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "ClientCredentialsFlow".
   */
  export interface ClientCredentialsFlow {
    tokenUrl: string;
    refreshUrl?: string;
    scopes?: {
      [k: string]: string;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "AuthorizationCodeOAuthFlow".
   */
  export interface AuthorizationCodeOAuthFlow {
    authorizationUrl: string;
    tokenUrl: string;
    refreshUrl?: string;
    scopes?: {
      [k: string]: string;
    };
  }
  /**
   * This interface was referenced by `SwaggerV3`'s JSON-Schema
   * via the `definition` "OpenIdConnectSecurityScheme".
   */
  export interface OpenIdConnectSecurityScheme {
    type: "openIdConnect";
    openIdConnectUrl: string;
    description?: string;
  }
}
