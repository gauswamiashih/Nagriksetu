-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('CITIZEN', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE complaint_status AS ENUM ('PENDING', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    profile_photo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- For OTP verification
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: complaints
-- Recommended: Partition by RANGE (created_at) for scalability if rows > 10M/year
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number VARCHAR(50) UNIQUE, -- Generated via trigger
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    address TEXT,
    status complaint_status NOT NULL DEFAULT 'IN_REVIEW',
    severity severity_level NOT NULL DEFAULT 'LOW',
    assigned_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    estimated_resolution_date TIMESTAMP WITH TIME ZONE,
    
    -- AI & Fake Detection Fields
    ai_confidence_score DECIMAL(5, 2) CHECK (ai_confidence_score BETWEEN 0 AND 100),
    is_flagged_fake BOOLEAN DEFAULT FALSE,
    fake_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,

    -- Conditional Validate: Fake reason required if flagged
    CONSTRAINT check_fake_reason_presence CHECK (
        (is_flagged_fake = FALSE) OR (fake_reason IS NOT NULL)
    )
);

-- Table: complaint_images
CREATE TABLE complaint_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: status_history
CREATE TABLE status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    comment TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ip_logs (For Rate Limiting & Security)
CREATE TABLE ip_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45) NOT NULL,
    complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: complaint_sequences (For yearly resetting sequences)
CREATE TABLE complaint_sequences (
    year INT PRIMARY KEY,
    last_seq INT DEFAULT 0
);

-- Indexes
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_severity ON complaints(severity);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_complaint_number ON complaints(complaint_number);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
-- Composite indexes for likely query patterns
CREATE INDEX idx_complaints_status_created_at ON complaints(status, created_at);
CREATE INDEX idx_complaints_lat_long ON complaints(latitude, longitude); 
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);

-- Trigger Function: Generate Complaint Number (NGK-YYYY-SEQ)
CREATE OR REPLACE FUNCTION generate_complaint_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part INT;
    seq_num INTEGER;
    formatted_seq TEXT;
BEGIN
    -- Get current year
    year_part := EXTRACT(YEAR FROM NOW())::INT;
    
    -- Ensure sequence exists for this year
    INSERT INTO complaint_sequences (year, last_seq) VALUES (year_part, 0)
    ON CONFLICT (year) DO NOTHING;
    
    -- Atomically increment and get sequence
    UPDATE complaint_sequences 
    SET last_seq = last_seq + 1 
    WHERE year = year_part 
    RETURNING last_seq INTO seq_num;
    
    -- Format sequence to 6 digits (e.g., 000001)
    formatted_seq := LPAD(seq_num::TEXT, 6, '0');
    
    -- Set complaint number: NGK-2026-000001
    NEW.complaint_number := 'NGK-' || year_part || '-' || formatted_seq;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger to Complaints
CREATE TRIGGER trigger_generate_complaint_number
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION generate_complaint_number();

-- Trigger Function: Update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger to All Tables with updated_at
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_complaints_timestamp
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger Function: Rate Limiting (Max 5 complaints per day)
CREATE OR REPLACE FUNCTION check_complaint_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    daily_count INT;
BEGIN
    SELECT COUNT(*) INTO daily_count
    FROM complaints
    WHERE user_id = NEW.user_id
      AND created_at >= NOW() - INTERVAL '24 hours';
      
    IF daily_count >= 5 THEN
        RAISE EXCEPTION 'Rate limit exceeded: You can only submit 5 complaints per day.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_rate_limit
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION check_complaint_rate_limit();

-- Trigger Function: Prevent Duplicate Complaints (Same Category + Location within 24h)
CREATE OR REPLACE FUNCTION prevent_duplicate_complaints()
RETURNS TRIGGER AS $$
DECLARE
    duplicate_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM complaints
        WHERE category_id = NEW.category_id
          AND ABS(latitude - NEW.latitude) < 0.0001 -- Approx 11 meters
          AND ABS(longitude - NEW.longitude) < 0.0001
          AND created_at >= NOW() - INTERVAL '24 hours'
          AND status != 'REJECTED' -- Allow resubmission if rejected
    ) INTO duplicate_exists;
    
    IF duplicate_exists THEN
        RAISE EXCEPTION 'Duplicate complaint: A similar complaint has already been reported at this location recently.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicates
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_complaints();

-- Trigger Function: Validate Admin Role Assignment
CREATE OR REPLACE FUNCTION validate_admin_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assigned_admin_id IS NOT NULL THEN
        -- Check if the assigned user has ADMIN or SUPER_ADMIN role
        IF NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = NEW.assigned_admin_id 
            AND role IN ('ADMIN', 'SUPER_ADMIN')
        ) THEN
            RAISE EXCEPTION 'Invalid assignment: The assigned user must have ADMIN or SUPER_ADMIN role.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_admin_role
BEFORE INSERT OR UPDATE OF assigned_admin_id ON complaints
FOR EACH ROW
EXECUTE FUNCTION validate_admin_role_assignment();

-- Trigger Function: Manage Resolution Status and Timestamp
CREATE OR REPLACE FUNCTION manage_resolution_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If status changes to RESOLVED, set resolved_at
    IF NEW.status = 'RESOLVED' AND (OLD.status IS DISTINCT FROM 'RESOLVED') THEN
        NEW.resolved_at = NOW();
    -- If status changes from RESOLVED to something else, clear resolved_at
    ELSIF NEW.status != 'RESOLVED' AND (OLD.status IS NOT DISTINCT FROM 'RESOLVED') THEN
        NEW.resolved_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_manage_resolution_status
BEFORE UPDATE OF status ON complaints
FOR EACH ROW
EXECUTE FUNCTION manage_resolution_status();

-- Seed Data
INSERT INTO users (full_name, email, phone_number, password_hash, role, is_active, is_verified) VALUES
('Super Admin', 'superadmin@nagriksetu.gov.in', '1111111111', '$2a$12$R9h/cIPz0gi.URNNXRFXjO.p/u5.1234567890abcdef', 'SUPER_ADMIN', TRUE, TRUE),
('District Admin', 'admin@nagriksetu.gov.in', '9876543210', '$2a$12$R9h/cIPz0gi.URNNXRFXjO.p/u5.1234567890abcdef', 'ADMIN', TRUE, TRUE),
('Rahul Sharma', 'rahul@example.com', '9988776655', '$2a$12$R9h/cIPz0gi.URNNXRFXjO.p/u5.1234567890abcdef', 'CITIZEN', TRUE, TRUE);

INSERT INTO categories (name, description) VALUES
('Roads', 'Pottholes, damaged roads, and construction issues'),
('Water Supply', 'Pipeline leakage, no water supply, contaminated water'),
('Sanitation', 'Garbage collection, sewage issues, public toilets'),
('Electricity', 'Street lights not working, power cuts'),
('Public Safety', 'Theft, harassment, suspicious activities');
