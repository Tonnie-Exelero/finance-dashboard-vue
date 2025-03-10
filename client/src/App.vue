<template>
  <div class="dashboard">
    <AppHeader @toggle-dark-mode="toggleDarkMode" :is-dark-mode="settingsStore.isDarkMode" />
    <main class="dashboard-main">
      <DashboardSummary :summary-cards="dashboardStore.summaryCards" />
      
      <div class="chart-grid">
        <DashboardCharts 
          :revenue-chart-data="dashboardStore.revenueChartData" 
          :expense-chart-data="dashboardStore.expenseChartData"
          :chart-options="dashboardStore.chartOptions"
          :doughnut-options="dashboardStore.doughnutOptions"
        />
      </div>
      
      <TransactionsTable />
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
 * @author Your Team
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
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue';
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
@import '@/styles/main.scss';
</style>