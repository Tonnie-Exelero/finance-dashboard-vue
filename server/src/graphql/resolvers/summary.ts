/**
 * Summary Resolvers
 *
 * Implements resolvers for summary-related queries.
 *
 * @module graphql/resolvers/summary
 */
import { getClient } from '../../db/index';
import type { SummaryData, GraphQLContext } from '../../types/index';

/**
 * Summary resolvers
 */
export const summaryResolvers = {
  Query: {
    /**
     * Get summary data for the dashboard
     */
    summaryData: async (_: any, __: any, _context: GraphQLContext): Promise<SummaryData> => {
      try {
        const client = getClient();

        // Get current month's income and expenses
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

        // Get previous month's income and expenses
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const firstDayOfPreviousMonth = `${previousYear}-${previousMonth
          .toString()
          .padStart(2, '0')}-01`;
        const lastDayOfPreviousMonth = new Date(previousYear, previousMonth, 0)
          .toISOString()
          .split('T')[0];

        // Query for current month's income
        const incomeResult = await client.query(
          `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
           WHERE amount > 0 AND date BETWEEN $1 AND $2`,
          [firstDayOfMonth, lastDayOfMonth]
        );
        const monthlyIncome = parseFloat(incomeResult.rows[0].total);

        // Query for current month's expenses
        const expensesResult = await client.query(
          `SELECT COALESCE(SUM(ABS(amount)), 0) as total FROM transactions 
           WHERE amount < 0 AND date BETWEEN $1 AND $2`,
          [firstDayOfMonth, lastDayOfMonth]
        );
        const monthlyExpenses = parseFloat(expensesResult.rows[0].total);

        // Query for previous month's total
        const previousMonthResult = await client.query(
          `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
           WHERE date BETWEEN $1 AND $2`,
          [firstDayOfPreviousMonth, lastDayOfPreviousMonth]
        );
        const previousMonthTotal = parseFloat(previousMonthResult.rows[0].total);

        // Query for total balance
        const balanceResult = await client.query(
          `SELECT COALESCE(SUM(amount), 0) as total FROM transactions`
        );
        const totalBalance = parseFloat(balanceResult.rows[0].total);

        // Calculate percent change
        const currentMonthTotal = monthlyIncome - monthlyExpenses;
        let percentChange = 0;

        if (previousMonthTotal !== 0) {
          percentChange =
            ((currentMonthTotal - previousMonthTotal) / Math.abs(previousMonthTotal)) * 100;
        }

        return {
          totalBalance,
          monthlyExpenses,
          monthlyIncome,
          percentChange,
        };
      } catch (error) {
        console.error('Error fetching summary data:', error);
        throw new Error('Failed to fetch summary data');
      }
    },
  },
};
