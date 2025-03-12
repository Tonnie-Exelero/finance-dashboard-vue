/**
 * Apollo Client Composable
 *
 * Sets up and provides the Apollo Client for GraphQL queries and mutations.
 *
 * @module composables/useApolloClient
 */
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { ref } from 'vue'

/**
 * Initialize and provide the Apollo Client
 * @returns {ApolloClient} The configured Apollo Client instance
 */
export function useApolloClient() {
  const client = ref<ApolloClient<any> | null>(null)

  const initializeApolloClient = () => {
    // Determine the GraphQL endpoint based on environment
    // @ts-expect-error
    const uri = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql'

    // Create HTTP link
    const httpLink = createHttpLink({
      uri,
      credentials: 'include',
    })

    // Create Apollo Client
    client.value = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
      // @ts-expect-error
      connectToDevTools: import.meta.env.VITE_NODE_ENV !== 'production',
    })

    return client.value
  }

  // Initialize client if not already initialized
  if (!client.value) {
    initializeApolloClient()
  }

  return {
    client,
    initializeApolloClient,
  }
}
