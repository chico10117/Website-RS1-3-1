-- Add reservas and redes_sociales columns to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS reservas TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS redes_sociales TEXT DEFAULT NULL; 