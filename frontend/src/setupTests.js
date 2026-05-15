require('@testing-library/jest-dom')

// Mock ResizeObserver for recharts in jsdom environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
