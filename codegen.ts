import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL Code Generator configuration for generating TypeScript types and hooks.
 * Generates type-safe Apollo Client hooks and types from GraphQL schema and operations.
 * 
 * Configuration generates:
 * - TypeScript types for all GraphQL operations
 * - Type-safe query/mutation hooks
 * - Fragment types and utilities
 * 
 * @see https://the-guild.dev/graphql/codegen
 */
const codegenConfig: CodegenConfig = {
  // Overwrite existing generated files
  overwrite: true,
  
  generates: {
    // Output directory for generated TypeScript files
    './src/gql/generated/': {
      // GraphQL schema source (Sports.ru API schema)
      schema: './schemas/sports.json',
      
      // GraphQL documents (queries, mutations, subscriptions)
      documents: './src/gql/queries/*.ts',
      
      // Use client preset for React/Apollo Client integration
      preset: 'client',
      
      // Client preset configuration
      presetConfig: {
        // Disable fragment masking for easier TypeScript usage
        fragmentMasking: false,
      },
      
      // Additional configuration options
      config: {
        // Generate only operation types (queries/mutations)
        onlyOperationTypes: true,
      },
    },
  },
};

export default codegenConfig;
