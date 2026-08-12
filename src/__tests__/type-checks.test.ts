import { Swagger } from '../swagger';
import { SwaggerTypeChecks as TC } from '../type-checks';

describe('SwaggerTypeChecks', () => {
  describe('isPrimitiveType', () => {
    it('returns true for each primitive schema type', () => {
      expect(TC.isPrimitiveType('boolean')).toBe(true);
      expect(TC.isPrimitiveType('integer')).toBe(true);
      expect(TC.isPrimitiveType('number')).toBe(true);
      expect(TC.isPrimitiveType('string')).toBe(true);
    });

    it('returns false for non-primitive schema types', () => {
      expect(TC.isPrimitiveType('array')).toBe(false);
      expect(TC.isPrimitiveType('object')).toBe(false);
    });
  });

  describe('isMediaTypeWithExamples', () => {
    it('returns true when the media type has an examples map', () => {
      const mediaType: Swagger.MediaTypeWithExamples = { examples: {} };
      expect(TC.isMediaTypeWithExamples(mediaType)).toBe(true);
    });

    it('returns false when the media type only has a single example', () => {
      const mediaType: Swagger.MediaTypeWithExample = { example: 'foo' };
      expect(TC.isMediaTypeWithExamples(mediaType)).toBe(false);
    });
  });

  describe('isReference', () => {
    it('returns true for an object with a $ref key', () => {
      expect(TC.isReference({ $ref: '#/components/schemas/Foo' })).toBe(true);
    });

    it('returns false for an object without a $ref key', () => {
      expect(TC.isReference({ type: 'string' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isReference(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(TC.isReference(undefined)).toBe(false);
    });
  });

  describe('isParameterWithSchema', () => {
    it('returns true for a valid schema-based parameter', () => {
      const param = { name: 'id', in: 'path', schema: { type: 'string' } };
      expect(TC.isParameterWithSchema(param)).toBe(true);
    });

    it('returns false when a required key is missing', () => {
      expect(TC.isParameterWithSchema({ name: 'id', in: 'path' })).toBe(false);
    });

    it('returns false when an unrecognised key is present', () => {
      const param = { name: 'id', in: 'path', schema: { type: 'string' }, bogus: true };
      expect(TC.isParameterWithSchema(param)).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isParameterWithSchema(null)).toBe(false);
    });
  });

  describe('isParameterWithContent', () => {
    it('returns true for a valid content-based parameter', () => {
      const param = {
        name: 'id',
        in: 'query',
        content: { 'application/json': { schema: { type: 'string' } } }
      };
      expect(TC.isParameterWithContent(param)).toBe(true);
    });

    it('returns false when the required content key is missing', () => {
      expect(TC.isParameterWithContent({ name: 'id', in: 'query' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isParameterWithContent(null)).toBe(false);
    });
  });

  describe('isParameter', () => {
    it('returns true for a schema-based parameter', () => {
      expect(TC.isParameter({ name: 'id', in: 'path', schema: { type: 'string' } })).toBe(true);
    });

    it('returns true for a content-based parameter', () => {
      const param = { name: 'id', in: 'query', content: { 'application/json': { schema: {} } } };
      expect(TC.isParameter(param)).toBe(true);
    });

    it('returns false for neither shape', () => {
      expect(TC.isParameter({ name: 'id' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isParameter(null)).toBe(false);
    });
  });

  describe('isSchema', () => {
    it('returns true for a minimal valid schema', () => {
      expect(TC.isSchema({ type: 'string' })).toBe(true);
    });

    it('returns true for an empty object (no keys are required)', () => {
      expect(TC.isSchema({})).toBe(true);
    });

    it('ignores x- extension keys when matching', () => {
      expect(TC.isSchema({ type: 'string', 'x-custom': true })).toBe(true);
    });

    it('returns false when an unrecognised key is present', () => {
      expect(TC.isSchema({ type: 'string', bogus: true })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isSchema(null)).toBe(false);
    });
  });

  describe('isRequestBody', () => {
    it('returns true for a valid request body', () => {
      const body = { content: { 'application/json': { schema: { type: 'object' } } } };
      expect(TC.isRequestBody(body)).toBe(true);
    });

    it('returns false when the required content key is missing', () => {
      expect(TC.isRequestBody({ description: 'no content here' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isRequestBody(null)).toBe(false);
    });
  });

  describe('isExample', () => {
    it('returns true for a valid example', () => {
      expect(TC.isExample({ value: 'hi', summary: 'a greeting' })).toBe(true);
    });

    it('returns true for an empty object (no keys are required)', () => {
      expect(TC.isExample({})).toBe(true);
    });

    it('returns false when an unrecognised key is present', () => {
      expect(TC.isExample({ bogus: true })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isExample(null)).toBe(false);
    });
  });

  describe('isPathItem', () => {
    it('returns true for a valid path item', () => {
      expect(TC.isPathItem({ get: { responses: {} } })).toBe(true);
    });

    it('returns false when an unrecognised key is present', () => {
      expect(TC.isPathItem({ bogus: true })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isPathItem(null)).toBe(false);
    });
  });

  describe('isCallback', () => {
    it('returns true when every value is a valid path item', () => {
      const callback = { '{$request.body#/callbackUrl}': { post: { responses: {} } } };
      expect(TC.isCallback(callback)).toBe(true);
    });

    it('returns true for an empty object (vacuously, no keys to fail)', () => {
      expect(TC.isCallback({})).toBe(true);
    });

    it('returns false when a value is not a valid path item', () => {
      const callback = { '{$request.body#/callbackUrl}': { bogus: true } };
      expect(TC.isCallback(callback)).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isCallback(null)).toBe(false);
    });
  });

  describe('isHeaderWithSchema', () => {
    it('returns true for a valid schema-based header', () => {
      expect(TC.isHeaderWithSchema({ schema: { type: 'string' } })).toBe(true);
    });

    it('returns false when the required schema key is missing', () => {
      expect(TC.isHeaderWithSchema({ description: 'x' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isHeaderWithSchema(null)).toBe(false);
    });
  });

  describe('isHeaderWithContent', () => {
    it('returns true for a valid content-based header', () => {
      const header = { content: { 'application/json': { schema: { type: 'string' } } } };
      expect(TC.isHeaderWithContent(header)).toBe(true);
    });

    it('returns false when the required content key is missing', () => {
      expect(TC.isHeaderWithContent({})).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isHeaderWithContent(null)).toBe(false);
    });
  });

  describe('isHeader', () => {
    it('returns true for a schema-based header', () => {
      expect(TC.isHeader({ schema: { type: 'string' } })).toBe(true);
    });

    it('returns true for a content-based header', () => {
      const header = { content: { 'application/json': { schema: {} } } };
      expect(TC.isHeader(header)).toBe(true);
    });

    it('returns false for neither shape', () => {
      expect(TC.isHeader({ bogus: true })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isHeader(null)).toBe(false);
    });
  });

  describe('isLinkWithOperationRef', () => {
    it('returns true for a valid operationRef link', () => {
      expect(TC.isLinkWithOperationRef({ operationRef: '#/paths/~1foo/get' })).toBe(true);
    });

    it('returns true for an empty object (no keys are required)', () => {
      expect(TC.isLinkWithOperationRef({})).toBe(true);
    });

    it('returns false for an operationId-shaped link', () => {
      expect(TC.isLinkWithOperationRef({ operationId: 'getFoo' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isLinkWithOperationRef(null)).toBe(false);
    });
  });

  describe('isLinkWithOperationId', () => {
    it('returns true for a valid operationId link', () => {
      expect(TC.isLinkWithOperationId({ operationId: 'getFoo' })).toBe(true);
    });

    it('returns false for an operationRef-shaped link', () => {
      expect(TC.isLinkWithOperationId({ operationRef: '#/paths/~1foo/get' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isLinkWithOperationId(null)).toBe(false);
    });
  });

  describe('isLink', () => {
    it('returns true for either link shape', () => {
      expect(TC.isLink({ operationId: 'getFoo' })).toBe(true);
      expect(TC.isLink({ operationRef: '#/paths/~1foo/get' })).toBe(true);
    });

    it('returns false for an unrecognised shape', () => {
      expect(TC.isLink({ bogus: true })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isLink(null)).toBe(false);
    });
  });

  describe('isResponse', () => {
    it('returns true for a valid response', () => {
      expect(TC.isResponse({ description: 'OK' })).toBe(true);
    });

    it('returns false when the required description key is missing', () => {
      expect(TC.isResponse({})).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isResponse(null)).toBe(false);
    });
  });

  describe('isApiKeySecurityScheme', () => {
    it('returns true for a valid apiKey scheme', () => {
      const scheme = { type: 'apiKey', name: 'api_key', in: 'header' };
      expect(TC.isApiKeySecurityScheme(scheme)).toBe(true);
    });

    it('returns false when a required key is missing', () => {
      expect(TC.isApiKeySecurityScheme({ type: 'apiKey', name: 'api_key' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isApiKeySecurityScheme(null)).toBe(false);
    });
  });

  describe('isNonBearerHTTPSecurityScheme', () => {
    it('returns true for a non-bearer http scheme', () => {
      expect(TC.isNonBearerHTTPSecurityScheme({ type: 'http', scheme: 'basic' })).toBe(true);
    });

    it('returns false for a bearer http scheme', () => {
      expect(TC.isNonBearerHTTPSecurityScheme({ type: 'http', scheme: 'bearer' })).toBe(false);
    });

    it('returns false when a required key is missing', () => {
      expect(TC.isNonBearerHTTPSecurityScheme({ type: 'http' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isNonBearerHTTPSecurityScheme(null)).toBe(false);
    });
  });

  describe('isBearerHttpSecurityScheme', () => {
    it('returns true for a bearer http scheme', () => {
      expect(TC.isBearerHttpSecurityScheme({ type: 'http', scheme: 'bearer' })).toBe(true);
    });

    it('returns false for a non-bearer http scheme', () => {
      expect(TC.isBearerHttpSecurityScheme({ type: 'http', scheme: 'basic' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isBearerHttpSecurityScheme(null)).toBe(false);
    });
  });

  describe('isOAuth2SecurityScheme', () => {
    it('returns true for a valid oauth2 scheme', () => {
      expect(TC.isOAuth2SecurityScheme({ type: 'oauth2', flows: {} })).toBe(true);
    });

    it('returns false when the required flows key is missing', () => {
      expect(TC.isOAuth2SecurityScheme({ type: 'oauth2' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isOAuth2SecurityScheme(null)).toBe(false);
    });
  });

  describe('isOpenIdConnectSecurityScheme', () => {
    it('returns true for a valid openIdConnect scheme', () => {
      const scheme = { type: 'openIdConnect', openIdConnectUrl: 'https://example.com' };
      expect(TC.isOpenIdConnectSecurityScheme(scheme)).toBe(true);
    });

    it('returns false when the required openIdConnectUrl key is missing', () => {
      expect(TC.isOpenIdConnectSecurityScheme({ type: 'openIdConnect' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isOpenIdConnectSecurityScheme(null)).toBe(false);
    });
  });

  describe('isHttpSecurityScheme', () => {
    it('returns true for both bearer and non-bearer http schemes', () => {
      expect(TC.isHttpSecurityScheme({ type: 'http', scheme: 'bearer' })).toBe(true);
      expect(TC.isHttpSecurityScheme({ type: 'http', scheme: 'basic' })).toBe(true);
    });

    it('returns false for a non-http scheme', () => {
      const scheme = { type: 'apiKey', name: 'api_key', in: 'header' };
      expect(TC.isHttpSecurityScheme(scheme)).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isHttpSecurityScheme(null)).toBe(false);
    });
  });

  describe('isSecurityScheme', () => {
    it('returns true for each concrete security scheme kind', () => {
      expect(TC.isSecurityScheme({ type: 'apiKey', name: 'api_key', in: 'header' })).toBe(true);
      expect(TC.isSecurityScheme({ type: 'http', scheme: 'bearer' })).toBe(true);
      expect(TC.isSecurityScheme({ type: 'http', scheme: 'basic' })).toBe(true);
      expect(TC.isSecurityScheme({ type: 'oauth2', flows: {} })).toBe(true);
      expect(TC.isSecurityScheme({ type: 'openIdConnect', openIdConnectUrl: 'https://x' })).toBe(true);
    });

    it('returns false for an unrecognised shape', () => {
      expect(TC.isSecurityScheme({ type: 'bogus' })).toBe(false);
    });

    it('returns false for null instead of throwing', () => {
      expect(TC.isSecurityScheme(null)).toBe(false);
    });
  });

  describe('isPathParam', () => {
    it('returns true for a parameter with in: path', () => {
      const param: Swagger.ParameterWithSchemaWithExampleInPath = {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      };
      expect(TC.isPathParam(param)).toBe(true);
    });

    it('returns false for a parameter that is not in: path', () => {
      const param: Swagger.ParameterWithSchemaWithExampleInQuery = {
        name: 'q',
        in: 'query',
        schema: { type: 'string' }
      };
      expect(TC.isPathParam(param)).toBe(false);
    });
  });

  describe('isOAuth2Scopes / isOAuth2ScopesWithState', () => {
    const deprecatedStyle: Swagger.OAuth2Scopes = { deprecated: false, scopes: ['read'] };
    const stateStyle: Swagger.OAuth2ScopesWithState = { state: 'Current', scopes: ['read'] };

    it('isOAuth2Scopes distinguishes the deprecated-style shape', () => {
      expect(TC.isOAuth2Scopes(deprecatedStyle)).toBe(true);
      expect(TC.isOAuth2Scopes(stateStyle)).toBe(false);
    });

    it('isOAuth2ScopesWithState distinguishes the state-style shape', () => {
      expect(TC.isOAuth2ScopesWithState(stateStyle)).toBe(true);
      expect(TC.isOAuth2ScopesWithState(deprecatedStyle)).toBe(false);
    });

    it('isOAuth2ScopesArray checks every element', () => {
      expect(TC.isOAuth2ScopesArray([deprecatedStyle])).toBe(true);
      expect(TC.isOAuth2ScopesArray([stateStyle])).toBe(false);
    });

    it('isOAuth2ScopesWithStateArray checks every element', () => {
      expect(TC.isOAuth2ScopesWithStateArray([stateStyle])).toBe(true);
      expect(TC.isOAuth2ScopesWithStateArray([deprecatedStyle])).toBe(false);
    });
  });
});
