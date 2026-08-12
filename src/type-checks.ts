import { Swagger as S, Swagger } from './swagger';

export namespace SwaggerTypeChecks {
  export function isPrimitiveType(t: S.SchemaType): boolean {
    return t === 'boolean' || t === 'integer' || t === 'number' || t === 'string';
  }

  export function isMediaTypeWithExamples(t: S.MediaType): t is S.MediaTypeWithExamples {
    return 'examples' in t;
  }

  function matchesObjectShape<T>(o: any, allKeys: Set<string>, requiredKeys?: string[]): o is T {
    if (typeof o !== 'object' || o === null) {
      return false;
    }

    const nonExtensionKeys = removeExtensions(Object.keys(o));

    const keysMatch = nonExtensionKeys.every(key => allKeys.has(key));
    const hasRequiredKeys =
    typeof requiredKeys === 'undefined' ||
    requiredKeys.every(rk => !!nonExtensionKeys.find(k => k === rk));

    return keysMatch && hasRequiredKeys;
  }

  const parameterWithSchemaRequiredKeys: string[] = [
    'name',
    'in',
    'schema'
  ];

  const parameterWithSchemaOptionalKeys: string[] = [
    'description',
    'deprecated',
    'allowEmptyValue',
    'required',
    'style',
    'explode',
    'allowReserved',
    'example',
    'examples'
  ];

  const parameterWithContentRequiredKeys: string[] = [
    'name',
    'in',
    'content'
  ];

  const parameterWithContentOptionalKeys: string[] = [
    'description',
    'required',
    'deprecated',
    'allowEmptyValue'
  ];

  export function isParameter(p: any): p is S.Parameter {
    return isParameterWithSchema(p) || isParameterWithContent(p);
  }

  export function isParameterWithSchema(p: any): p is S.ParameterWithSchema {
    if (typeof p !== 'object' || p === null) {
      return false;
    }

    const nonExtensionKeys = removeExtensions(Object.keys(p));
    const isParameterWithSchemaKey = (key: string) =>
    !!parameterWithSchemaRequiredKeys.find(k => k === key) ||
    !!parameterWithSchemaOptionalKeys.find(k => k === key);

    const keysMatch = nonExtensionKeys.every(isParameterWithSchemaKey);
    const requiredKeysPresent = parameterWithSchemaRequiredKeys.every(key => !!nonExtensionKeys.find(k => k === key));

    return keysMatch && requiredKeysPresent;
  }

  export function isParameterWithContent(p: any): p is S.ParameterWithContent {
    if (typeof p !== 'object' || p === null) {
      return false;
    }

    const nonExtensionKeys = removeExtensions(Object.keys(p));
    const isParameterWithSchemaKey = (key: string) =>
    !!parameterWithContentRequiredKeys.find(k => k === key) ||
    !!parameterWithContentOptionalKeys.find(k => k === key);

    const keysMatch = nonExtensionKeys.every(isParameterWithSchemaKey);
    const requiredKeysPresent = parameterWithContentRequiredKeys.every(key => !!nonExtensionKeys.find(k => k === key));

    return keysMatch && requiredKeysPresent;
  }

  export function isReference(s: any): s is S.Reference {
    return typeof s === 'object' && s !== null && '$ref' in s;
  }

  const schemaStandardKeys: Set<string> = new Set([
    'title',
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxProperties',
    'minProperties',
    'required',
    'enum',
    'type',
    'not',
    'allOf',
    'oneOf',
    'anyOf',
    'items',
    'properties',
    'additionalProperties',
    'description',
    'format',
    'default',
    'nullable',
    'discriminator',
    'readOnly',
    'writeOnly',
    'example',
    'externalDocs',
    'deprecated',
    'xml'
  ]);

  function removeExtensions(keys: string[]): string[] {
    return keys.filter(k => !k.startsWith('x-'));
  }

  export function isSchema(s: any): s is S.Schema {
    return matchesObjectShape<S.Schema>(s, schemaStandardKeys);
  }

