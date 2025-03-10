/**
 * Database Seed Module
 *
 * Provides seed data for the database.
 *
 * @module db/seed
 */
import type { Client } from "pg";

/**
 * Seed the database with initial data
 * @param {Client} client - PostgreSQL client
 */
export async function seedData(client: Client): Promise<void> {
  try {
    // Sample transactions data
    const transactions = [
		{ date: "2024-10-10", description: "Doctor Visit", category: "Healthcare", amount: -120.0, status: "Completed" },
		{ date: "2024-10-14", description: "Grocery Shopping", category: "Food", amount: -234.14, status: "Completed" },
		{ date: "2024-10-16", description: "Phone Bill", category: "Utilities", amount: -60.0, status: "Completed" },
		{ date: "2024-10-17", description: "Freelance Work", category: "Income", amount: 1163.38, status: "Completed" },
		{ date: "2024-11-15", description: "Gym Membership", category: "Healthcare", amount: -50.0, status: "Pending" },
		{ date: "2024-11-17", description: "Salary", category: "Income", amount: 5000.0, status: "Completed" },
		{ date: "2024-11-22", description: "Gas Bill", category: "Utilities", amount: -40.63, status: "Failed" },
		{ date: "2024-11-27", description: "Internet Bill", category: "Utilities", amount: -80.0, status: "Pending" },
		{ date: "2024-12-10", description: "Phone Bill", category: "Utilities", amount: -60.0, status: "Completed" },
		{ date: "2024-12-10", description: "Gas Bill", category: "Utilities", amount: -40.63, status: "Failed" },
		{ date: "2024-12-19", description: "Rent", category: "Housing", amount: -1500.0, status: "Completed" },
		{ date: "2025-01-02", description: "Gas Bill", category: "Utilities", amount: -40.63, status: "Failed" },
		{ date: "2025-01-11", description: "Bonus", category: "Income", amount: 1000.0, status: "Completed" },
		{ date: "2025-01-18", description: "Bonus", category: "Income", amount: 1000.0, status: "Completed" },
		{ date: "2025-01-25", description: "Internet Bill", category: "Utilities", amount: -80.0, status: "Pending" },
		{ date: "2025-02-13", description: "Electricity Bill", category: "Utilities", amount: -133.88, status: "Completed" },
		{ date: "2025-02-18", description: "Internet Bill", category: "Utilities", amount: -80.0, status: "Pending" },
		{ date: "2025-02-20", description: "Electricity Bill", category: "Utilities", amount: -133.88, status: "Completed" },
		{ date: "2025-02-25", description: "Car Insurance", category: "Transportation", amount: -150.0, status: "Pending" },
		{ date: "2025-02-28", description: "Internet Bill", category: "Utilities", amount: -80.0, status: "Pending" },
		{ date: "2025-02-28", description: "Doctor Visit", category: "Healthcare", amount: -120.0, status: "Completed" },
		{ date: "2025-03-01", description: "Salary", category: "Income", amount: 5000.0, status: "Completed" },
		{ date: "2025-03-03", description: "Doctor Visit", category: "Healthcare", amount: -120.0, status: "Completed" },
		{ date: "2025-03-06", description: "Phone Bill", category: "Utilities", amount: -60.0, status: "Completed" },
		{ date: "2025-03-06", description: "Gym Membership", category: "Healthcare", amount: -50.0, status: "Pending" },
	];


    // Insert transactions
    for (const transaction of transactions) {
      await client.query(
        `INSERT INTO transactions (date, description, category, amount, status) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          transaction.date,
          transaction.description,
          transaction.category,
          transaction.amount,
          transaction.status,
        ]
      );
    }

    console.log(`Inserted ${transactions.length} sample transactions`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
