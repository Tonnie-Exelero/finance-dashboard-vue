import { describe, it, expect } from "vitest";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../schema";
import { resolvers } from "../resolvers";

describe("GraphQL Schema", () => {
  it("creates a valid schema with resolvers", () => {
    // This will throw an error if the schema is invalid
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    expect(schema).toBeDefined();
  });

  it("has resolvers for all defined queries and mutations", () => {
    // Check Query resolvers
    expect(resolvers.Query).toBeDefined();
    expect(resolvers.Query.transactions).toBeDefined();
    expect(resolvers.Query.transactionCount).toBeDefined();
    expect(resolvers.Query.summaryData).toBeDefined();
    expect(resolvers.Query.revenueData).toBeDefined();
    expect(resolvers.Query.expenseBreakdown).toBeDefined();

    // Check Mutation resolvers
    expect(resolvers.Mutation).toBeDefined();
    expect(resolvers.Mutation.addTransaction).toBeDefined();
    expect(resolvers.Mutation.updateTransaction).toBeDefined();
    expect(resolvers.Mutation.deleteTransaction).toBeDefined();
  });
});