  const requestBodyKeys = new Set([
    'description',
    'content',
    'required'
  ]);

  const requiredRequestBodyKeys = [
    'content'
  ];

  export function isRequestBody(b: any): b is S.RequestBody {
    return matchesObjectShape<S.RequestBody>(b, requestBodyKeys, requiredRequestBodyKeys);
  }

  const optionalExampleKeys = new Set([
    'summary',
    'description',
    'value',
    'externalValue'
  ]);

  export function isExample(e: any): e is S.Example {
    return matchesObjectShape(e, optionalExampleKeys);
  }

  const optionalPathItemKeys = new Set([
    '$ref',
    'summary',
    'description',
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
    'servers',
    'parameters'
  ]);

  export function isPathItem(o: any): o is S.PathItem {
    return matchesObjectShape<S.PathItem>(o, optionalPathItemKeys);
  }

  export function isCallback(o: any): o is S.Callback {
    if (typeof o !== 'object' || o === null) {
      return false;
    }

    // Every key in the object must point to a path-item
    const nonExtensionKeys = removeExtensions(Object.keys(o));
    return nonExtensionKeys.every(key => isPathItem(o[key]));
  }

  const headerWithSchemaKeys = new Set([
    'description',
    'required',
    'deprecated',
    'allowEmptyValue',
    'style',
    'explode',
    'allowReserved',
    'schema',
    'example',
    'examples'
  ]);

  const headerWithSchemaRequiredKeys = [
    'schema'
  ];

  export function isHeaderWithSchema(o: any): o is S.HeaderWithSchema {
    return matchesObjectShape<S.HeaderWithSchema>(o, headerWithSchemaKeys, headerWithSchemaRequiredKeys);
  }

  const headerWithContentKeys = new Set([
    'description',
    'required',
    'deprecated',
    'allowEmptyValue',
    'content'
  ]);

  const headerWithContentRequiredKeys = [
    'content'
  ];

  export function isHeaderWithContent(o: any): o is S.HeaderWithContent {
    return matchesObjectShape<S.HeaderWithContent>(o, headerWithContentKeys, headerWithContentRequiredKeys);
  }

  export function isHeader(o: any): o is S.Header {
    return isHeaderWithSchema(o) || isHeaderWithContent(o);
  }

  const optionalLinkWithOperationRefKeys = new Set([
    'operationRef',
    'parameters',
    'requestBody',
    'description',
    'server'
  ]);

  export function isLinkWithOperationRef(o: any): o is S.LinkWithOperationRef {
    return matchesObjectShape<S.LinkWithOperationRef>(o, optionalLinkWithOperationRefKeys);
  }

  const optionalLinkWithOperationIdKeys = new Set([
    'operationId',
    'parameters',
    'requestBody',
    'description',
    'server'
  ]);

  export function isLinkWithOperationId(o: any): o is S.LinkWithOperationId {
    return matchesObjectShape<S.LinkWithOperationId>(o, optionalLinkWithOperationIdKeys);
  }

  export function isLink(o: any): o is S.Link {
    return isLinkWithOperationId(o) || isLinkWithOperationRef(o);
  }

  const responseKeys = new Set([
    'description',
    'headers',
    'content',
    'links'
  ]);

  const requiredResponseKeys = [
    'description'
  ];

  export function isResponse(o: any): o is S.Response {
    return matchesObjectShape<S.Response>(o, responseKeys, requiredResponseKeys);
  }

  const apiKeySecuritySchemeKeys = new Set([
    'type',
    'name',
    'in',
    'description'
  ]);

  const apiKeySecuritySchemeRequiredKeys = [
    'type',
    'name',
    'in'
  ];

  export function isApiKeySecurityScheme(o: any): o is S.ApiKeySecurityScheme {
    return matchesObjectShape<S.SecurityScheme>(o, apiKeySecuritySchemeKeys, apiKeySecuritySchemeRequiredKeys);
  }

  const nonBearerHttpSecuritySchemeKeys = new Set([
    'scheme',
    'description',
    'type'
  ]);

