<template>
  <header class="header">
    <div class="header-container">
      <div class="header-content">
        <div class="header-logo">
          <h1>Financial Dashboard</h1>
        </div>
        <div class="header-actions">
          <button 
            @click="$emit('toggle-dark-mode')" 
            class="theme-toggle"
            aria-label="Toggle dark mode"
          >
            <sun-icon v-if="isDarkMode" />
            <moon-icon v-else />
          </button>
        </div>
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
import { SunIcon, MoonIcon } from 'lucide-vue-next';

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