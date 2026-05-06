import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// Store the database file in the project root, or a mounted volume
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'sqlite.db');

// Ensure the directory exists before initializing SQLite
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (error: any) {
    if (error.code === 'EACCES') {
      console.error(`\n❌ ERROR: Permission denied when trying to create directory: ${dir}`);
      console.error(`If you are deploying on Render, make sure you have created a Persistent Disk and mounted it at the correct path (e.g., /data).`);
      console.error(`Alternatively, remove the DB_PATH environment variable to use the default local path.\n`);
    }
    throw error;
  }
}

// Initialize better-sqlite3
const sqlite = new Database(dbPath);

// Create the Drizzle ORM instance
export const db = drizzle(sqlite, { schema });
