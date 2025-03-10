<template>
  <header class="bg-white dark:bg-gray-800 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Financial Dashboard</h1>
          </div>
        </div>
        <div class="flex items-center">
          <button 
            @click="$emit('toggle-dark-mode')" 
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            <sun-icon v-if="isDarkMode" class="h-5 w-5" />
            <moon-icon v-else class="h-5 w-5" />
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