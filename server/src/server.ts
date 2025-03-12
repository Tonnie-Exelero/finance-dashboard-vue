/**
 * Main Server Entry Point
 *
 * Initializes the Apollo GraphQL server and connects to the database.
 *
 * @module server
 */
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { connectToDatabase, query } from './db';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import type { GraphQLContext } from './types';
import cors from 'cors';

// Vercel requires this for serverless functions
const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectToDatabase();

    const server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
      cache: 'bounded',
      persistedQueries: false,
    });

    await server.start();

    // Apply CORS and body parser
    app.use(
      '/api/graphql',
      cors<cors.CorsRequest>({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({
          // Add authentication context here
          db: { query },
          authToken: req.headers.authorization,
        }),
      })
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Vercel requires this handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}/api/graphql`);
      });
    }

    return app;
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Export for Vercel serverless functions
export default startServer();