/**
 * GraphQL Schema
 *
 * Defines the GraphQL schema for the API.
 *
 * @module graphql/schema
 */
import gql from 'graphql-tag';

// @ts-ignore
export const typeDefs = gql`
  type Query {
    """
    Get summary data for the dashboard
    """
    summaryData: SummaryData!

    """
    Get revenue data for charts
    """
    revenueData: [RevenueData!]!

    """
    Get expense breakdown by category
    """
    expenseBreakdown: [ExpenseBreakdown!]!

    """
    Get transactions with optional pagination
    """
    transactions(limit: Int, offset: Int): [Transaction!]!

    """
    Get total count of transactions
    """
    transactionCount: Int!
  }

  type Mutation {
    """
    Add a new transaction
    """
    addTransaction(input: TransactionInput!): Transaction!

    """
    Update an existing transaction
    """
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!

    """
    Delete a transaction
    """
    deleteTransaction(id: ID!): Boolean!
  }

  """
  Summary data for the dashboard
  """
  type SummaryData {
    totalBalance: Float!
    monthlyExpenses: Float!
    monthlyIncome: Float!
    percentChange: Float
  }

  """
  Financial transaction
  """
  type Transaction {
    id: ID!
    date: String!
    description: String!
    category: String!
    amount: Float!
    status: String!
  }

  """
  Transaction input for mutations
  """
  input TransactionInput {
    date: String!
    description: String!
    category: String!
    amount: Float!
    status: String!
  }

  """
  Revenue data for charts
  """
  type RevenueData {
    month: String!
    revenue: Float!
    expenses: Float!
  }

  """
  Expense breakdown by category
  """
  type ExpenseBreakdown {
    category: String!
    amount: Float!
  }
`;
