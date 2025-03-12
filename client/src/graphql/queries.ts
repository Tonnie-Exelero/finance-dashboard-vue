/**
 * GraphQL Queries
 *
 * Defines GraphQL queries and mutations for the application.
 *
 * @module graphql/queries
 */
import { gql } from '@apollo/client/core'

/**
 * Query to get dashboard data
 */
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    summaryData {
      totalBalance
      monthlyExpenses
      monthlyIncome
      percentChange
    }
    revenueData {
      month
      revenue
      expenses
    }
    expenseBreakdown {
      category
      amount
    }
  }
`

/**
 * Query to get transactions with pagination
 */
export const GET_TRANSACTIONS = gql`
  query GetTransactions($limit: Int, $offset: Int) {
    transactions(limit: $limit, offset: $offset) {
      id
      date
      description
      category
      amount
      status
    }
    transactionCount
  }
`

/**
 * Mutation to add a transaction
 */
export const ADD_TRANSACTION = gql`
  mutation AddTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
      id
      date
      description
      category
      amount
      status
    }
  }
`

/**
 * Mutation to update a transaction
 */
export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      date
      description
      category
      amount
      status
    }
  }
`

/**
 * Mutation to delete a transaction
 */
export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
