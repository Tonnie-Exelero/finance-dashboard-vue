<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader @toggle-dark-mode="toggleDarkMode" :is-dark-mode="settingsStore.isDarkMode" />
    <main class="main">
      <DashboardSummary :summary-cards="dashboardStore.summaryCards" />
      
      <div class="chart-grid">
        <DashboardChart 
          title="Revenue Trend" 
          :chart-data="dashboardStore.revenueChartData" 
          :options="dashboardStore.chartOptions"
          chart-type="line"
        />
        
        <DashboardChart 
          title="Expense Breakdown" 
          :chart-data="dashboardStore.expenseChartData"
          :options="dashboardStore.doughnutOptions"
          chart-type="doughnut"
        />
      </div>
      
      <div class="transactions-section">
        <TransactionsTable />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Main App Component
 * 
 * This is the root component of the Financial Dashboard application.
 * It initializes the stores and serves as the container for all dashboard components.
 * 
 * @author Financial Dashboard Team
 * @version 1.0.0
 */
import { onMounted } from 'vue';
import { useApolloClient } from '@/composables/useApolloClient';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useSettingsStore } from '@/stores/settingsStore';

// Components
import AppHeader from '@/components/layout/AppHeader.vue';
import DashboardSummary from '@/components/dashboard/DashboardSummary.vue';
import DashboardChart from '@/components/dashboard/DashboardChart.vue';
import TransactionsTable from '@/components/dashboard/TransactionsTable.vue';

// Initialize Apollo client
useApolloClient();

// Initialize stores
const dashboardStore = useDashboardStore();
const transactionsStore = useTransactionsStore();
const settingsStore = useSettingsStore();

// Toggle dark mode
const toggleDarkMode = () => {
  settingsStore.toggleDarkMode();
  dashboardStore.setDarkMode(settingsStore.isDarkMode);
};

// Initialize app on mount
onMounted(() => {
  // Initialize settings from localStorage
  settingsStore.initializeSettings();
  
  // Set dark mode in dashboard store
  dashboardStore.setDarkMode(settingsStore.isDarkMode);
  
  // Fetch initial data
  dashboardStore.fetchDashboardData();
  transactionsStore.fetchTransactions();
});
</script>

<style lang="scss">
@use '@/styles/main.scss';
</style>