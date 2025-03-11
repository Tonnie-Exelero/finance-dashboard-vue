import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockClient } from "../../../__tests__/setup";
import { chartResolvers } from "../charts";

describe("Chart Resolvers", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the mock implementation for each test
    mockClient.query.mockReset();
  });

  describe("Query resolvers", () => {
    it("fetches revenue data", async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
        rows: [
          {
            month: "Jan 2023",
            revenue: "3000.00",
            expenses: "1500.00",
          },
          {
            month: "Feb 2023",
            revenue: "3200.00",
            expenses: "1600.00",
          },
          {
            month: "Mar 2023",
            revenue: "3500.00",
            expenses: "1700.00",
          },
        ],
      }));

      const result = await chartResolvers.Query.revenueData(null, {}, {});

      expect(result).toHaveLength(3);
      expect(result[0].month).toBe("Jan 2023");
      expect(result[0].revenue).toBe(3000);
      expect(result[0].expenses).toBe(1500);

      expect(result[1].month).toBe("Feb 2023");
      expect(result[1].revenue).toBe(3200);
      expect(result[1].expenses).toBe(1600);

      expect(result[2].month).toBe("Mar 2023");
      expect(result[2].revenue).toBe(3500);
      expect(result[2].expenses).toBe(1700);

      // Verify the query was called
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("WITH months AS"),
      );
    });

    it("fetches expense breakdown", async () => {
      // Setup mock response for this specific test
      mockClient.query.mockImplementationOnce(() => ({
        rows: [
          {
            category: "Housing",
            amount: "800.00",
          },
          {
            category: "Food",
            amount: "400.00",
          },
          {
            category: "Transportation",
            amount: "300.00",
          },
        ],
      }));

      const result = await chartResolvers.Query.expenseBreakdown(null, {}, {});

      expect(result).toHaveLength(3);
      expect(result[0].category).toBe("Housing");
      expect(result[0].amount).toBe(800);

      expect(result[1].category).toBe("Food");
      expect(result[1].amount).toBe(400);

      expect(result[2].category).toBe("Transportation");
      expect(result[2].amount).toBe(300);

      // Verify the query was called
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.any(Array),
      );
    });

    it("handles database errors when fetching revenue data", async () => {
      // Setup mock to throw an error
      mockClient.query.mockRejectedValueOnce(new Error("Database error"));

      // Expect the resolver to throw an error
      await expect(
        chartResolvers.Query.revenueData(null, {}, {}),
      ).rejects.toThrow("Failed to fetch revenue data");
    });

    it("handles database errors when fetching expense breakdown", async () => {
      // Setup mock to throw an error
      mockClient.query.mockRejectedValueOnce(new Error("Database error"));

      // Expect the resolver to throw an error
      await expect(
        chartResolvers.Query.expenseBreakdown(null, {}, {}),
      ).rejects.toThrow("Failed to fetch expense breakdown");
    });

    it("handles empty data when fetching revenue data", async () => {
      // Setup mock response for empty result
      mockClient.query.mockImplementationOnce(() => ({
        rows: [],
      }));

      const result = await chartResolvers.Query.revenueData(null, {}, {});

      expect(result).toEqual([]);
    });

    it("handles empty data when fetching expense breakdown", async () => {
      // Setup mock response for empty result
      mockClient.query.mockImplementationOnce(() => ({
        rows: [],
      }));

      const result = await chartResolvers.Query.expenseBreakdown(null, {}, {});

      expect(result).toEqual([]);
    });
  });
});
