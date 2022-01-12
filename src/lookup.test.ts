import { Swagger } from './swagger';
import { SwaggerLookup } from './lookup';
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
  });
});