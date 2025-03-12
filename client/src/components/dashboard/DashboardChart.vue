<template>
  <div class="dashboard-charts">
    <div class="chart-grid">
      <!-- Revenue Trend Chart -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Revenue Trend</h3>
        </div>
        <div class="card__body h-80">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="loader"></div>
          </div>
          <div v-else-if="error" class="flex items-center justify-center h-full text-red-500">
            Failed to load chart data
          </div>
          <Line v-else :data="revenueChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Expense Breakdown Chart -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Expense Breakdown</h3>
        </div>
        <div class="card__body h-80">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="loader"></div>
          </div>
          <div v-else-if="error" class="flex items-center justify-center h-full text-red-500">
            Failed to load chart data
          </div>
          <Doughnut v-else :data="expenseChartData" :options="doughnutOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard Charts Component
 *
 * Displays charts for revenue trends and expense breakdown.
 *
 * @component
 */
import { computed } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { useDashboardStore } from '@/stores/dashboardStore'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
)

// Get dashboard store
const dashboardStore = useDashboardStore()

// Computed properties
const loading = computed(() => dashboardStore.loading)
const error = computed(() => dashboardStore.error)
const revenueChartData = computed(() => dashboardStore.revenueChartData)
const expenseChartData = computed(() => dashboardStore.expenseChartData)
const chartOptions = computed(() => dashboardStore.chartOptions)
const doughnutOptions = computed(() => dashboardStore.doughnutOptions)
</script>

<style lang="scss" scoped>
.dashboard-charts {
  margin-bottom: 2rem;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dark .loader {
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: #3498db;
}
</style>
