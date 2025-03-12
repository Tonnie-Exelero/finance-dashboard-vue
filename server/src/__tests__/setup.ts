import { vi } from 'vitest';

// Create a more robust mock for the database client
const createMockClient = () => {
  return {
    query: vi.fn().mockImplementation((query, params) => {
      // Default empty response
      return { rows: [] };
    }),
  };
};

// Create a singleton mock client that can be configured in tests
const mockClient = createMockClient();

// Mock the database module
vi.mock('../db/index.ts', () => ({
  getClient: () => mockClient,
  connectToDatabase: vi.fn().mockResolvedValue(mockClient),
  initializeDatabase: vi.fn(),
}));

// Export the mock client so tests can configure it
export { mockClient };

// Mock environment variables
process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGDATABASE = 'test_db';
process.env.PGUSER = 'test_user';
process.env.PGPASSWORD = 'test_password';
process.env.PORT = '4000';