  const nonBearerHttpSecuritySchemeRequiredKeys = [
    'scheme',
    'type'
  ];

  export function isNonBearerHTTPSecurityScheme(o: any): o is S.NonBearerHttpSecurityScheme {
    return matchesObjectShape<S.NonBearerHttpSecurityScheme>(
      o,
      nonBearerHttpSecuritySchemeKeys,
      nonBearerHttpSecuritySchemeRequiredKeys
    ) && o.scheme !== 'bearer';
  }

  const bearerHttpSecuritySchemeKeys = new Set([
    'scheme',
    'bearerFormat',
    'type',
    'description'
  ]);

  const bearerHttpSecuritySchemeRequiredKeys = [
    'type',
    'scheme'
  ];

  export function isBearerHttpSecurityScheme(o: any): o is S.BearerHttpSecurityScheme {
    return matchesObjectShape<S.BearerHttpSecurityScheme>(
      o,
      bearerHttpSecuritySchemeKeys,
      bearerHttpSecuritySchemeRequiredKeys
    ) && o.scheme === 'bearer';
  }

  const oauth2SecuritySchemeKeys = new Set([
    'type',
    'flows',
    'description'
  ]);

  const oauth2SecuritySchemeRequiredKeys = [
    'type',
    'flows'
  ];

  export function isOAuth2SecurityScheme(o: any): o is S.OAuth2SecurityScheme {
    return matchesObjectShape<S.OAuth2SecurityScheme>(
      o,
      oauth2SecuritySchemeKeys,
      oauth2SecuritySchemeRequiredKeys
    );
  }

  const openIdConnectSecuritySchemeKeys = new Set([
    'type',
    'openIdConnectUrl',
    'description'
  ]);

  const openIdConnectSecuritySchemeRequiredKeys = [
    'type',
    'openIdConnectUrl'
  ];

  export function isOpenIdConnectSecurityScheme(o: any): o is S.OpenIdConnectSecurityScheme {
    return matchesObjectShape<S.OpenIdConnectSecurityScheme>(
      o,
      openIdConnectSecuritySchemeKeys,
      openIdConnectSecuritySchemeRequiredKeys
    );
  }

  export function isHttpSecurityScheme(o: any): o is S.HttpSecurityScheme {
    return isBearerHttpSecurityScheme(o) || isNonBearerHTTPSecurityScheme(o);
  }

  export function isSecurityScheme(o: any): o is S.SecurityScheme {
    return isApiKeySecurityScheme(o)
    || isBearerHttpSecurityScheme(o)
    || isNonBearerHTTPSecurityScheme(o)
    || isOAuth2SecurityScheme(o)
    || isOpenIdConnectSecurityScheme(o);
  }

  export function isPathParam(p: Swagger.Parameter): p is (
    Swagger.ParameterWithSchemaWithExampleInPath |
    Swagger.ParameterWithSchemaWithExamplesInPath |
    Swagger.ParameterWithContentInPath
    ) {
    return p.in === 'path';
  }
  export function isOAuth2ScopesArray(o: NonNullable<Swagger.Operation['x-atlassian-oauth2-scopes']>): o is Array<Swagger.OAuth2Scopes> {
    return o.every(isOAuth2Scopes);
  }
  export function isOAuth2ScopesWithStateArray(o: NonNullable<Swagger.Operation['x-atlassian-oauth2-scopes']>): o is Array<Swagger.OAuth2ScopesWithState> {
    return o.every(isOAuth2ScopesWithState);
  }
  export function isOAuth2Scopes(o: Swagger.OAuth2Scopes | Swagger.OAuth2ScopesWithState): o is Swagger.OAuth2Scopes {
    return 'deprecated' in o;
  }
  export function isOAuth2ScopesWithState(o: Swagger.OAuth2Scopes | Swagger.OAuth2ScopesWithState): o is Swagger.OAuth2ScopesWithState {
    return 'state' in o;
  }

}
