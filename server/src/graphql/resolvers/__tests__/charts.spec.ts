import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockClient } from '../../../__tests__/setup';
import { chartResolvers } from '../charts';

describe('Chart Resolvers', () => {
  // Create a mock context with the db.query method
  const mockContext = {
    db: mockClient,
    authToken: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.query.mockReset();
  });

  describe('Query resolvers', () => {
    it('fetches revenue data', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          { month: 'Jan 2023', revenue: '3000.00', expenses: '1500.00' },
          { month: 'Feb 2023', revenue: '3200.00', expenses: '1600.00' },
          { month: 'Mar 2023', revenue: '3500.00', expenses: '1700.00' },
        ],
      });

      const result = await chartResolvers.Query.revenueData(null, {}, mockContext);

      expect(result).toEqual([
        { month: 'Jan 2023', revenue: 3000, expenses: 1500 },
        { month: 'Feb 2023', revenue: 3200, expenses: 1600 },
        { month: 'Mar 2023', revenue: 3500, expenses: 1700 },
      ]);

      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('WITH months AS'));
    });

    it('fetches expense breakdown', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          { category: 'Housing', amount: '800.00' },
          { category: 'Food', amount: '400.00' },
          { category: 'Transportation', amount: '300.00' },
        ],
      });

      const result = await chartResolvers.Query.expenseBreakdown(null, {}, mockContext);

      expect(result).toEqual([
        { category: 'Housing', amount: 800 },
        { category: 'Food', amount: 400 },
        { category: 'Transportation', amount: 300 },
      ]);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT category, COALESCE(SUM(ABS(amount)), 0)'),
        expect.any(Array)
      );
    });

    it('handles database errors when fetching revenue data', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(chartResolvers.Query.revenueData(null, {}, mockContext)).rejects.toThrow(
        'Failed to fetch revenue data'
      );
    });

    it('handles database errors when fetching expense breakdown', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(chartResolvers.Query.expenseBreakdown(null, {}, mockContext)).rejects.toThrow(
        'Failed to fetch expense breakdown'
      );
    });

    it('handles empty data when fetching revenue data', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const result = await chartResolvers.Query.revenueData(null, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('handles empty data when fetching expense breakdown', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const result = await chartResolvers.Query.expenseBreakdown(null, {}, mockContext);
      expect(result).toEqual([]);
    });
  });
});
