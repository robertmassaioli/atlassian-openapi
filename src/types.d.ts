declare module 'jsonpointer' {
  interface JSONPointer {
      /**
       * Looks up a JSON pointer in an object
       */
      get(object: object, pointer: string): any;

      /**
       * Set a value for a JSON pointer on object
       */
      set(object: object, pointer: string, value: any): void;
  }

  namespace JSONPointer {
      /**
       * Looks up a JSON pointer in an object
       */
      function get(object: object, pointer: string): any;

      /**
       * Set a value for a JSON pointer on object
       */
      function set(object: object, pointer: string, value: any): void;

      /**
       *  Builds a JSONPointer instance from a pointer value.
       */
      function compile(pointer: string): JSONPointer;
  }

  export = JSONPointer;
}
