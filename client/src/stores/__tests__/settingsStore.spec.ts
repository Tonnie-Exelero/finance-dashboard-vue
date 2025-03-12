import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../settingsStore'

// Create a mock for localStorage that doesn't rely on window
const createLocalStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
}

// Create a mock for document.documentElement that doesn't rely on document
const createDocumentElementMock = () => ({
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
  },
})

describe('Settings Store', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>
  let documentElementMock: ReturnType<typeof createDocumentElementMock>

  beforeEach(() => {
    setActivePinia(createPinia())

    // Reset mocks
    localStorageMock = createLocalStorageMock()
    documentElementMock = createDocumentElementMock()

    // Mock the localStorage API
    vi.stubGlobal('localStorage', localStorageMock)

    // Mock the document.documentElement
    vi.stubGlobal('document', {
      documentElement: documentElementMock,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes with default values', () => {
    const store = useSettingsStore()
    expect(store.isDarkMode).toBe(false)
    expect(store.currencyCode).toBe('USD')
    expect(store.dateFormat).toBe('yyyy-MM-dd')
  })

  it('toggles dark mode', () => {
    const store = useSettingsStore()
    expect(store.isDarkMode).toBe(false)

    store.toggleDarkMode()
    expect(store.isDarkMode).toBe(true)
    expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark')

    store.toggleDarkMode()
    expect(store.isDarkMode).toBe(false)
    expect(documentElementMock.classList.remove).toHaveBeenCalledWith('dark')
  })

  it('sets currency code', () => {
    const store = useSettingsStore()
    expect(store.currencyCode).toBe('USD')

    store.setCurrencyCode('EUR')
    expect(store.currencyCode).toBe('EUR')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('currencyCode', 'EUR')
  })

  it('sets date format', () => {
    const store = useSettingsStore()
    expect(store.dateFormat).toBe('yyyy-MM-dd')

    store.setDateFormat('MM/dd/yyyy')
    expect(store.dateFormat).toBe('MM/dd/yyyy')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('dateFormat', 'MM/dd/yyyy')
  })

  it('initializes settings from localStorage', () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'darkMode') return 'dark'
      if (key === 'currencyCode') return 'JPY'
      if (key === 'dateFormat') return 'dd/MM/yyyy'
      return null
    })

    const store = useSettingsStore()
    store.initializeSettings()

    expect(store.isDarkMode).toBe(true)
    expect(store.currencyCode).toBe('JPY')
    expect(store.dateFormat).toBe('dd/MM/yyyy')
    expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark')
  })

  it('handles system preference for dark mode', () => {
    // Mock matchMedia
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    )

    const store = useSettingsStore()
    store.initializeSettings()

    // Since matchMedia returns true for dark mode, the store should initialize with dark mode
    expect(store.isDarkMode).toBe(true)
    expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark')

    vi.unstubAllGlobals()
  })
})
