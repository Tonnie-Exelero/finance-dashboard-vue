/**
 * Apollo Client Composable
 * 
 * Sets up and provides the Apollo Client for GraphQL queries and mutations.
 * 
 * @module composables/useApolloClient
 */
import { provide } from 'vue';
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  DefaultOptions
} from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';

/**
 * Initialize and provide the Apollo Client
 * @returns {ApolloClient} The configured Apollo Client instance
 */
export function useApolloClient() {
  // HTTP connection to the API
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
  });

  // Cache implementation
  const cache = new InMemoryCache();

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
  };

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    defaultOptions,
    connectToDevTools: process.env.NODE_ENV !== 'production',
  });

  // Provide the apollo client to the Vue app
  provideApolloClient(apolloClient);

  return apolloClient;
}