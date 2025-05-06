import { addIndexes } from './add-indexes';

export async function runMigrations() {
  console.log('Starting database migrations...');
  
  // Run the migrations in sequence
  const results = await addIndexes();
  
  if (results.success) {
    console.log('All migrations completed successfully.');
  } else {
    console.error('Migration failed:', results.error);
  }
  
  return results;
} 