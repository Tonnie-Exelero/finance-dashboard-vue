/**
 * Summary Resolvers
 *
 * Implements resolvers for summary-related queries.
 *
 * @module graphql/resolvers/summary
 */
import type { SummaryData, GraphQLContext } from '../../types/index';

/**
 * Summary resolvers
 */
export const summaryResolvers = {
  Query: {
    /**
     * Get summary data for the dashboard
     */
    summaryData: async (_: unknown, __: unknown, context: GraphQLContext): Promise<SummaryData> => {
      try {
        // Date calculations
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const firstDayOfPreviousMonth = `${previousYear}-${previousMonth
          .toString()
          .padStart(2, '0')}-01`;
        const lastDayOfPreviousMonth = new Date(previousYear, previousMonth, 0)
          .toISOString()
          .split('T')[0];

        // Execute all queries in parallel
        const [incomeResult, expensesResult, previousMonthResult, balanceResult] =
          await Promise.all([
            context.db.query(
              `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
             WHERE amount > 0 AND date BETWEEN $1 AND $2`,
              [firstDayOfMonth, lastDayOfMonth]
            ),
            context.db.query(
              `SELECT COALESCE(SUM(ABS(amount)), 0) as total FROM transactions 
             WHERE amount < 0 AND date BETWEEN $1 AND $2`,
              [firstDayOfMonth, lastDayOfMonth]
            ),
            context.db.query(
              `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
             WHERE date BETWEEN $1 AND $2`,
              [firstDayOfPreviousMonth, lastDayOfPreviousMonth]
            ),
            context.db.query('SELECT COALESCE(SUM(amount), 0) as total FROM transactions'),
          ]);

        // Parse results
        const monthlyIncome = parseFloat(incomeResult.rows[0].total);
        const monthlyExpenses = parseFloat(expensesResult.rows[0].total);
        const previousMonthTotal = parseFloat(previousMonthResult.rows[0].total);
        const totalBalance = parseFloat(balanceResult.rows[0].total);

        // Calculate metrics
        const currentMonthTotal = monthlyIncome - monthlyExpenses;
        const percentChange =
          previousMonthTotal !== 0
            ? ((currentMonthTotal - previousMonthTotal) / Math.abs(previousMonthTotal)) * 100
            : 0;

        return {
          totalBalance,
          monthlyExpenses: monthlyExpenses,
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
