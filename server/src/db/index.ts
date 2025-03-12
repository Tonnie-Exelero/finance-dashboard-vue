/**
 * Database Connection Module
 *
 * Handles connection pooling, schema management, and query execution
 * for Vercel Postgres with production-ready configurations.
 *
 * @module db/index
 */
import pg from 'pg';
import { seedData } from './seed.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envPath = path.resolve(__dirname, `../../../.env`);

dotenv.config({ path: envPath });

// Determine SSL configuration based on environment
const sslConfig =
  process.env.NODE_ENV === 'production'
    ? {
        rejectUnauthorized: false,
      }
    : false;

// Create connection pool for efficient query handling
const pool = new pg.Pool({
  /**
   * Use Vercel Postgres connection string
   * - Automatically provided by Vercel when linked to Postgres database
   * - Contains all connection parameters (host, user, password, etc.)
   */
  connectionString: process.env.POSTGRES_URL,

  /**
   * SSL Configuration
   * - Required for Vercel Postgres connections
   * - rejectUnauthorized: false allows self-signed certificates
   */
  ssl: sslConfig,

  /**
   * Connection Pool Settings
   * - Adjust based on your expected workload
   * - Vercel Serverless Functions have connection limits
   */
  max: 15, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Fail fast if can't connect
});

/**
 * Establishes database connection and performs initial setup
 * @returns {Promise<pg.Pool>} PostgreSQL connection pool
 */
export async function connectToDatabase(): Promise<pg.Pool> {
  try {
    // Verify connection with simple query
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to Vercel Postgres database');

    /**
     * Schema Management
     * - Only run in non-production environments
     * - Production should use migrations (see readme)
     */
    if (process.env.NODE_ENV !== 'production') {
      await createTables();
      await checkAndSeedData();
    }

    return pool;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1); // Fail fast on connection errors
  }
}

/**
 * Database Schema Initialization
 * - Creates core tables if they don't exist
 * - Only used in development/staging environments
 */
async function createTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Database tables verified');
  } catch (error) {
    console.error('❌ Schema initialization error:', error);
    throw error;
  }
}

/**
 * Data Seeding Logic
 * - Populates initial data in non-production environments
 * - Skips if data already exists
 */
async function checkAndSeedData(): Promise<void> {
  try {
    const { rows } = await pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions')"
    );

    if (!rows[0].exists) {
      await seedData(pool);
      console.log('✅ Initial data seeded');
      return;
    }

    const countResult = await pool.query('SELECT COUNT(*) FROM transactions');
    if (parseInt(countResult.rows[0].count) === 0) {
      await seedData(pool);
      console.log('✅ Initial data seeded');
    }
  } catch (error) {
    console.error('❌ Data seeding error:', error);
    throw error;
  }
}

/**
 * Safe Query Execution Interface
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result
 */
export async function query(text: string, params?: any[]): Promise<pg.QueryResult> {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log(`📊 Executed query in ${duration}ms:`, text);
    return result;
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  }
}

/**
 * Graceful Shutdown Handler
 * - Closes connection pool when process terminates
 */
process.on('SIGTERM', async () => {
  console.log('🛑 Closing database connection pool');
  await pool.end();
  process.exit(0);
});
