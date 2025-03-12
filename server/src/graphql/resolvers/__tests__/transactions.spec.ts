import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockClient } from '../../../__tests__/setup';
import { transactionResolvers } from '../transactions';

describe('Transaction Resolvers', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the mock implementation for each test
    mockClient.query.mockReset();
  });

  describe('Query resolvers', () => {
    it('fetches transactions with pagination', async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
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
      }));

      const result = await transactionResolvers.Query.transactions(
        null,
        { limit: 10, offset: 0 },
        {}
      );

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].description).toBe('Salary');
      expect(result[1].id).toBe('2');
      expect(result[1].description).toBe('Rent');

      // Verify the query was called with the correct parameters
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM transactions'),
        [10, 0]
      );
    });

    it('counts transactions', async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
        rows: [{ count: '2' }],
      }));

      const result = await transactionResolvers.Query.transactionCount(null, {}, {});

      expect(result).toBe(2);

      // Verify the query was called
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) FROM transactions')
      );
    });

    it('handles database errors when fetching transactions', async () => {
      // Setup mock to throw an error
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));

      // Expect the resolver to throw an error
      await expect(
        transactionResolvers.Query.transactions(null, { limit: 10, offset: 0 }, {})
      ).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('Mutation resolvers', () => {
    it('adds a transaction', async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
        rows: [
          {
            id: 3,
            date: new Date('2023-02-01'),
            description: 'New Transaction',
            category: 'Food',
            amount: -50.0,
            status: 'Pending',
          },
        ],
      }));

      const input = {
        date: '2023-02-01',
        description: 'New Transaction',
        category: 'Food',
        amount: -50.0,
        status: 'Pending',
      };

      const result = await transactionResolvers.Mutation.addTransaction(null, { input }, {});

      expect(result.id).toBe('3');
      expect(result.description).toBe('New Transaction');
      expect(result.amount).toBe(-50);

      // Verify the query was called with the correct parameters
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO transactions'),
        expect.arrayContaining(['2023-02-01', 'New Transaction', 'Food', -50.0, 'Pending'])
      );
    });

    it('updates a transaction', async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
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
      }));

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
        {}
      );

      expect(result.id).toBe('1');
      expect(result.description).toBe('Updated Salary');
      expect(result.amount).toBe(5500);

      // Verify the query was called with the correct parameters
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions'),
        expect.arrayContaining(['2023-01-15', 'Updated Salary', 'Income', 5500.0, 'Completed', '1'])
      );
    });

    it('deletes a transaction', async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
        rows: [{ id: 2 }],
      }));

      const result = await transactionResolvers.Mutation.deleteTransaction(null, { id: '2' }, {});

      expect(result).toBe(true);

      // Verify the query was called with the correct parameters
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM transactions'),
        ['2']
      );
    });

    it('handles database errors when adding a transaction', async () => {
      // Setup mock to throw an error
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));

      const input = {
        date: '2023-02-01',
        description: 'New Transaction',
        category: 'Food',
        amount: -50.0,
        status: 'Pending',
      };

      // Expect the resolver to throw an error
      await expect(
        transactionResolvers.Mutation.addTransaction(null, { input }, {})
      ).rejects.toThrow('Failed to add transaction');
    });

    it('handles not found error when updating a transaction', async () => {
      // Setup mock response for an empty result (transaction not found)
      mockClient.query.mockImplementationOnce(() => ({
        rows: [],
      }));

      const input = {
        date: '2023-01-15',
        description: 'Updated Salary',
        category: 'Income',
        amount: 5500.0,
        status: 'Completed',
      };

      // Expect the resolver to throw an error
      await expect(
        transactionResolvers.Mutation.updateTransaction(null, { id: '999', input }, {})
      ).rejects.toThrow('Failed to update transaction');
    });

    it('handles not found error when deleting a transaction', async () => {
      // Setup mock response for an empty result (transaction not found)
      mockClient.query.mockImplementationOnce(() => ({
        rows: [],
      }));

      // Expect the resolver to throw an error
      await expect(
        transactionResolvers.Mutation.deleteTransaction(null, { id: '999' }, {})
      ).rejects.toThrow('Failed to delete transaction');
    });
  });
});
