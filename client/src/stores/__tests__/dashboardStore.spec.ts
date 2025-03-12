import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useDashboardStore } from "../dashboardStore";

// Mock the Apollo composable
vi.mock("@vue/apollo-composable", () => {
  const mockResult = ref({
    data: {
      summaryData: {
        totalBalance: 5000,
        monthlyExpenses: 1500,
        monthlyIncome: 3000,
        percentChange: 0.05,
      },
      revenueData: [
        { month: "Jan 2023", revenue: 3000, expenses: 1500 },
        { month: "Feb 2023", revenue: 3200, expenses: 1600 },
      ],
      expenseBreakdown: [
        { category: "Housing", amount: 800 },
        { category: "Food", amount: 400 },
      ],
    },
  });

  return {
    useQuery: vi.fn(() => ({
      onResult: vi.fn((callback) => {
        callback(mockResult.value);
        return { off: vi.fn() };
      }),
      onError: vi.fn((callback) => {
        return { off: vi.fn() };
      }),
      refetch: vi.fn().mockResolvedValue(mockResult.value),
    })),
  };
});

// Mock Lucide icons
vi.mock("lucide-vue-next", () => ({
  DollarSign: {},
  CreditCard: {},
  TrendingUp: {},
}));

describe("Dashboard Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with default values", () => {
    const store = useDashboardStore();

    expect(store.summaryData).toEqual({
      totalBalance: 5000,
      monthlyExpenses: 1500,
      monthlyIncome: 3000,
      percentChange: 0.05,
    });

    expect(store.revenueData).toEqual([
      { month: "Jan 2023", revenue: 3000, expenses: 1500 },
      { month: "Feb 2023", revenue: 3200, expenses: 1600 },
    ]);
    expect(store.expenseBreakdown).toEqual([
      { category: "Housing", amount: 800 },
      { category: "Food", amount: 400 },
    ]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.isDarkMode).toBe(false);
  });

  it("loads data from the API", async () => {
    const store = useDashboardStore();

    // The store should have loaded data from the mock API
    expect(store.summaryData.totalBalance).toBe(5000);
    expect(store.summaryData.monthlyExpenses).toBe(1500);
    expect(store.summaryData.monthlyIncome).toBe(3000);
    expect(store.summaryData.percentChange).toBe(0.05);

    expect(store.revenueData).toHaveLength(2);
    expect(store.revenueData[0].month).toBe("Jan 2023");

    expect(store.expenseBreakdown).toHaveLength(2);
    expect(store.expenseBreakdown[0].category).toBe("Housing");

    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("computes summary cards correctly", () => {
    const store = useDashboardStore();
    const cards = store.summaryCards;

    expect(cards).toHaveLength(3);

    expect(cards[0].title).toBe("Total Balance");
    expect(cards[0].value).toBe("$5,000.00");
    expect(cards[0].percentChange).toBe(0.05);

    expect(cards[1].title).toBe("Monthly Expenses");
    expect(cards[1].value).toBe("$1,500.00");

    expect(cards[2].title).toBe("Monthly Income");
    expect(cards[2].value).toBe("$3,000.00");
  });

  it("computes revenue chart data correctly", () => {
    const store = useDashboardStore();
    const chartData = store.revenueChartData;

    expect(chartData.labels).toEqual(["Jan 2023", "Feb 2023"]);
    expect(chartData.datasets).toHaveLength(2);

    expect(chartData.datasets[0].label).toBe("Revenue");
    expect(chartData.datasets[0].data).toEqual([3000, 3200]);

    expect(chartData.datasets[1].label).toBe("Expenses");
    expect(chartData.datasets[1].data).toEqual([1500, 1600]);
  });

  it("computes expense chart data correctly", () => {
    const store = useDashboardStore();
    const chartData = store.expenseChartData;

    expect(chartData.labels).toEqual(["Housing", "Food"]);
    expect(chartData.datasets).toHaveLength(1);

    expect(chartData.datasets[0].label).toBe("Expenses by Category");
    expect(chartData.datasets[0].data).toEqual([800, 400]);
  });

  it("handles empty data gracefully", async () => {
    // Mock empty data response
    vi.mocked(useQuery).mockReturnValueOnce({
      onResult: vi.fn((callback) => {
        callback({ data: null });
        return { off: vi.fn() };
      }),
      onError: vi.fn(),
      refetch: vi.fn().mockResolvedValue({ data: null }),
    } as any);

    const store = useDashboardStore();

    // Even with empty data, chart data should be defined with defaults
    expect(store.revenueChartData).toBeDefined();
    expect(store.revenueChartData.labels).toEqual([]);
    expect(store.revenueChartData.datasets).toEqual([]);

    expect(store.expenseChartData).toBeDefined();
    expect(store.expenseChartData.labels).toEqual([]);
    expect(store.expenseChartData.datasets).toEqual([]);
  });

  it("handles errors gracefully", async () => {
    // Mock error response
    const testError = new Error("API error");
    vi.mocked(useQuery).mockReturnValueOnce({
      onResult: vi.fn(),
      onError: vi.fn((callback) => {
        callback(testError);
        return { off: vi.fn() };
      }),
      refetch: vi.fn().mockRejectedValue(testError),
    } as any);

    const store = useDashboardStore();

    // The store should have set the error state
    expect(store.error).toBe(testError);
    expect(store.loading).toBe(false);
  });

  it("updates dark mode setting", () => {
    const store = useDashboardStore();

    expect(store.isDarkMode).toBe(false);

    store.setDarkMode(true);
    expect(store.isDarkMode).toBe(true);

    // Chart options should reflect dark mode
    expect(store.chartOptions.scales?.y?.grid?.color).toContain(
      "255, 255, 255",
    );

    store.setDarkMode(false);
    expect(store.isDarkMode).toBe(false);

    // Chart options should reflect light mode
    expect(store.chartOptions.scales?.y?.grid?.color).toContain("0, 0, 0");
  });
});
