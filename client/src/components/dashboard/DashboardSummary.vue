<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Summary Cards -->
    <div v-for="(card, index) in summaryCards" :key="index" 
      class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component :is="card.icon" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ card.title }}
              </dt>
              <dd>
                <div class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ card.value }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            View details
          </a>
        </div>
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