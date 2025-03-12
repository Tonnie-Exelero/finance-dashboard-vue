/**
 * Settings Store
 *
 * Manages application settings like dark mode, currency format, etc.
 *
 * @module stores/settingsStore
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const isDarkMode = ref(false)
  const currencyCode = ref('USD')
  const dateFormat = ref('yyyy-MM-dd')

  // Initialize state from localStorage
  function initializeSettings() {
    // Check for dark mode preference
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode) {
      isDarkMode.value = storedDarkMode === 'dark'
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDarkMode.value = true
    }

    // Check for currency preference
    const storedCurrency = localStorage.getItem('currencyCode')
    if (storedCurrency) {
      currencyCode.value = storedCurrency
    }

    // Check for date format preference
    const storedDateFormat = localStorage.getItem('dateFormat')
    if (storedDateFormat) {
      dateFormat.value = storedDateFormat
    }

    // Apply dark mode to document
    updateDocumentClass()
  }

  // Actions
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    updateDocumentClass()
  }

  function setCurrencyCode(code: string) {
    currencyCode.value = code
    localStorage.setItem('currencyCode', code)
  }

  function setDateFormat(format: string) {
    dateFormat.value = format
    localStorage.setItem('dateFormat', format)
  }

  function updateDocumentClass() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Watch for changes to isDarkMode and update localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('darkMode', newValue ? 'dark' : 'light')
  })

  return {
    // State
    isDarkMode,
    currencyCode,
    dateFormat,

    // Actions
    initializeSettings,
    toggleDarkMode,
    setCurrencyCode,
    setDateFormat,
  }
})
