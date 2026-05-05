import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Store the database file in the project root, or a mounted volume
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'sqlite.db');

// Initialize better-sqlite3
const sqlite = new Database(dbPath);

// Create the Drizzle ORM instance
export const db = drizzle(sqlite, { schema });
