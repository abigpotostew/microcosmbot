import { GraphQLClient } from 'graphql-request'

export const API_BASE_URL =
  'https://api.goldsky.com/api/public/project_clfgcq9s92po93swg9uakcvhu/subgraphs/nouns-stream/dev/gn'

export const graphQLClient = new GraphQLClient(API_BASE_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetcher = (query: string, variables: Record<string, unknown>) =>
  graphQLClient.request(query, variables)
