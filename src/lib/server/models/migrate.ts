import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:rH7eRhfOGj4J@ep-jolly-sound-a2rw9fhx.eu-central-1.aws.neon.tech/neondb?sslmode=require');
const db = drizzle(sql);

async function runMigration() {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  }
  process.exit(0);
}

runMigration();