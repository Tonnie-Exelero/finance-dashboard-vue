/**
 * GraphQL Resolvers
 *
 * Combines all resolvers for the GraphQL API.
 *
 * @module graphql/resolvers
 */
import { transactionResolvers } from './transactions';
import { summaryResolvers } from './summary';
import { chartResolvers } from './charts';

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
