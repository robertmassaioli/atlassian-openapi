import {
  OperationGroupings,
  radV1GroupingStrategy,
  tagGroupingStrategy,
  urlGroupingStrategy,
  getIdForOperationGroup,
  getIdForOperation,
  getOpPath,
  PathAndOperation
} from './operation-grouping';
import { Swagger } from './swagger';
import { pathsToOAS } from './test-functions';

const EMPTY_OPERATION: Swagger.Operation = { responses: {} };

const simpleOperation = (
  path: string,
  method: Swagger.Method = 'get',
  operation: Swagger.Operation = EMPTY_OPERATION): PathAndOperation =>
({
  baseUrl: 'https://your-domain.atlassian.net',
  method,
  operation,
  path,
  pathItemParameters: [],
  security: undefined
});

type TestCase<I = string, O = string> = {
  title: string;
  input: I;
  output: O;
};

function createTest<I = string, O = string>(title: string, input: I, output: O): TestCase<I, O> {
  return { title, input, output };
}

describe('postman grouping', () => {
  describe('getIdForOperationGroup', () => {
    function runTest(test: TestCase) {
      it(test.title, () => {
        expect(getIdForOperationGroup({ title: test.input, operations: []})).toEqual(test.output);
      });
    }

    [ createTest('simple alphanumeric title', 'title', 'api-group-title')
    , createTest('title with dashes', 'title-with-dashes', 'api-group-title-with-dashes')
    , createTest('title with spaces', 'This is a title', 'api-group-This-is-a-title')
    , createTest('title with special chars', 'wat?|_()title', 'api-group-wat-----title')
    ].forEach(runTest);
  });

  describe('getIdForOperation', () => {
    type InputFactors = {
      path: string;
      method: Swagger.Method;
    };

    function runTest(test: TestCase<InputFactors>) {
      it(test.title, () => {
        const actual = getIdForOperation({
          path: test.input.path,
          method: test.input.method,
          baseUrl: 'https://example.com/rest',
          operation: EMPTY_OPERATION,
          pathItemParameters: [],
          security: undefined
        });
        expect(actual).toEqual(test.output);
      });
    }

    [
      createTest<InputFactors>(
        'simple method and path',
        { method: 'get', path: '/path/to/resource' },
        'api-path-to-resource-get'
      ),
      createTest<InputFactors>(
        'capital letters are unchanged',
        { method: 'get', path: '/path/to/RESOURCE' },
        'api-path-to-RESOURCE-get'
      ),
      createTest<InputFactors>(
        'special characters become dashes',
        { method: 'post', path: '/path/to/res|our[ce' },
        'api-path-to-res-our-ce-post'
      ),
    ].forEach(runTest);
  });

  describe('getOpPath', () => {
    type InputFactors = {
      baseUrl: string;
      method: Swagger.Method;
      path: string;
    };

    function runTest(test: TestCase<InputFactors>) {
      it(test.title, () => {
        const actual = getOpPath({
          baseUrl: test.input.baseUrl,
          method: test.input.method,
          path: test.input.path,
          operation: EMPTY_OPERATION,
          pathItemParameters: [],
          security: undefined
        });
        expect(actual).toEqual(test.output);
      });
    }

    [
      createTest<InputFactors>(
        'no path baseUrl',
        { baseUrl: 'https://example.com', method: 'get', path: '/path/to/resource' },
        'GET /path/to/resource'
      ),
      createTest<InputFactors>(
        'baseUrl with single segment path',
        { baseUrl: 'https://example.com/rest', method: 'get', path: '/path/to/resource' },
        'GET /rest/path/to/resource'
      ),
      createTest<InputFactors>(
        'baseUrl with trailing slash',
        { baseUrl: 'https://example.com/rest/', method: 'get', path: '/path/to/resource' },
        'GET /rest/path/to/resource'
      ),
      createTest<InputFactors>(
        'baseUrl with multiple segments',
        { baseUrl: 'https://example.com/rest/extended', method: 'get', path: '/path/to/resource' },
        'GET /rest/extended/path/to/resource'
      ),
      createTest<InputFactors>(
        'delete instead of get',
        { baseUrl: 'https://example.com/rest/extended', method: 'delete', path: '/path/to/resource' },
        'DELETE /rest/extended/path/to/resource'
      )
    ].forEach(runTest);
  });

  describe('radV1GroupingStrategy', () => {
    it('should return an empty grouping for empty paths', () => {
      const expected: OperationGroupings = { groups: [] };
      expect(radV1GroupingStrategy(pathsToOAS({}))).toEqual(expected);
    });

    it('should extract the first url path segment as the group', () => {
      const actual = pathsToOAS({
        '/object/action': {
          get: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          title: 'Object',
          operations: [
            simpleOperation('/object/action')
          ]
        }]
      };

      expect(radV1GroupingStrategy(actual)).toEqual(expected);
    });

    it('complex path segment name should convert nicely', () => {
      const actual = pathsToOAS({
        '/complex_path-segment-name/action': {
          get: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          title: 'Complex_path-segment-name',
          operations: [
            simpleOperation('/complex_path-segment-name/action')
          ]
        }]
      };

      expect(radV1GroupingStrategy(actual)).toEqual(expected);
    });

    it('same initial path segment should group the same', () => {
      const actual = pathsToOAS({
        '/object/action': {
          get: EMPTY_OPERATION,
          post: EMPTY_OPERATION
        },
        '/object/secondary-action': {
          delete: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          title: 'Object',
          operations: [
            simpleOperation('/object/action'),
            simpleOperation('/object/action', 'post'),
            simpleOperation('/object/secondary-action', 'delete')
          ]
        }]
      };

      expect(radV1GroupingStrategy(actual)).toEqual(expected);
    });

    it('different initial path segment should separate into separate groups', () => {
      const actual = pathsToOAS({
        '/object/action': {
          get: EMPTY_OPERATION
        },
        '/another-object/action': {
          delete: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          operations: [
            simpleOperation('/object/action')
          ],
          title: 'Object'
        },
        {
          operations: [
            simpleOperation('/another-object/action', 'delete')
          ],
          title: 'Another-object'
        }]
      };

      expect(radV1GroupingStrategy(actual)).toEqual(expected);
    });
  });

  describe('urlGroupingStrategy', () => {
    it('should return an empty grouping for empty paths', () => {
      const expected: OperationGroupings = { groups: [] };
      expect(urlGroupingStrategy(pathsToOAS({}))).toEqual(expected);
    });

    it('should fall back to radV1GroupingStrategy if there are no summaries on pathItems', () => {
      const actual = pathsToOAS({
        '/object/action': {
          get: EMPTY_OPERATION
        },
        '/another-object/action': {
          delete: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          operations: [
            simpleOperation('/object/action')
          ],
          title: 'Object'
        },
        {
          operations: [
            simpleOperation('/another-object/action', 'delete')
          ],
          title: 'Another-object'
        }]
      };

      expect(urlGroupingStrategy(actual)).toEqual(expected);
    });

    it('should use url grouping strategy if there is even one summary on a pathItem', () => {
      const actual = pathsToOAS({
        '/object/action': {
          get: EMPTY_OPERATION
        },
        '/another-object/action': {
          summary: 'Another object title',
          delete: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          operations: [
            simpleOperation('/another-object/action', 'delete')
          ],
          title: 'Another object title'
        },
        {
          operations: [
            simpleOperation('/object/action')
          ],
          title: 'Object'
        }]
      };

      expect(urlGroupingStrategy(actual)).toEqual(expected);
    });

    it('url grouping always sorts by path', () => {
      const actual = pathsToOAS({
        '/zzzz/should-come-last-if-sort-key': {
          summary: 'Aaaaaa title would come first if was sort key',
          get: EMPTY_OPERATION
        },
        '/aaaa/should-come-first-if-sort-key': {
          summary: 'Zzzzz title would come last if was sort key',
          delete: EMPTY_OPERATION
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          operations: [
            simpleOperation('/aaaa/should-come-first-if-sort-key', 'delete')
          ],
          title: 'Zzzzz title would come last if was sort key'
        },
        {
          operations: [
            simpleOperation('/zzzz/should-come-last-if-sort-key')
          ],
          title: 'Aaaaaa title would come first if was sort key'
        }]
      };

      expect(urlGroupingStrategy(actual)).toEqual(expected);
    });
  });

  describe('tagGroupingStrategy', () => {
    it('should return an empty grouping for empty paths', () => {
      const expected: OperationGroupings = { groups: [] };
      expect(tagGroupingStrategy(pathsToOAS({}))).toEqual(expected);
    });

    it('no tags at the top level of the swagger file should fallback to urlGroupingStrategy', () => {
      const actual = pathsToOAS({
        '/object/action': {
          get: { ...EMPTY_OPERATION, tags: ['ignored'] }
        },
        '/another-object/action': {
          summary: 'Another object title',
          delete: { ...EMPTY_OPERATION, tags: ['ignored'] }
        }
      });

      const expected: OperationGroupings = {
        groups: [{
          operations: [
            simpleOperation('/another-object/action', 'delete', { ...EMPTY_OPERATION, tags: ['ignored'] })
          ],
          title: 'Another object title'
        },
        {
          operations: [
            simpleOperation('/object/action', 'get', { ...EMPTY_OPERATION, tags: ['ignored'] })
          ],
          title: 'Object'
        }]
      };

      expect(tagGroupingStrategy(actual)).toEqual(expected);
    });

    it('tags at the top level, but untagged operations should go into "Other operations"', () => {
      const actual = pathsToOAS(
        {
          '/object/action': {
            get: EMPTY_OPERATION
          }
        },
        [
          { name: 'Test tag'}
        ]
      );

      const expected: OperationGroupings = {
        groups: [{
          title: 'Other operations',
          operations: [
            simpleOperation('/object/action')
          ]
        }]
      };

      expect(tagGroupingStrategy(actual)).toEqual(expected);
    });

    it('an unknown (not at top level) Tag is ignored for grouping purposes', () => {
      const actual = pathsToOAS(
        {
          '/object/action': {
            get: { ...EMPTY_OPERATION, tags: ['Unspecified tag'] }
          }
        },
        [{
          name: 'Test tag',
        }]
      );

      const expected: OperationGroupings = {
        groups: [{
          title: 'Other operations',
          operations: [
            simpleOperation('/object/action', 'get', { ...EMPTY_OPERATION, tags: ['Unspecified tag'] })
          ]
        }]
      };

      expect(tagGroupingStrategy(actual)).toEqual(expected);
    });

    it('should ignore all but the first tag of an operation for grouping purposes', () => {
      const actual = pathsToOAS(
        {
          '/object/action': {
            get: { ...EMPTY_OPERATION, tags: ['Unspecified tag', 'Known tag'] }
          }
        },
        [{
          name: 'Known tag',
        }]
      );

      const expected: OperationGroupings = {
        groups: [{
          title: 'Other operations',
          operations: [
            simpleOperation('/object/action', 'get', { ...EMPTY_OPERATION, tags: ['Unspecified tag', 'Known tag'] })
          ]
        }]
      };

      expect(tagGroupingStrategy(actual)).toEqual(expected);
    });

    it('should use tags to group as expected', () => {
      const actual = pathsToOAS(
        {
          '/object/action': {
            get: { ...EMPTY_OPERATION, tags: ['Group B', 'Ignored'] },
            post: { ...EMPTY_OPERATION, tags: ['Group A', 'Ignored'] }
          },
          '/object/action/data': {
            get: { ...EMPTY_OPERATION, tags: ['Group A', 'Ignored'] },
            post: { ...EMPTY_OPERATION, tags: ['Group B', 'Ignored'] }
          }
        },
        [{
          name: 'Group A',
        }, {
          name: 'Group B'
        }, {
          name: 'Usused tag'
        }]
      );

      const expected: OperationGroupings = {
        groups: [{
          title: 'Group A',
          operations: [
            simpleOperation('/object/action', 'post', { ...EMPTY_OPERATION, tags: ['Group A', 'Ignored'] }),
            simpleOperation('/object/action/data', 'get', { ...EMPTY_OPERATION, tags: ['Group A', 'Ignored'] })
          ]
        }, {
          title: 'Group B',
          operations: [
            simpleOperation('/object/action', 'get', { ...EMPTY_OPERATION, tags: ['Group B', 'Ignored'] }),
            simpleOperation('/object/action/data', 'post', { ...EMPTY_OPERATION, tags: ['Group B', 'Ignored'] })
          ]
        }]
      };

      expect(tagGroupingStrategy(actual)).toEqual(expected);
    });
  });
});
