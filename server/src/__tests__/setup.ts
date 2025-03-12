import { vi } from 'vitest';

/**
 * Creates a mock database client for testing.
 * This mock client simulates the behavior of the actual database client
 * and allows for flexible configuration in tests.
 */
const createMockClient = () => {
  return {
    query: vi.fn(), // Mock the query method
  };
};

// Create a singleton mock client that can be configured in tests
const mockClient = createMockClient();

/**
 * Mock the database module to use the mock client.
 * This ensures all database interactions in tests are controlled and predictable.
 */
vi.mock('../db/index.ts', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(mockClient), // Mock the connection function
  query: mockClient.query, // Expose the mock query function
}));

/**
 * Mock environment variables for testing.
 * These values are used to simulate the production environment
 * without exposing sensitive credentials.
 */
process.env.POSTGRES_URL = 'postgres://test_user:test_password@localhost:5432/test_db';
process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGDATABASE = 'test_db';
process.env.PGUSER = 'test_user';
process.env.PGPASSWORD = 'test_password';
process.env.PORT = '4000';
process.env.NODE_ENV = 'test'; // Ensure tests run in a controlled environment

/**
 * Export the mock client for use in individual tests.
 * This allows tests to configure the mock client's behavior as needed.
 */
export { mockClient };
