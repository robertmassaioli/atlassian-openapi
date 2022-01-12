import { Swagger } from './swagger';

export function pathsToOAS(paths: Swagger.Paths, tags?: Swagger.Tag[]): Swagger.SwaggerV3 {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Test Swagger File',
      version: '1'
    },
    paths,
    tags
  };
}