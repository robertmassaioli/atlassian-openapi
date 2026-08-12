# atlassian-openapi

| Statements                  | Branches                | Functions                 | Lines             |
| ---------------------------- | ------------------------ | -------------------------- | ------------------- |
| ![Statements](https://img.shields.io/badge/statements-95.95%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-89.33%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-98%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-97.95%25-brightgreen.svg?style=flat) |

This package contains Typescript typings for OpenAPI 3.0 with Atlassian extensions included as well as 
convenience functions for dealing with OpenAPI 3.0.

Atlassian code and tooling that is based on OpenAPI 3.0 should use this library.

Specifically, it includes:

 - A `Swagger` namespace with OpenAPI 3.0 types.
 - A `Lookup` class to let you easily resolve `$ref`s within your OpenAPI files.
 - OpenAPI Operation Grouping logic that mirrors developer.atlassian.com's Side Nav and Postman collections.
 - Type Checking functions to let you differentiate between different types.

Enjoy!