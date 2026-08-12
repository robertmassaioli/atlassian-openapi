import { Swagger } from '../swagger';
import { SwaggerLookup } from '../lookup';
import { pathsToOAS } from './test-functions';

type TestCase<A> = {
  openapi: Swagger.SwaggerV3;
  runLookup: (v: A | Swagger.Reference) => A | undefined;
  getTest: (openapi: Swagger.SwaggerV3) => A | Swagger.Reference | undefined;
  expected: A | undefined;
};

function runTest<A>(test: TestCase<A>) {
  const toTest = test.getTest(test.openapi);

  if (toTest === undefined) {
    fail('Could not get the object to be tested');
  } else {
    const result = test.runLookup(toTest);

    expect(result).toEqual(test.expected);
  }
}

describe('Lookup', () => {
  describe('Identity Lookup', () => {
    it('should return a schema if it exists right there', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            type: 'number'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.IdLookup().getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: { type: 'number' },
      });
    });

    it('should return undefined on any reference schema', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            $ref: '#/components/schemas/ExampleTwo'
          },
          'ExampleTwo': {
            type: 'string'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.IdLookup().getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: undefined,
      });
    });
  });

  describe('Internal Lookup', () => {
    it('should return a schema if it exists right there', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            type: 'number'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.InternalLookup(exampleSchema).getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: { type: 'number' },
      });
    });

    it('should return a schema if it is only one hop away', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            $ref: '#/components/schemas/ExampleTwo'
          },
          'ExampleTwo': {
            type: 'string'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.InternalLookup(exampleSchema).getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: { title: 'ExampleTwo', type: 'string' },
      });
    });

    it('should return undefined if there is a hop to nowhere', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            $ref: '#/components/schemas/ExampleDoesNotExist'
          },
          'ExampleTwo': {
            type: 'string'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.InternalLookup(exampleSchema).getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: undefined,
      });
    });

    it('should return a schema if it is multiple hops away', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            $ref: '#/components/schemas/ExampleTwo'
          },
          'ExampleTwo': {
            $ref: '#/components/schemas/ExampleThree'
          },
          'ExampleThree': {
            type: 'boolean'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.InternalLookup(exampleSchema).getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: { title: 'ExampleTwo', type: 'boolean' },
      });
    });

    it('should return undefined for an external ($ref not starting with #) reference', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': {
            $ref: 'https://example.com/external-schemas.json#/Foo'
          }
        }
      };

      runTest<Swagger.Schema>({
        openapi: exampleSchema,
        runLookup: a => new SwaggerLookup.InternalLookup(exampleSchema).getSchema(a),
        getTest: openapi => openapi?.components?.schemas?.ExampleOne,
        expected: undefined,
      });
    });

    it('throws instead of resolving a circular reference chain (a known limitation, not supported behavior)', () => {
      const exampleSchema: Swagger.SwaggerV3 = pathsToOAS({});

      exampleSchema.components = {
        schemas: {
          'ExampleOne': { $ref: '#/components/schemas/ExampleTwo' },
          'ExampleTwo': { $ref: '#/components/schemas/ExampleOne' }
        }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const reference: Swagger.Reference = { $ref: '#/components/schemas/ExampleOne' };

      expect(() => lookup.getSchema(reference)).toThrow();
    });
  });

  describe('Identity Lookup - remaining methods', () => {
    const reference: Swagger.Reference = { $ref: '#/components/somewhere' };
    const lookup = new SwaggerLookup.IdLookup();

    it('getCallback returns the value directly, and undefined for a reference', () => {
      const value: Swagger.Callback = { '/foo': { get: { responses: {} } } };
      expect(lookup.getCallback(value)).toEqual(value);
      expect(lookup.getCallback(reference)).toBeUndefined();
    });

    it('getExample returns the value directly, and undefined for a reference', () => {
      const value: Swagger.Example = { value: 'hi' };
      expect(lookup.getExample(value)).toEqual(value);
      expect(lookup.getExample(reference)).toBeUndefined();
    });

    it('getHeaders returns the value directly, and undefined for a reference', () => {
      const value: Swagger.Header = { schema: { type: 'string' } };
      expect(lookup.getHeaders(value)).toEqual(value);
      expect(lookup.getHeaders(reference)).toBeUndefined();
    });

    it('getLink returns the value directly, and undefined for a reference', () => {
      const value: Swagger.Link = { operationId: 'getFoo' };
      expect(lookup.getLink(value)).toEqual(value);
      expect(lookup.getLink(reference)).toBeUndefined();
    });

    it('getParam returns the value directly, and undefined for a reference', () => {
      const value: Swagger.Parameter = { name: 'id', in: 'path', required: true, schema: { type: 'string' } };
      expect(lookup.getParam(value)).toEqual(value);
      expect(lookup.getParam(reference)).toBeUndefined();
    });

    it('getRequestBody returns the value directly, and undefined for a reference', () => {
      const value: Swagger.RequestBody = { content: { 'application/json': { schema: { type: 'object' } } } };
      expect(lookup.getRequestBody(value)).toEqual(value);
      expect(lookup.getRequestBody(reference)).toBeUndefined();
    });

    it('getResponse returns the value directly, and undefined for a reference', () => {
      const value: Swagger.Response = { description: 'OK' };
      expect(lookup.getResponse(value)).toEqual(value);
      expect(lookup.getResponse(reference)).toBeUndefined();
    });

    it('getSecurityScheme returns the value directly, and undefined for a reference', () => {
      const value: Swagger.SecurityScheme = { type: 'apiKey', name: 'api_key', in: 'header' };
      expect(lookup.getSecurityScheme(value)).toEqual(value);
      expect(lookup.getSecurityScheme(reference)).toBeUndefined();
    });

    it('getSecuritySchemeByName always returns undefined, since IdLookup cannot resolve names', () => {
      expect(lookup.getSecuritySchemeByName('anything')).toBeUndefined();
    });
  });

  describe('Internal Lookup - remaining methods', () => {
    it('getCallback resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        callbacks: {
          myCallback: { '/foo': { post: { responses: {} } } }
        }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getCallback({ $ref: '#/components/callbacks/myCallback' });

      expect(result).toEqual(exampleSchema.components!.callbacks!.myCallback);
    });

    it('getExample resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        examples: { myExample: { value: 'hi' } }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getExample({ $ref: '#/components/examples/myExample' });

      expect(result).toEqual({ value: 'hi' });
    });

    it('getHeaders resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        headers: { myHeader: { schema: { type: 'string' } } }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getHeaders({ $ref: '#/components/headers/myHeader' });

      expect(result).toEqual({ schema: { type: 'string' } });
    });

    it('getLink resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        links: { myLink: { operationId: 'getFoo' } }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getLink({ $ref: '#/components/links/myLink' });

      expect(result).toEqual({ operationId: 'getFoo' });
    });

    it('getParam resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        parameters: {
          myParam: { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getParam({ $ref: '#/components/parameters/myParam' });

      expect(result).toEqual(exampleSchema.components!.parameters!.myParam);
    });

    it('getRequestBody resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        requestBodies: {
          myBody: { content: { 'application/json': { schema: { type: 'object' } } } }
        }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getRequestBody({ $ref: '#/components/requestBodies/myBody' });

      expect(result).toEqual(exampleSchema.components!.requestBodies!.myBody);
    });

    it('getResponse resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        responses: { myResponse: { description: 'OK' } }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getResponse({ $ref: '#/components/responses/myResponse' });

      expect(result).toEqual({ description: 'OK' });
    });

    it('getSecurityScheme resolves a $ref one hop away', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        securitySchemes: {
          myScheme: { type: 'apiKey', name: 'api_key', in: 'header' }
        }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getSecurityScheme({ $ref: '#/components/securitySchemes/myScheme' });

      expect(result).toEqual(exampleSchema.components!.securitySchemes!.myScheme);
    });

    it('getSecuritySchemeByName resolves by constructing the components/securitySchemes ref', () => {
      const exampleSchema = pathsToOAS({});
      exampleSchema.components = {
        securitySchemes: {
          myScheme: { type: 'apiKey', name: 'api_key', in: 'header' }
        }
      };

      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);
      const result = lookup.getSecuritySchemeByName('myScheme');

      expect(result).toEqual(exampleSchema.components!.securitySchemes!.myScheme);
    });

    it('getSecuritySchemeByName returns undefined when the named scheme does not exist', () => {
      const exampleSchema = pathsToOAS({});
      const lookup = new SwaggerLookup.InternalLookup(exampleSchema);

      expect(lookup.getSecuritySchemeByName('doesNotExist')).toBeUndefined();
    });
  });
});