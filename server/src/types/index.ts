/**
 * Type definitions for the Financial Dashboard backend
 *
 * @module types
 */

/**
 * Database client configuration
 */
export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

/**
 * Summary data for the dashboard
 */
export interface SummaryData {
  totalBalance: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  percentChange: number;
}

/**
 * Financial transaction
 */
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

/**
 * Transaction input for mutations
 */
export interface TransactionInput {
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

/**
 * Revenue data for charts
 */
export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

/**
 * Expense breakdown by category
 */
export interface ExpenseBreakdown {
  category: string;
  amount: number;
}

/**
 * Context for GraphQL resolvers
 */
export interface GraphQLContext {
  // Add authentication context here if needed
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}
