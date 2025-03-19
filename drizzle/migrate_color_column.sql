-- Change color column from integer to text to support both numeric and hex values
ALTER TABLE "restaurants" ALTER COLUMN "color" TYPE text USING color::text; 