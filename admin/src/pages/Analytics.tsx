import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

interface Statistics {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    todayScans: number;
    conversionRate: string;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getStatistics();
            setStats(data);
        } catch (error) {
            console.error('Failed to load statistics', error);
            // Mock data for demonstration
            setStats({
                totalUsers: 1250,
                activeSubscriptions: 890,
                totalRevenue: 7120,
                todayScans: 45,
                conversionRate: '71.20',
            });
        } finally {
            setLoading(false);
        }
    };

    // Mock data for charts
    const revenueData = [
        { month: 'Jan', revenue: 4200 },
        { month: 'Feb', revenue: 5100 },
        { month: 'Mar', revenue: 6300 },
        { month: 'Apr', revenue: 7120 },
    ];

    const planDistribution = [
        { name: 'Basic', value: 320, color: '#3b82f6' },
        { name: 'Pro', value: 470, color: '#8b5cf6' },
        { name: 'Family', value: 100, color: '#f59e0b' },
    ];

    const scanActivity = [
        { day: 'Mon', scans: 32 },
        { day: 'Tue', scans: 41 },
        { day: 'Wed', scans: 38 },
        { day: 'Thu', scans: 45 },
        { day: 'Fri', scans: 52 },
        { day: 'Sat', scans: 28 },
        { day: 'Sun', scans: 35 },
    ];

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    return (
        <div className="analytics-page">
            <div className="page-header">
                <h1>Analytics Dashboard</h1>
                <p className="subtitle">Platform performance metrics</p>
            </div>

            <div className="metrics-summary">
                <div className="metric-card">
                    <h3>Conversion Rate</h3>
                    <p className="metric-value">{stats?.conversionRate}%</p>
                    <p className="metric-trend positive">↑ 5.2% from last month</p>
                </div>

                <div className="metric-card">
                    <h3>Avg Revenue per User</h3>
                    <p className="metric-value">
                        ${stats ? (stats.totalRevenue / stats.totalUsers).toFixed(2) : '0'}
                    </p>
                    <p className="metric-trend positive">↑ 8.1% from last month</p>
                </div>

                <div className="metric-card">
                    <h3>Active Users</h3>
                    <p className="metric-value">{stats?.activeSubscriptions}</p>
                    <p className="metric-trend neutral">→ Stable</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#007AFF" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Plan Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={planDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {planDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card full-width">
                    <h3>Weekly Scan Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={scanActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="scans" fill="#28a745" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="insights-section">
                <h3>Key Insights</h3>
                <div className="insights-grid">
                    <div className="insight-card">
                        <span className="insight-icon">💡</span>
                        <div>
                            <h4>High Conversion Rate</h4>
                            <p>71% of users subscribe after their first scan</p>
                        </div>
                    </div>
                    <div className="insight-card">
                        <span className="insight-icon">📈</span>
                        <div>
                            <h4>Growing Revenue</h4>
                            <p>Monthly revenue increased by 13% this quarter</p>
                        </div>
                    </div>
                    <div className="insight-card">
                        <span className="insight-icon">⭐</span>
                        <div>
                            <h4>Popular Plan</h4>
                            <p>Pro plan is the most chosen subscription tier</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
