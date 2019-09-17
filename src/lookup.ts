import { Swagger as S } from './swagger';
import { SwaggerTypeChecks as TC } from './type-checks';
import { get as pointerGet } from 'jsonpointer';

export namespace SwaggerLookup {
  /**
   * Given an object and a potential reference to that object, this interface will help you perform that
   * lookup and either return the right object or undefined.
   */
  export interface Lookup {
    getCallback: (c: S.Callback | S.Reference) => S.Callback | undefined;
    getExample: (e: S.Example | S.Reference) => S.Example | undefined;
    getHeaders: (h: S.Header | S.Reference) => S.Header | undefined;
    getLink: (l: S.Link | S.Reference) => S.Link | undefined;
    getParam: (p: S.ParameterOrRef) => S.Parameter | undefined;
    getRequestBody: (b: S.RequestBody | S.Reference) => S.RequestBody | undefined;
    getResponse: (r: S.Response | S.Reference) => S.Response | undefined;
    getSchema: (s: S.Schema | S.Reference) => S.Schema | undefined;
    getSecuritySchemeByName: (name: string) => S.SecurityScheme | undefined;
    getSecurityScheme: (ss: S.SecurityScheme | S.Reference) => S.SecurityScheme | undefined;
  }

  /**
   * This lookup does not return any values that could be discovered via references. Every function
   * just operates as the ID function; thus the name.
   */
  export class IdLookup implements Lookup {
    public getExample(e: S.Example | S.Reference): S.Example | undefined {
      return !TC.isReference(e) ? e : undefined;
    }

    public getRequestBody(b: S.Reference | S.RequestBody): S.RequestBody | undefined {
      return !TC.isReference(b) ? b : undefined;
    }

    public getHeaders(h: S.Reference | S.Header): S.Header | undefined {
      return !TC.isReference(h) ? h : undefined;
    }

    public getSecuritySchemeByName(_name: string): S.SecurityScheme | undefined {
      return undefined;
    }

    public getSecurityScheme(ss: S.Reference | S.SecurityScheme): S.SecurityScheme | undefined {
      return !TC.isReference(ss) ? ss : undefined;
    }

    public getLink(l: S.Reference | S.Link): S.Link | undefined {
      return !TC.isReference(l) ? l : undefined;
    }

    public getCallback(c: S.Reference | S.Callback): S.Callback | undefined {
      return !TC.isReference(c) ? c : undefined;
    }

    public getResponse(r: S.Response | S.Reference): S.Response | undefined {
      return !TC.isReference(r) ? r : undefined;
    }

    public getSchema(s: S.Schema | S.Reference): S.Schema | undefined {
      return !TC.isReference(s) ? s : undefined;
    }

    public getParam(p: S.ParameterOrRef): S.Parameter | undefined {
      return !TC.isReference(p) ? p : undefined;
    }
  }

  export class InternalLookup implements Lookup {
    private schema: S.SwaggerV3;

    constructor(swagger: S.SwaggerV3) {
      this.schema = swagger;
    }

    public getCallback(c: S.Reference | S.Callback): S.Callback | undefined {
      return this.performLookup<S.Callback>(c, TC.isCallback);
    }

    public getExample(e: S.Example | S.Reference): S.Example | undefined {
      return this.performLookup<S.Example>(e, TC.isExample);
    }

    public getHeaders(h: S.Reference | S.Header): S.Header | undefined {
      return this.performLookup<S.Header>(h, TC.isHeader);
    }

    public getLink(l: S.Reference | S.Link): S.Link | undefined {
      return this.performLookup<S.Link>(l, TC.isLink);
    }

    public getParam(p: S.ParameterOrRef): S.Parameter | undefined {
      return this.performLookup<S.Parameter>(p, TC.isParameter);
    }

    public getRequestBody(b: S.Reference | S.RequestBody): S.RequestBody | undefined {
      return this.performLookup<S.RequestBody>(b, TC.isRequestBody);
    }

    public getResponse(r: S.Response | S.Reference): S.Response | undefined {
      return this.performLookup<S.Response>(r, TC.isResponse);
    }

    public getSchema(s: S.Schema | S.Reference): S.Schema | undefined {
      const potentialSchema = this.performLookup<S.Schema>(s, TC.isSchema);

      // Use the definition name if the title is missing
      if (typeof potentialSchema !== 'undefined'
      && typeof potentialSchema.title === 'undefined'
      && TC.isReference(s)) {
        const refSplit = s.$ref.split('/');
        if (refSplit.length === 4) {
          return {
            ...potentialSchema,
            title: refSplit[3]
          };
        }
      }

      return potentialSchema;
    }

    public getSecuritySchemeByName(name: string): S.SecurityScheme | undefined {
      return this.getSecurityScheme({ '$ref': `#/components/securitySchemes/${name}`});
    }

    public getSecurityScheme(ss: S.Reference | S.SecurityScheme): S.SecurityScheme | undefined {
      return this.performLookup<S.SecurityScheme>(ss, TC.isSecurityScheme);
    }

    // tslint:disable-next-line:no-any
    private performLookup<T>(o: T | S.Reference, tCheck: (o: any) => o is T): T | undefined {
      if (!TC.isReference(o)) {
        return o;
      }

      const ref = o.$ref;
      if (!ref.startsWith('#')) {
        // Any references that don't start with a # are external, and thus not handled
        return undefined;
      }

      const result = pointerGet(this.schema, ref.slice(1));

      // Call recursively if you perform a lookup and get another reference
      if (TC.isReference(result)) {
        return this.performLookup(result, tCheck);
      }

      return tCheck(result) ? result : undefined;
    }
  }
}
