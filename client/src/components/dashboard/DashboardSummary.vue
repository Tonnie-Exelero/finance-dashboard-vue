<template>
  <div class="dashboard-summary">
    <!-- Summary Cards -->
    <div v-for="(card, index) in summaryCards" :key="index" class="summary-card">
      <div class="summary-card-content">
        <div class="summary-card-icon">
          <component :is="card.icon" />
        </div>
        <div class="summary-card-info">
          <div class="summary-card-title">
            {{ card.title }}
          </div>
          <div class="summary-card-value">
            {{ card.value }}
          </div>
        </div>
      </div>
      <div class="summary-card-footer">
        <a href="#">View details</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard Summary Component
 * 
 * Displays summary cards with key financial metrics.
 * 
 * @component
 */
import type { SummaryCard } from '@/types';

defineProps<{
  /**
   * Array of summary card data objects
   */
  summaryCards: SummaryCard[];
}>();
</script>