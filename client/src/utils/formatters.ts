/**
 * Formatter Utility Functions
 *
 * Provides utility functions for formatting data.
 *
 * @module utils/formatters
 */
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {string} [currencyCode] - Optional currency code (defaults to store setting)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value: number, currencyCode?: string): string {
  const settingsStore = useSettingsStore()
  const currency = currencyCode || settingsStore.currencyCode

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @param {string} [format] - Optional format (defaults to store setting)
 * @returns {string} Formatted date string
 */
export function formatDate(dateString: string, format?: string): string {
  if (dateString) {
    const settingsStore = useSettingsStore()
    const date = new Date(dateString)

    // Default format based on store setting
    if (!format) {
      switch (settingsStore.dateFormat) {
        case 'yyyy-MM-dd':
          return date.toISOString().split('T')[0]
        case 'MM/dd/yyyy':
          return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        case 'dd/MM/yyyy':
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        default:
          return date.toLocaleDateString()
      }
    }

    // Custom format
    return date.toLocaleDateString()
  } else {
    return ''
  }
}

/**
 * Get CSS class for transaction status
 * @param {string} status - The transaction status
 * @returns {string} CSS class for the status
 */
export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

/**
 * Format a number with thousands separators
 * @param {number} value - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value: number): string {
  return value ? new Intl.NumberFormat().format(value) : '0'
}

/**
 * Format a percentage
 * @param {number} value - The percentage value (e.g., 0.1 for 10%)
 * @param {boolean} [includeSymbol=true] - Whether to include the % symbol
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value: number, includeSymbol = true): string {
  const formatted = value ? (value * 100).toFixed(2) : '0.00'
  return includeSymbol ? `${formatted}%` : formatted
}
