/**
 * Transaction Resolvers
 *
 * Implements resolvers for transaction-related queries and mutations.
 *
 * @module graphql/resolvers/transactions
 */
import type {
  Transaction,
  TransactionInput,
  GraphQLContext,
  PaginationParams,
} from '../../types/index.js';

/**
 * Transaction resolvers
 */
export const transactionResolvers = {
  Query: {
    /**
     * Get transactions with optional pagination
     */
    transactions: async (
      _: unknown,
      { limit = 10, offset = 0 }: PaginationParams,
      context: GraphQLContext
    ): Promise<Transaction[]> => {
      try {
        const result = await context.db.query(
          'SELECT * FROM transactions ORDER BY date DESC LIMIT $1 OFFSET $2',
          [limit, offset]
        );

        return result.rows.map((row) => ({
          id: row.id.toString(),
          date: row.date.toISOString().split('T')[0],
          description: row.description,
          category: row.category,
          amount: parseFloat(row.amount),
          status: row.status,
        }));
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Failed to fetch transactions');
      }
    },

    /**
     * Get total count of transactions
     */
    transactionCount: async (_: unknown, __: unknown, context: GraphQLContext): Promise<number> => {
      try {
        const result = await context.db.query('SELECT COUNT(*) FROM transactions');
        return parseInt(result.rows[0].count, 10);
      } catch (error) {
        console.error('Error counting transactions:', error);
        throw new Error('Failed to count transactions');
      }
    },
  },

  Mutation: {
    /**
     * Add a new transaction
     */
    addTransaction: async (
      _: unknown,
      { input }: { input: TransactionInput },
      context: GraphQLContext
    ): Promise<Transaction> => {
      try {
        const { date, description, category, amount, status } = input;
        const result = await context.db.query(
          `INSERT INTO transactions (date, description, category, amount, status) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING *`,
          [date, description, category, amount, status]
        );

        const newTransaction = result.rows[0];
        return {
          id: newTransaction.id.toString(),
          date: newTransaction.date.toISOString().split('T')[0],
          description: newTransaction.description,
          category: newTransaction.category,
          amount: parseFloat(newTransaction.amount),
          status: newTransaction.status,
        };
      } catch (error) {
        console.error('Error adding transaction:', error);
        throw new Error('Failed to add transaction');
      }
    },

    /**
     * Update an existing transaction
     */
    updateTransaction: async (
      _: unknown,
      { id, input }: { id: string; input: TransactionInput },
      context: GraphQLContext
    ): Promise<Transaction> => {
      try {
        const { date, description, category, amount, status } = input;
        const result = await context.db.query(
          `UPDATE transactions 
           SET date = $1, description = $2, category = $3, amount = $4, status = $5 
           WHERE id = $6 
           RETURNING *`,
          [date, description, category, amount, status, parseInt(id, 10)]
        );

        if (result.rows.length === 0) {
          throw new Error(`Transaction with ID ${id} not found`);
        }

        const updatedTransaction = result.rows[0];
        return {
          id: updatedTransaction.id.toString(),
          date: updatedTransaction.date.toISOString().split('T')[0],
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          amount: parseFloat(updatedTransaction.amount),
          status: updatedTransaction.status,
        };
      } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Failed to update transaction');
      }
    },

    /**
     * Delete a transaction
     */
    deleteTransaction: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      try {
        const result = await context.db.query(
          'DELETE FROM transactions WHERE id = $1 RETURNING id',
          [parseInt(id, 10)]
        );

        if (result.rows.length === 0) {
          throw new Error(`Transaction with ID ${id} not found`);
        }

        return true;
      } catch (error) {
        console.error('Error deleting transaction:', error);
        throw new Error('Failed to delete transaction');
      }
    },
  },
};
