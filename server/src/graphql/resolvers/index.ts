/**
 * GraphQL Resolvers
 *
 * Combines all resolvers for the GraphQL API.
 *
 * @module graphql/resolvers
 */
import { transactionResolvers } from "./transactions.js";
import { summaryResolvers } from "./summary.js";
import { chartResolvers } from "./charts.js";

export const resolvers = {
  Query: {
    ...transactionResolvers.Query,
    ...summaryResolvers.Query,
    ...chartResolvers.Query,
  },
  Mutation: {
    ...transactionResolvers.Mutation,
  },
};
