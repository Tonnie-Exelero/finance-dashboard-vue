/**
 * Chart Resolvers
 *
 * Implements resolvers for chart-related queries.
 *
 * @module graphql/resolvers/charts
 */
import { getClient } from '../../db/index';
import type { RevenueData, ExpenseBreakdown, GraphQLContext } from '../../types/index';

/**
 * Chart resolvers
 */
export const chartResolvers = {
  Query: {
    /**
     * Get revenue data for charts
     */
    revenueData: async (_: any, __: any, _context: GraphQLContext): Promise<RevenueData[]> => {
      try {
        const client = getClient();

        // Get the last 6 months of data
        const result = await client.query(`
          WITH months AS (
            SELECT generate_series(
              date_trunc('month', current_date - interval '5 months'),
              date_trunc('month', current_date),
              interval '1 month'
            ) AS month
          ),
          income AS (
            SELECT 
              date_trunc('month', date) AS month,
              COALESCE(SUM(amount), 0) AS total
            FROM transactions
            WHERE amount > 0
            GROUP BY month
          ),
          expenses AS (
            SELECT 
              date_trunc('month', date) AS month,
              COALESCE(SUM(ABS(amount)), 0) AS total
            FROM transactions
            WHERE amount < 0
            GROUP BY month
          )
          SELECT 
            to_char(m.month, 'Mon YYYY') AS month,
            COALESCE(i.total, 0) AS revenue,
            COALESCE(e.total, 0) AS expenses
          FROM months m
          LEFT JOIN income i ON m.month = i.month
          LEFT JOIN expenses e ON m.month = e.month
          ORDER BY m.month
        `);

        return result.rows.map((row) => ({
          month: row.month,
          revenue: parseFloat(row.revenue),
          expenses: parseFloat(row.expenses),
        }));
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        throw new Error('Failed to fetch revenue data');
      }
    },

    /**
     * Get expense breakdown by category
     */
    expenseBreakdown: async (
      _: any,
      __: any,
      _context: GraphQLContext
    ): Promise<ExpenseBreakdown[]> => {
      try {
        const client = getClient();

        // Get expenses by category for the current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
        const lastDayOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

        const result = await client.query(
          `
          SELECT 
            category,
            COALESCE(SUM(ABS(amount)), 0) AS amount
          FROM transactions
          WHERE amount < 0 AND date BETWEEN $1 AND $2
          GROUP BY category
          ORDER BY amount DESC
        `,
          [firstDayOfMonth, lastDayOfMonth]
        );

        return result.rows.map((row) => ({
          category: row.category,
          amount: parseFloat(row.amount),
        }));
      } catch (error) {
        console.error('Error fetching expense breakdown:', error);
        throw new Error('Failed to fetch expense breakdown');
      }
    },
  },
};
