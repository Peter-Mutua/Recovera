import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Devices.css';

interface Device {
    id: string;
    deviceId: string;
    model: string;
    osVersion: string;
    lastActiveAt: string;
    createdAt: string;
    user: {
        email: string;
    };
}

export default function DevicesPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getDevices();
            setDevices(data);
        } catch (error) {
            console.error('Failed to load devices', error);
        } finally {
            setLoading(false);
        }
    };

    const getDeviceIcon = (model: string) => {
        if (model.toLowerCase().includes('iphone') || model.toLowerCase().includes('ios')) {
            return '📱';
        }
        return '🤖';
    };

    const getLastActiveStatus = (lastActive: string) => {
        const now = new Date();
        const lastActiveDate = new Date(lastActive);
        const diffHours = Math.abs(now.getTime() - lastActiveDate.getTime()) / 36e5;

        if (diffHours < 1) return { text: 'Active now', color: '#28a745' };
        if (diffHours < 24) return { text: `${Math.floor(diffHours)}h ago`, color: '#ffc107' };
        if (diffHours < 168) return { text: `${Math.floor(diffHours / 24)}d ago`, color: '#fd7e14' };
        return { text: 'Inactive', color: '#dc3545' };
    };

    if (loading) {
        return <div className="loading">Loading devices...</div>;
    }

    return (
        <div className="devices-page">
            <div className="page-header">
                <h1>Device Management</h1>
                <p className="subtitle">Total devices: {devices.length}</p>
            </div>

            <div className="devices-grid">
                {devices.map((device) => {
                    const status = getLastActiveStatus(device.lastActiveAt);
                    return (
                        <div key={device.id} className="device-card">
                            <div className="device-header">
                                <span className="device-icon">{getDeviceIcon(device.model)}</span>
                                <div className="device-info">
                                    <h3>{device.model}</h3>
                                    <p className="device-os">{device.osVersion}</p>
                                </div>
                            </div>

                            <div className="device-details">
                                <div className="detail-row">
                                    <span className="label">Device ID:</span>
                                    <span className="value mono">{device.deviceId.substring(0, 16)}...</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">User:</span>
                                    <span className="value">{device.user?.email || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Last Active:</span>
                                    <span className="value" style={{ color: status.color }}>
                                        {status.text}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Registered:</span>
                                    <span className="value">
                                        {new Date(device.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {devices.length === 0 && (
                <div className="empty-state">
                    <p className="empty-icon">📱</p>
                    <p className="empty-text">No devices registered yet</p>
                </div>
            )}
        </div>
    );
}
