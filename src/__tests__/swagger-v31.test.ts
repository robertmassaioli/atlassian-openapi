import { SwaggerV31 } from '../swagger-v31';

describe('SwaggerV31', () => {
  it('constructs a document exercising every 3.1-specific feature', () => {
    const nullableStringSchema: SwaggerV31.Schema = {
      type: ['string', 'null'],
      examples: ['foo', null]
    };

    const boundedNumberSchema: SwaggerV31.Schema = {
      type: 'number',
      exclusiveMinimum: 0,
      exclusiveMaximum: 100
    };

    const doc: SwaggerV31.SwaggerV31 = {
      openapi: '3.1.0',
      info: {
        title: 'Smoke test API',
        version: '1.0.0',
        license: {
          name: 'MIT',
          identifier: 'MIT'
        }
      },
      jsonSchemaDialect: 'https://spec.openapis.org/oas/3.1/dialect/base',
      // 3.1 documents don't need `paths` at all, provided something else is present.
      webhooks: {
        newIssue: {
          post: {
            responses: {
              '200': { description: 'Webhook processed' }
            }
          }
        }
      },
      components: {
        schemas: {
          NullableString: nullableStringSchema,
          BoundedNumber: boundedNumberSchema
        },
        pathItems: {
          SharedItem: {
            get: {
              responses: {
                '200': { description: 'OK' }
              }
            }
          }
        },
        securitySchemes: {
          mtls: { type: 'mutualTLS', description: 'Client certificate auth' }
        }
      }
    };

    expect(doc.paths).toBeUndefined();
    expect(doc.webhooks?.newIssue.post?.responses['200'].description).toEqual('Webhook processed');
    expect(doc.info.license?.identifier).toEqual('MIT');
    expect(doc.components?.pathItems?.SharedItem).toBeDefined();
    expect(doc.components?.securitySchemes?.mtls).toEqual({ type: 'mutualTLS', description: 'Client certificate auth' });
    expect(nullableStringSchema.type).toEqual(['string', 'null']);
    expect(boundedNumberSchema.exclusiveMinimum).toEqual(0);
  });

  it('still supports a conventional paths-based document, same shape as before', () => {
    const doc: SwaggerV31.SwaggerV31 = {
      openapi: '3.1.2',
      info: { title: 'Conventional API', version: '1.0.0' },
      paths: {
        '/widgets': {
          get: {
            responses: {
              '200': { description: 'A list of widgets' }
            }
          }
        }
      }
    };

    expect(Object.keys(doc.paths ?? {})).toEqual(['/widgets']);
  });

  it('carries the Atlassian extensions reused from the 3.0 namespace', () => {
    const operation: SwaggerV31.Operation = {
      responses: { '200': { description: 'OK' } },
      'x-atlassian-oauth2-scopes': [
        { deprecated: false, scopes: ['read:jira-work'] }
      ]
    };

    expect(operation['x-atlassian-oauth2-scopes']).toHaveLength(1);
  });
});
