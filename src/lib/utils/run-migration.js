#!/usr/bin/env node
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Assuming your DATABASE_URL is set in environment variables
// You could also load it from .env using dotenv package
const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function main() {
  console.log('🚀 Running database migrations...');
  
  try {
    // Connect to the database
    const client = postgres(DATABASE_URL);
    const db = drizzle(client);
    
    // Read the SQL migration file
    const migrationPath = resolve(__dirname, '../db/migrations/create-indexes.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('Executing SQL migration...');
    const result = await client.unsafe(migrationSQL);
    
    console.log('✅ Database indexes created successfully!');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  }
}

main(); 