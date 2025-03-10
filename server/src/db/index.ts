/**
 * Database Connection Module
 *
 * Handles connection to PostgreSQL database and provides database client.
 *
 * @module db/index
 */
import pg from "pg";
import { seedData } from "./seed.js";
import type { DbConfig } from "../types/index.js";

// Create PostgreSQL client with typed configuration
const config: DbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "financial_dashboard",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
};

const client = new pg.Client(config);

/**
 * Connect to the PostgreSQL database
 * @returns {Promise<pg.Client>} PostgreSQL client
 */
export async function connectToDatabase(): Promise<pg.Client> {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");

    // Create tables if they don't exist
    await createTables();

    // Seed data if the table is empty
    const { rows } = await client.query("SELECT COUNT(*) FROM transactions");
    if (parseInt(rows[0].count) === 0) {
      await seedData(client);
      console.log("Database seeded with initial data");
    }

    return client;
  } catch (error) {
    console.error("Error connecting to database:", error);
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
