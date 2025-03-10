/**
 * Database Connection Module
 *
 * Handles connection to PostgreSQL database and provides database client.
 *
 * @module db/index
 */
import pg from "pg";
import { seedData } from "./seed";
import type { DbConfig } from "../types/index";

let client: pg.Client;

/**
 * Connect to the PostgreSQL database
 * @returns {Promise<pg.Client>} PostgreSQL client
 */
export async function connectToDatabase(): Promise<pg.Client> {
// Create PostgreSQL client with typed configuration
  const config: DbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || "financial_dashboard",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Exelero93!",
    ssl: process.env.NODE_ENV === "production"
  };

  client = new pg.Client(config);

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
    
    await createTables();
    await checkAndSeedData();
    
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process on connection failure
  }
}

async function checkAndSeedData(): Promise<void> {
  try {
    const result = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions')"
    );
    
    if (!result.rows[0].exists) {
      await seedData(client);
      console.log("Database seeded with initial data");
      return;
    }

    const countResult = await client.query("SELECT COUNT(*) FROM transactions");
    if (parseInt(countResult.rows[0].count) === 0) {
      await seedData(client);
      console.log("Database seeded with initial data");
    }
  } catch (error) {
    console.error("Data seeding error:", error);
    throw error;
  }
}

/**
 * Create database tables if they don't exist
 */
async function createTables(): Promise<void> {
  try {
    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status TEXT NOT NULL
      );
    `);

    console.log("Database tables created or already exist");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

/**
 * Get the database client
 * @returns {pg.Client} PostgreSQL client
 */
export function getClient(): pg.Client {
  return client;
}
