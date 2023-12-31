import type { CodegenConfig } from '@graphql-codegen/cli'
const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/schema/schema.graphql',
  generates: {
    'src/schema/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}

export default config
