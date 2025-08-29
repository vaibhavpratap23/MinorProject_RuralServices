-- Add location fields to clients
ALTER TABLE clients ADD COLUMN IF NOT EXISTS location_lat DECIMAL(9,6);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS location_lng DECIMAL(9,6);

-- Add new fields to workers (some fields may already exist)
ALTER TABLE workers ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(12);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10);

-- Update address column if it exists, or add it
-- H2 doesn't support DO blocks, so we'll use simple ALTER TABLE
-- The application will handle the logic for existing columns

-- Create documents table if it doesn't exist (H2 compatible)
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- Using VARCHAR instead of enum for H2 compatibility
    file_url VARCHAR(500) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'PENDING', -- Using VARCHAR instead of enum
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_location ON clients(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_workers_location ON workers(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_workers_verification ON workers(verification_status);
CREATE INDEX IF NOT EXISTS idx_documents_worker ON documents(worker_id);
