import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'database.sqlite'));

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    company TEXT,
    password TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subcontractors (
    id TEXT PRIMARY KEY,
    name TEXT,
    location TEXT,
    contact TEXT,
    email TEXT,
    specialties TEXT,
    rating REAL DEFAULT 0,
    status TEXT,
    status_updated_at DATETIME,
    notes TEXT,
    past_performance TEXT,
    quotes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    title TEXT,
    opportunity_id TEXT,
    due_date DATETIME,
    status TEXT,
    progress INTEGER DEFAULT 0,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    content TEXT,
    tags TEXT
  );
`);

export default db;