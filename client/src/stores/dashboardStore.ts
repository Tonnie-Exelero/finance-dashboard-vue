/**
 * Dashboard Store
 * 
 * Manages the state for the dashboard, including summary data and charts.
 * 
 * @module stores/dashboardStore
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-vue-next';
import { formatCurrency } from '@/utils/formatters';
import type { 
  SummaryData, 
  RevenueData, 
  ExpenseBreakdown, 
  SummaryCard,
  ChartData,
  ChartOptions
} from '@/types';

// GraphQL query for dashboard data
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    summaryData {
      totalBalance
      monthlyExpenses
      monthlyIncome
    }
    revenueData {
      month
      revenue
      expenses
    }
    expenseBreakdown {
      category
      amount
    }
  }
`;

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const summaryData = ref<SummaryData>({
    totalBalance: 0,
    monthlyExpenses: 0,
    monthlyIncome: 0
  });
  
  const revenueData = ref<RevenueData[]>([]);
  const expenseBreakdown = ref<ExpenseBreakdown[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const isDarkMode = ref(false);

  // Apollo query setup
  const { onResult, onError, refetch } = useQuery(GET_DASHBOARD_DATA, {
    fetchPolicy: 'cache-and-network', // Consider using cache-and-network for a better UX
  });

  onResult((result) => {
    if (result.data) {
      summaryData.value = result.data.summaryData;
      revenueData.value = result.data.revenueData;
      expenseBreakdown.value = result.data.expenseBreakdown;
    }
    loading.value = false;
  });

  onError((err) => {
    error.value = err;
    loading.value = false;
  });

  // Computed properties
  const summaryCards = computed<SummaryCard[]>(() => [
    {
      title: 'Total Balance',
      value: formatCurrency(summaryData.value.totalBalance),
      icon: DollarSign
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summaryData.value.monthlyExpenses),
      icon: CreditCard
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summaryData.value.monthlyIncome),
      icon: TrendingUp
    }
  ]);

  const revenueChartData = computed<ChartData>(() => {
    const months = revenueData.value.map(item => item.month);
    const revenue = revenueData.value.map(item => item.revenue);
    const expenses = revenueData.value.map(item => item.expenses);

    return {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgb(99, 102, 241)',
          data: revenue,
          tension: 0.4
        },
        {
          label: 'Expenses',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgb(239, 68, 68)',
          data: expenses,
          tension: 0.4
        }
      ]
    };
  });

  const expenseChartData = computed<ChartData>(() => {
    const categories = expenseBreakdown.value.map(item => item.category);
    const amounts = expenseBreakdown.value.map(item => item.amount);

    return {
      labels: categories,
      datasets: [
        {
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(14, 165, 233, 0.8)'
          ],
          data: amounts
        }
      ]
    };
  });

  const chartOptions = computed<ChartOptions>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      x: {
        grid: {
          color: isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  }));

  const doughnutOptions = computed<ChartOptions>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  }));

  // Actions
  async function fetchDashboardData() {
    loading.value = true;
    error.value = null;
    try {
      await refetch();
      loading.value = false;
    } catch (err: any) {
      error.value = err;
      loading.value = false;
    }
  }

  function setDarkMode(value: boolean) {
    isDarkMode.value = value;
  }

  return {
    // State
    summaryData,
    revenueData,
    expenseBreakdown,
    loading,
    error,
    isDarkMode,
    
    // Getters
    summaryCards,
    revenueChartData,
    expenseChartData,
    chartOptions,
    doughnutOptions,
    
    // Actions
    fetchDashboardData,
    setDarkMode
  };
});