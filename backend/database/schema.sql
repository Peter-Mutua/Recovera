-- Recovera Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS recovery_reports CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE subscription_status AS ENUM ('inactive', 'active', 'expired', 'canceled');
CREATE TYPE subscription_plan AS ENUM ('basic', 'pro', 'family');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_provider AS ENUM ('mpesa', 'airtel_money', 'cards', 'stripe', 'paystack', 'google_play');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subscription_status subscription_status DEFAULT 'inactive',
    subscription_plan subscription_plan,
    subscription_expires_at TIMESTAMP,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    model VARCHAR(255) NOT NULL,
    os_version VARCHAR(100),
    app_version VARCHAR(50),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_active_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    provider payment_provider NOT NULL,
    plan VARCHAR(50) NOT NULL,
    provider_response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recovery Reports table
CREATE TABLE recovery_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sms_count INTEGER DEFAULT 0,
    whatsapp_count INTEGER DEFAULT 0,
    notification_count INTEGER DEFAULT 0,
    media_count INTEGER DEFAULT 0,
    device_id VARCHAR(255),
    metadata TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_recovery_reports_user_id ON recovery_reports(user_id);
CREATE INDEX idx_recovery_reports_created_at ON recovery_reports(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for devices table
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO recoverauser;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO recoverauser;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Recovera database schema created successfully!';
END $$;
