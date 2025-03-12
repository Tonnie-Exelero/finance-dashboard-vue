/**
 * Main Server Entry Point
 *
 * Initializes the Apollo GraphQL server and connects to the database.
 *
 * @module server
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Import database connection
import { connectToDatabase } from './db/index';

// Import GraphQL schema and resolvers
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
import type { GraphQLContext } from './types/index';

/**
 * Start the Apollo Server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to the database
    await connectToDatabase();

    // Initialize Apollo Server
    const server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
    });

    // Start the server
    const { url } = await startStandaloneServer(server, {
      listen: { port: parseInt(process.env.PORT || '4000') },
      context: async ({ req }): Promise<GraphQLContext> => {
        // Add authentication context here if needed
        return {};
      },
    });

    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
