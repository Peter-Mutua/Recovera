import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Dashboard.css';

interface Statistics {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    todayScans: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Statistics>({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        todayScans: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            // const data = await adminApi.getStatistics();
            // setStats(data);

            // Mock data for demonstration
            setStats({
                totalUsers: 1250,
                activeSubscriptions: 890,
                totalRevenue: 7120,
                todayScans: 45,
            });
        } catch (error) {
            console.error('Failed to load statistics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <p className="subtitle">Recovera Platform Analytics</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <p className="stat-label">Total Users</p>
                        <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <p className="stat-label">Active Subscriptions</p>
                        <p className="stat-value">{stats.activeSubscriptions.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <p className="stat-label">Total Revenue</p>
                        <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔍</div>
                    <div className="stat-content">
                        <p className="stat-label">Today's Scans</p>
                        <p className="stat-value">{stats.todayScans}</p>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-time">2 minutes ago</span>
                        <span className="activity-text">New user registered: john@example.com</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">15 minutes ago</span>
                        <span className="activity-text">Payment received: $8 (Pro Plan)</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">1 hour ago</span>
                        <span className="activity-text">Scan completed: 245 messages recovered</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
