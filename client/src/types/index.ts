/**
 * Type definitions for the Financial Dashboard
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
 * Summary card data
 */
export interface SummaryCard {
  title: string;
  value: string;
  icon: any; // Component type
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
  backgroundColor: string | string[];
  borderColor?: string;
  data: number[];
  tension?: number;
}

/**
 * Chart options
 */
export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: {
    y?: {
      beginAtZero: boolean;
      grid?: {
        color: string;
      };
      ticks?: {
        color: string;
      };
    };
    x?: {
      grid?: {
        color: string;
      };
      ticks?: {
        color: string;
      };
    };
  };
  plugins?: {
    legend?: {
      position?: string;
      labels?: {
        color: string;
      };
    };
  };
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