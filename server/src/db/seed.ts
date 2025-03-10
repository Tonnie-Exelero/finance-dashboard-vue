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
      {
        date: "2023-01-15",
        description: "Salary",
        category: "Income",
        amount: 5000.0,
        status: "Completed",
      },
      {
        date: "2023-01-20",
        description: "Rent",
        category: "Housing",
        amount: -1500.0,
        status: "Completed",
      },
      {
        date: "2023-01-25",
        description: "Grocery Shopping",
        category: "Food",
        amount: -200.5,
        status: "Completed",
      },
      {
        date: "2023-01-28",
        description: "Electricity Bill",
        category: "Utilities",
        amount: -120.75,
        status: "Completed",
      },
      {
        date: "2023-02-01",
        description: "Internet Bill",
        category: "Utilities",
        amount: -80.0,
        status: "Pending",
      },
      {
        date: "2023-02-05",
        description: "Freelance Work",
        category: "Income",
        amount: 1200.0,
        status: "Completed",
      },
      {
        date: "2023-02-10",
        description: "Restaurant Dinner",
        category: "Food",
        amount: -85.2,
        status: "Completed",
      },
      {
        date: "2023-02-15",
        description: "Salary",
        category: "Income",
        amount: 5000.0,
        status: "Completed",
      },
      {
        date: "2023-02-18",
        description: "Movie Tickets",
        category: "Entertainment",
        amount: -35.0,
        status: "Completed",
      },
      {
        date: "2023-02-20",
        description: "Rent",
        category: "Housing",
        amount: -1500.0,
        status: "Completed",
      },
      {
        date: "2023-02-25",
        description: "Gas Bill",
        category: "Utilities",
        amount: -45.3,
        status: "Failed",
      },
      {
        date: "2023-03-01",
        description: "Car Insurance",
        category: "Transportation",
        amount: -150.0,
        status: "Pending",
      },
      {
        date: "2023-03-05",
        description: "Bonus",
        category: "Income",
        amount: 1000.0,
        status: "Completed",
      },
      {
        date: "2023-03-10",
        description: "Grocery Shopping",
        category: "Food",
        amount: -180.25,
        status: "Completed",
      },
      {
        date: "2023-03-15",
        description: "Salary",
        category: "Income",
        amount: 5000.0,
        status: "Completed",
      },
      {
        date: "2023-03-18",
        description: "Doctor Visit",
        category: "Healthcare",
        amount: -120.0,
        status: "Completed",
      },
      {
        date: "2023-03-20",
        description: "Rent",
        category: "Housing",
        amount: -1500.0,
        status: "Completed",
      },
      {
        date: "2023-03-25",
        description: "Phone Bill",
        category: "Utilities",
        amount: -60.0,
        status: "Completed",
      },
      {
        date: "2023-04-01",
        description: "Gym Membership",
        category: "Healthcare",
        amount: -50.0,
        status: "Pending",
      },
      {
        date: "2023-04-05",
        description: "Freelance Work",
        category: "Income",
        amount: 800.0,
        status: "Completed",
      },
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
