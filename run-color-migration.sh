#!/bin/bash

# Script to run the color column migration
echo "Running migration to update restaurant color column to text type..."

# Get the database connection string from the environment or use a default
DB_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/postgres}"

# Run the SQL migration
psql "$DB_URL" -f drizzle/migrate_color_column.sql

echo "Migration completed!"
