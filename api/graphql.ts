// api/graphql.ts
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";
import { resolvers } from "../server/src/graphql/resolvers";
import { typeDefs } from "../server/src/graphql/schema";
import { query, connectToDatabase } from "../server/src/db";
import { GraphQLContext } from "../server/src/types";

// Initialize Apollo Server
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV === "development",
  plugins: [
    {
      async requestDidStart() {
        return {
          async willSendResponse({ response }) {
            response.http.headers.set("Cache-Control", "no-store, max-age=0");
          },
          async didEncounterErrors({ errors }) {
            errors.forEach((error) => {
              console.error("GraphQL Error", {
                error: error.message,
                path: error.path,
                extensions: error.extensions,
              });
            });
          },
        };
      },
    },
  ],
});

// Create handler with proper context
// @ts-ignore
const handler = startServerAndCreateLambdaHandler(server, {
  context: async ({ event }) => {
    // Establish database connection if not already connected
    await connectToDatabase();

    return {
      db: { query },
      authToken: event.headers.authorization || "",
    };
  },
  middleware: [
    async (event) => {
      // Handle CORS preflight
      if (event.httpMethod === "OPTIONS") {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
          },
          body: "",
        };
      }

      // Add CORS headers to all responses
      return {
        ...event,
        headers: {
          ...event.headers,
          "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
          "Access-Control-Allow-Credentials": "true",
        },
      };
    },
  ],
});

// Health check handler
export const healthHandler = async () => {
  try {
    await query("SELECT 1");
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "ok",
        database: "connected",
        environment: process.env.NODE_ENV,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        database: "disconnected",
        environment: process.env.NODE_ENV,
      }),
    };
  }
};

// Export handlers
export default handler;
