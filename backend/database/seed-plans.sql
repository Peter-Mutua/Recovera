-- Add default subscription plans
INSERT INTO subscription_plans (code, name, price, description, features, max_devices, data_retention_days, sms_recovery, notification_recovery, whatsapp_recovery, media_recovery, export_formats, support_response_hours, is_active, display_order, badge) VALUES
('basic', 'Basic Plan', 400.00, 'Perfect for SMS users on a budget', 
 '["SMS Recovery", "Notification Recovery", "1 Device", "30-day Access", "Basic Export (Text)", "Standard Support (48h)"]',
 1, 30, true, true, false, false, '["text"]', 48, true, 1, NULL),

('pro', 'Pro Plan', 800.00, 'Best value - includes WhatsApp recovery',
 '["Everything in Basic", "WhatsApp Recovery", "Media Recovery (Photos/Videos)", "Advanced Export (PDF, CSV, HTML)", "60-day Access", "Priority Support (24h)", "Search & Filter", "Backup Scheduler"]',
 1, 60, true, true, true, true, '["text", "pdf", "csv", "html"]', 24, true, 2, 'Recommended'),

('family', 'Family Plan', 1200.00, 'One subscription, multiple devices',
 '["Everything in Pro", "3 Devices", "Family Sharing", "Unified Dashboard", "Device Management", "90-day Access", "Premium Support (12h)"]',
 3, 90, true, true, true, true, '["text", "pdf", "csv", "html"]', 12, true, 3, 'Best Value');
