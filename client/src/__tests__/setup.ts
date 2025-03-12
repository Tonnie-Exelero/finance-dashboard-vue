import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Lucide Vue icons
vi.mock('lucide-vue-next', () => {
  // Create a factory function for creating icon components
  const createIconComponent = (name: string) => ({
    name,
    render: () => null,
  })

  return {
    DollarSign: createIconComponent('DollarSign'),
    CreditCard: createIconComponent('CreditCard'),
    TrendingUp: createIconComponent('TrendingUp'),
    Moon: createIconComponent('MoonIcon'),
    Sun: createIconComponent('SunIcon'),
    ChevronDown: createIconComponent('ChevronDown'),
    ChevronUp: createIconComponent('ChevronUp'),
    Search: createIconComponent('Search'),
    Filter: createIconComponent('Filter'),
    Plus: createIconComponent('Plus'),
    Edit: createIconComponent('Edit'),
    Trash: createIconComponent('Trash'),
  }
})

// Mock vue-chartjs and chart.js
vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    props: ['data', 'options'],
    template: '<div data-testid="line-chart"></div>',
  },
  Doughnut: {
    name: 'Doughnut',
    props: ['data', 'options'],
    template: '<div data-testid="doughnut-chart"></div>',
  },
  Bar: {
    name: 'Bar',
    props: ['data', 'options'],
    template: '<div data-testid="bar-chart"></div>',
  },
}))

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {},
  BarElement: {},
}))

// Configure Vue Test Utils
config.global.stubs = {
  transition: false,
  'router-link': true,
  'router-view': true,
}
