<template>
  <section>
    <div class="dashboard-grid">
      <div v-for="(card, index) in summaryCards" :key="index" class="summary-card">
        <div class="summary-card__icon">
          <component :is="card.icon" />
        </div>
        <div class="summary-card__content">
          <div class="summary-card__title">{{ card.title }}</div>
          <div class="summary-card__value">{{ card.value }}</div>
          <div
            v-if="card.percentChange !== undefined"
            class="summary-card__footer"
            :class="
              card.percentChange >= 0
                ? 'summary-card__footer--positive'
                : 'summary-card__footer--negative'
            "
          >
            <TrendingUpIcon v-if="card.percentChange >= 0" />
            <TrendingDownIcon v-else />
            <span>{{ Math.abs(card.percentChange).toFixed(2) }}% from last month</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Dashboard Summary Component
 *
 * Displays summary cards with key financial metrics.
 *
 * @component
 */
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-vue-next'
// eslint-disable-next-line
import type { SummaryCard } from '@/types'

defineProps<{
  /**
   * Array of summary card data objects
   */
  summaryCards: SummaryCard[]
}>()
</script>
