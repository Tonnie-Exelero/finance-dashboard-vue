import { describe, it, expect, vi } from 'vitest'
import {
  formatCurrency,
  formatDate,
  getStatusClass,
  formatNumber,
  formatPercentage,
} from '../formatters'

// Mock the settings store
vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => ({
    currencyCode: 'USD',
    dateFormat: 'yyyy-MM-dd',
  }),
}))

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    it('formats a number as USD currency by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(-500)).toBe('-$500.00')
    })

    it('formats a number with a specified currency code', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00')
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000.00')
    })

    it('handles zero values correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('handles null or undefined values', () => {
      expect(formatCurrency(null as any)).toBe('$0.00')
      expect(formatCurrency(undefined as any)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('formats a date string according to the default format', () => {
      const date = '2023-05-15'
      expect(formatDate(date)).toBe('2023-05-15')
    })

    it('handles different date formats', () => {
      const date = '2023-05-15'
      const formattedDate = formatDate(date, 'MM/dd/yyyy')
      expect(formattedDate).toBeDefined()
    })

    it('handles null or undefined values', () => {
      expect(formatDate(null as any)).toBe('')
      expect(formatDate(undefined as any)).toBe('')
    })
  })

  describe('getStatusClass', () => {
    it('returns the correct CSS class for completed status', () => {
      expect(getStatusClass('completed')).toBe(
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      )
    })

    it('returns the correct CSS class for pending status', () => {
      expect(getStatusClass('pending')).toBe(
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      )
    })

    it('returns the correct CSS class for failed status', () => {
      expect(getStatusClass('failed')).toBe(
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      )
    })

    it('returns the default CSS class for unknown status', () => {
      expect(getStatusClass('unknown')).toBe(
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      )
    })

    it('is case insensitive', () => {
      expect(getStatusClass('COMPLETED')).toBe(
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      )
      expect(getStatusClass('Pending')).toBe(
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      )
    })
  })

  describe('formatNumber', () => {
    it('formats a number with thousands separators', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(1234.56)).toBe('1,234.56')
    })

    it('handles zero values correctly', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('handles negative values correctly', () => {
      expect(formatNumber(-1000)).toBe('-1,000')
    })

    it('handles null or undefined values', () => {
      expect(formatNumber(null as any)).toBe('0')
      expect(formatNumber(undefined as any)).toBe('0')
    })
  })

  describe('formatPercentage', () => {
    it('formats a decimal as a percentage with symbol by default', () => {
      expect(formatPercentage(0.1)).toBe('10.00%')
      expect(formatPercentage(0.055)).toBe('5.50%')
      expect(formatPercentage(-0.25)).toBe('-25.00%')
    })

    it('formats a decimal as a percentage without symbol when specified', () => {
      expect(formatPercentage(0.1, false)).toBe('10.00')
      expect(formatPercentage(0.055, false)).toBe('5.50')
    })

    it('handles zero values correctly', () => {
      expect(formatPercentage(0)).toBe('0.00%')
    })

    it('handles null or undefined values', () => {
      expect(formatPercentage(null as any)).toBe('0.00%')
      expect(formatPercentage(undefined as any)).toBe('0.00%')
    })
  })
})
