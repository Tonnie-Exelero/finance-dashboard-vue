import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockClient } from '../../../__tests__/setup';
import { summaryResolvers } from '../summary';

describe('Summary Resolvers', () => {
  const mockContext = {
    db: mockClient,
    authToken: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
  });

  describe('Query resolvers', () => {
    it('fetches summary data', async () => {
      // Mock responses in order of: income, expenses, previous month, balance
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ total: '3000.00' }] }) // Income
        .mockResolvedValueOnce({ rows: [{ total: '1500.00' }] }) // Expenses
        .mockResolvedValueOnce({ rows: [{ total: '4800.00' }] }) // Previous month
        .mockResolvedValueOnce({ rows: [{ total: '5000.00' }] }); // Balance

      const result = await summaryResolvers.Query.summaryData(null, {}, mockContext);

      // Verify calculated values
      expect(result).toEqual({
        totalBalance: 5000,
        monthlyExpenses: 1500,
        monthlyIncome: 3000,
        percentChange: ((1500 - 4800) / 4800) * 100, // (current - previous)/previous * 100
      });

      // Verify query count and parameters
      expect(mockClient.query).toHaveBeenCalledTimes(4);
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('WHERE amount > 0'),
        expect.any(Array)
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('WHERE amount < 0'),
        expect.any(Array)
      );
    });

    it('handles database errors', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));
      await expect(summaryResolvers.Query.summaryData(null, {}, mockContext)).rejects.toThrow(
        'Failed to fetch summary data'
      );
    });

    it('handles empty data with COALESCE defaults', async () => {
      // Mock all queries returning zero values
      mockClient.query.mockResolvedValue({ rows: [{ total: '0' }] });

      const result = await summaryResolvers.Query.summaryData(null, {}, mockContext);

      expect(result).toEqual({
        totalBalance: 0,
        monthlyExpenses: 0,
        monthlyIncome: 0,
        percentChange: 0, // (0 - 0)/0 becomes 0 in our calculation
      });
    });

    it('calculates percent change correctly with zero previous month', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ total: '2000.00' }] })
        .mockResolvedValueOnce({ rows: [{ total: '500.00' }] })
        .mockResolvedValueOnce({ rows: [{ total: '0.00' }] })
        .mockResolvedValueOnce({ rows: [{ total: '1500.00' }] });

      const result = await summaryResolvers.Query.summaryData(null, {}, mockContext);
      expect(result.percentChange).toBe(Infinity); // (1500 - 0)/0 * 100
    });
  });
});
