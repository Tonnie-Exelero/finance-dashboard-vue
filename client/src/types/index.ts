/**
 * Type definitions for the Financial Dashboard frontend
 *
 * @module types
 */

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
 * Transaction status
 */
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

/**
 * Transaction category
 */
export type TransactionCategory = 
  | 'Income' 
  | 'Housing' 
  | 'Food' 
  | 'Transportation' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Healthcare' 
  | 'Other';

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
 * Summary card for dashboard
 */
export interface SummaryCard {
  title: string;
  value: string;
  icon: any;
  percentChange?: number;
}

/**
 * Chart data structure
 */
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

/**
 * Chart dataset
 */
export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  tension?: number;
}

/**
 * Chart data structure
 */
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

/**
 * Chart options
 */
export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: {
    y?: {
      beginAtZero?: boolean;
      grid?: {
        color?: string;
      };
      ticks?: {
        color?: string;
      };
    };
    x?: {
      grid?: {
        color?: string;
      };
      ticks?: {
        color?: string;
      };
    };
  };
  plugins?: {
    legend?: {
      position?: string;
      labels?: {
        color?: string;
      };
    };
  };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * GraphQL query response for financial data
 */
export interface FinancialDataResponse {
  summaryData: SummaryData;
  transactions: Transaction[];
  revenueData: RevenueData[];
  expenseBreakdown: ExpenseBreakdown[];
}