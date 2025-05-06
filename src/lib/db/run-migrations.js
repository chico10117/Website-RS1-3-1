// @ts-check
import { runMigrations } from './migrations/run-migrations.js';

console.log('Starting migration process');

runMigrations()
  .then((result) => {
    if (result.success) {
      console.log('All migrations completed successfully!');
      process.exit(0);
    } else {
      console.error('Migration failed:', result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unhandled error during migration:', error);
    process.exit(1);
  }); 