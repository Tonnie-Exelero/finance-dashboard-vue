<template>
  <div>
	<div class="chart-card">
		<div class="chart-card-header">
		<h3 class="chart-card-title">Revenue Trend</h3>
		</div>
		<div class="chart-card-content">
		<line-chart :chart-data="revenueChartData" :options="chartOptions" />
		</div>
	</div>

	<div class="chart-card">
		<div class="chart-card-header">
		<h3 class="chart-card-title">Expense Breakdown</h3>
		</div>
		<div class="chart-card-content">
		<doughnut-chart :chart-data="expenseChartData" :options="doughnutOptions" />
		</div>
	</div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard Charts Component
 * 
 * Displays revenue trend and expense breakdown charts.
 * 
 * @component
 */
import { LineChart, DoughnutChart } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
import type { ChartData, ChartOptions } from '@/types';

// Register Chart.js components
Chart.register(...registerables);

defineProps<{
  /**
   * Data for the revenue chart
   */
  revenueChartData: ChartData;
  /**
   * Data for the expense chart
   */
  expenseChartData: ChartData;
  /**
   * Options for the line chart
   */
  chartOptions: ChartOptions;
  /**
   * Options for the doughnut chart
   */
  doughnutOptions: ChartOptions;
}>();
</script>