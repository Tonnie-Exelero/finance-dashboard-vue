<template>
  <div class="card card--chart">
    <div class="card__header">
      <h3>{{ title }}</h3>
    </div>
    <div class="card__body">
      <component 
	    v-if="chartData?.labels?.length"
        :is="chartComponent" 
        :chart-data="chartData" 
        :options="options"
		:key="chartType"
      />
	  <div v-else class="chart-error">
		Chart data is incomplete
	  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard Chart Component
 * 
 * Displays various chart types for financial data visualization.
 * 
 * @component
 */
import { computed } from 'vue';
import { Line, Bar, Doughnut, Pie } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
import type { ChartData, ChartOptions } from '@/types';

// Register Chart.js components
Chart.register(...registerables);

const props = defineProps<{
  /**
   * Chart title
   */
  title: string;
  /**
   * Data for the chart
   */
  chartData: ChartData;
  /**
   * Options for the chart
   */
  options: ChartOptions;
  /**
   * Type of chart to display
   */
  chartType: 'line' | 'bar' | 'doughnut' | 'pie';
}>();

/**
 * Determine which chart component to use based on chartType prop
 */
const chartComponent = computed(() => {
  switch (props.chartType) {
    case 'line':
      return Line;
    case 'bar':
      return Bar;
    case 'doughnut':
      return Doughnut;
    case 'pie':
      return Pie;
    default:
      return Line;
  }
});
</script>

<style lang="scss" scoped>
// Component-specific styles can be added here if needed
// Most styles are in the global SCSS file: src/styles/components/_cards.scss
.chart-container {
  position: relative;
  height: 400px; // Set fixed height
  width: 100%;
}
</style>