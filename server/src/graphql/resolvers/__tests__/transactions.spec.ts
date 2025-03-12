import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockClient } from '../../../__tests__/setup.js';
import { transactionResolvers } from '../transactions.js';

describe('Transaction Resolvers', () => {
  const mockContext = {
    db: mockClient,
    authToken: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
  });

  describe('Query resolvers', () => {
    it('fetches transactions with pagination', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            date: new Date('2023-01-15'),
            description: 'Salary',
            category: 'Income',
            amount: 5000.0,
            status: 'Completed',
          },
          {
            id: 2,
            date: new Date('2023-01-20'),
            description: 'Rent',
            category: 'Housing',
            amount: -1500.0,
            status: 'Completed',
          },
        ],
      });

      const result = await transactionResolvers.Query.transactions(
        null,
        { limit: 10, offset: 0 },
        mockContext
      );

      expect(result).toEqual([
        {
          id: '1',
          date: '2023-01-15',
          description: 'Salary',
          category: 'Income',
          amount: 5000,
          status: 'Completed',
        },
        {
          id: '2',
          date: '2023-01-20',
          description: 'Rent',
          category: 'Housing',
          amount: -1500,
          status: 'Completed',
        },
      ]);

      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM transactions ORDER BY date DESC LIMIT $1 OFFSET $2',
        [10, 0]
      );
    });

    it('counts transactions', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '2' }] });

      const result = await transactionResolvers.Query.transactionCount(null, {}, mockContext);

      expect(result).toBe(2);
      expect(mockClient.query).toHaveBeenCalledWith('SELECT COUNT(*) FROM transactions');
    });

    it('handles database errors when fetching transactions', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        transactionResolvers.Query.transactions(null, { limit: 10, offset: 0 }, mockContext)
      ).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('Mutation resolvers', () => {
    const mockTransaction = {
      id: '1',
      date: '2023-01-15',
      description: 'Salary',
      category: 'Income',
      amount: 5000,
      status: 'Completed',
    };

    it('adds a transaction', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            date: new Date('2023-01-15'),
            description: 'Salary',
            category: 'Income',
            amount: 5000.0,
            status: 'Completed',
          },
        ],
      });

      const input = {
        date: '2023-01-15',
        description: 'Salary',
        category: 'Income',
        amount: 5000.0,
        status: 'Completed',
      };

      const result = await transactionResolvers.Mutation.addTransaction(
        null,
        { input },
        mockContext
      );

      expect(result).toEqual(mockTransaction);
    });

    it('updates a transaction', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            date: new Date('2023-01-15'),
            description: 'Updated Salary',
            category: 'Income',
            amount: 5500.0,
            status: 'Completed',
          },
        ],
      });

      const input = {
        date: '2023-01-15',
        description: 'Updated Salary',
        category: 'Income',
        amount: 5500.0,
        status: 'Completed',
      };

      const result = await transactionResolvers.Mutation.updateTransaction(
        null,
        { id: '1', input },
        mockContext
      );

      expect(result).toEqual({
        ...mockTransaction,
        description: 'Updated Salary',
        amount: 5500,
      });
    });

    it('deletes a transaction', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const result = await transactionResolvers.Mutation.deleteTransaction(
        null,
        { id: '1' },
        mockContext
      );

      expect(result).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM transactions WHERE id = $1 RETURNING id',
        [1]
      );
    });

    it('handles database errors when adding a transaction', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));

      const input = {
        date: '2023-01-15',
        description: 'Salary',
        category: 'Income',
        amount: 5000.0,
        status: 'Completed',
      };

      await expect(
        transactionResolvers.Mutation.addTransaction(null, { input }, mockContext)
      ).rejects.toThrow('Failed to add transaction');
    });

    it('handles not found error when updating a transaction', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const input = {
        date: '2023-01-15',
        description: 'Updated Salary',
        category: 'Income',
        amount: 5500.0,
        status: 'Completed',
      };

      await expect(
        transactionResolvers.Mutation.updateTransaction(null, { id: '999', input }, mockContext)
      ).rejects.toThrow('Failed to update transaction');
    });

    it('handles not found error when deleting a transaction', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        transactionResolvers.Mutation.deleteTransaction(null, { id: '999' }, mockContext)
      ).rejects.toThrow('Failed to delete transaction');
    });
  });
});
