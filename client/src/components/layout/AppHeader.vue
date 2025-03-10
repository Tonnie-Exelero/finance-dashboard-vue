<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <BarChart2Icon size="24" />
        <span>Financial Dashboard</span>
      </div>
      <div class="header__actions">
        <button 
          @click="$emit('toggle-dark-mode')" 
          class="header__theme-toggle"
          aria-label="Toggle dark mode"
        >
          <SunIcon v-if="isDarkMode" />
          <MoonIcon v-else />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Application Header Component
 * 
 * Displays the application title and dark mode toggle button.
 * 
 * @component
 * @emits toggle-dark-mode - Emitted when the dark mode toggle button is clicked
 */
import { BarChart2Icon, SunIcon, MoonIcon } from 'lucide-vue-next';

defineProps<{
  /**
   * Whether dark mode is currently enabled
   */
  isDarkMode: boolean;
}>();

defineEmits<{
  /**
   * Emitted when the dark mode toggle button is clicked
   */
  (e: 'toggle-dark-mode'): void;
}>();
</script>

<style lang="scss" scoped>
// Component-specific styles can be added here if needed
// Most styles are in the global SCSS file: src/styles/layout/_header.scss
</style>