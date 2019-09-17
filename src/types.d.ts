declare module 'jsonpointer' {
  interface JSONPointer {
      /**
       * Looks up a JSON pointer in an object
       */
      get(object: Object, pointer: string): any; // tslint:disable-line:no-any

      /**
       * Set a value for a JSON pointer on object
       */
      set(object: Object, pointer: string, value: any): void; // tslint:disable-line:no-any
  }

  namespace JSONPointer {
      /**
       * Looks up a JSON pointer in an object
       */
      function get(object: Object, pointer: string): any; // tslint:disable-line:no-any

      /**
       * Set a value for a JSON pointer on object
       */
      function set(object: Object, pointer: string, value: any): void; // tslint:disable-line:no-any

      /**
       *  Builds a JSONPointer instance from a pointer value.
       */
      function compile(pointer: string): JSONPointer;
  }

  export = JSONPointer;
}
