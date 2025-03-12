/**
 * Apollo Client Composable
 *
 * Sets up and provides the Apollo Client for GraphQL queries and mutations.
 *
 * @module composables/useApolloClient
 */
import type { DefaultOptions } from '@apollo/client/core'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

export function useApolloClient() {
  // Get environment variables with proper typing
  const API_URL = import.meta.env.VITE_API_URL
  const NODE_ENV = import.meta.env.VITE_NODE_ENV

  if (!API_URL) {
    throw new Error('VITE_API_URL environment variable is not defined')
  }

  // HTTP connection to the API
  const httpLink = createHttpLink({
    uri: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Cache implementation
  const cache = new InMemoryCache()

  // Default options
  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  }

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    defaultOptions,
    connectToDevTools: NODE_ENV !== 'production',
  })

  // Provide the apollo client to the Vue app
  provideApolloClient(apolloClient)

  return apolloClient
}
