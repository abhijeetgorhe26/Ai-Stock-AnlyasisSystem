import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env from the root directory (one level up from backend)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// ─── PostgreSQL Connection Pool ──────────────────────────────────────
const dbUrl = process.env.DATABASE_URL;

const poolConfig = dbUrl
  ? {
      connectionString: dbUrl,
      ssl: dbUrl.includes('sslmode=') || dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'stock_db',
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// ─── Schema Initialization ──────────────────────────────────────────
export async function initializeDatabase(): Promise<void> {
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    console.error('Make sure PostgreSQL is running and accessible.');
  }
}

export default pool;
