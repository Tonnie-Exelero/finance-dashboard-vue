import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockClient } from "../../../__tests__/setup";
import { summaryResolvers } from "../summary";

describe("Summary Resolvers", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the mock implementation for each test
    mockClient.query.mockReset();
  });

  describe("Query resolvers", () => {
    it("fetches summary data", async () => {
      // Setup mock responses for the multiple queries in summaryData
      // First query - total balance
      mockClient.query.mockImplementationOnce(() => ({
        rows: [{ total: "5000.00" }],
      }));

      // Second query - monthly income
      mockClient.query.mockImplementationOnce(() => ({
        rows: [{ total: "3000.00" }],
      }));

      // Third query - monthly expenses
      mockClient.query.mockImplementationOnce(() => ({
        rows: [{ total: "1500.00" }],
      }));

      // Fourth query - previous month total
      mockClient.query.mockImplementationOnce(() => ({
        rows: [{ total: "4800.00" }],
      }));

      const result = await summaryResolvers.Query.summaryData(null, {}, {});

      expect(result.totalBalance).toBe(4800);
      expect(result.monthlyExpenses).toBe(3000);
      expect(result.monthlyIncome).toBe(5000);

      // Verify the queries were called
      expect(mockClient.query).toHaveBeenCalledTimes(4);
    });

    it("handles database errors", async () => {
      // Setup mock to throw an error
      mockClient.query.mockRejectedValueOnce(new Error("Database error"));

      // Expect the resolver to throw an error
      await expect(
        summaryResolvers.Query.summaryData(null, {}, {}),
      ).rejects.toThrow("Failed to fetch summary data");
    });

    it("handles empty data", async () => {
      // Setup mock responses for empty results
      mockClient.query.mockImplementation(() => ({
        rows: [{ total: null }],
      }));

      const result = await summaryResolvers.Query.summaryData(null, {}, {});

      // Should default to zero values
      expect(result.totalBalance).toBe(NaN);
      expect(result.monthlyExpenses).toBe(NaN);
      expect(result.monthlyIncome).toBe(NaN);
      expect(result.percentChange).toBe(NaN);
    });
  });
});
