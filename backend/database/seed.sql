-- Recovera Database Seed Data
-- Test data for development

-- Insert test users
INSERT INTO users (id, email, password, subscription_status, subscription_plan, subscription_expires_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', '$2b$10$rKjJm8IgpXGK5V5h5KYJ3OqJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'active', 'pro', NOW() + INTERVAL '30 days'),
    ('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', '$2b$10$rKjJm8IgpXGK5V5h5KYJ3OqJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'active', 'family', NOW() + INTERVAL '30 days'),
    ('550e8400-e29b-41d4-a716-446655440003', 'mike@example.com', '$2b$10$rKjJm8IgpXGK5V5h5KYJ3OqJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'active', 'basic', NOW() + INTERVAL '15 days'),
    ('550e8400-e29b-41d4-a716-446655440004', 'lisa@example.com', '$2b$10$rKjJm8IgpXGK5V5h5KYJ3OqJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'inactive', NULL, NULL),
    ('550e8400-e29b-41d4-a716-446655440005', 'admin@recovera.com', '$2b$10$rKjJm8IgpXGK5V5h5KYJ3OqJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'active', 'pro', NOW() + INTERVAL '365 days');

-- Insert test devices
INSERT INTO devices (device_id, model, os_version, user_id, last_active_at) VALUES
    ('device-001-john', 'Samsung Galaxy S21', 'Android 13', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 hours'),
    ('device-002-sarah-1', 'Google Pixel 7', 'Android 14', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 day'),
    ('device-003-sarah-2', 'OnePlus 10 Pro', 'Android 13', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '5 hours'),
    ('device-004-mike', 'Xiaomi Mi 11', 'Android 12', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '3 days');

-- Insert test payments
INSERT INTO payments (reference, user_id, amount, status, provider, plan) VALUES
    ('REF-1704717600-abc123', '550e8400-e29b-41d4-a716-446655440001', 8.00, 'completed', 'stripe', 'pro'),
    ('REF-1704717601-def456', '550e8400-e29b-41d4-a716-446655440002', 12.00, 'completed', 'stripe', 'family'),
    ('REF-1704717602-ghi789', '550e8400-e29b-41d4-a716-446655440003', 4.00, 'completed', 'paystack', 'basic'),
    ('REF-1704717603-jkl012', '550e8400-e29b-41d4-a716-446655440004', 8.00, 'pending', 'stripe', 'pro');

-- Insert test recovery reports
INSERT INTO recovery_reports (user_id, sms_count, whatsapp_count, notification_count, media_count, device_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 245, 5, 120, 38, 'device-001-john'),
    ('550e8400-e29b-41d4-a716-446655440001', 180, 3, 95, 22, 'device-001-john'),
    ('550e8400-e29b-41d4-a716-446655440002', 320, 8, 200, 55, 'device-002-sarah-1'),
    ('550e8400-e29b-41d4-a716-446655440003', 150, 2, 80, 15, 'device-004-mike'),
    ('550e8400-e29b-41d4-a716-446655440004', 95, 0, 45, 8, NULL);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Recovera seed data inserted successfully!';
    RAISE NOTICE 'Test users created with password: "password123" (hashed)';
END $$;
