import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Plans.css';

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        price: 0,
        description: '',
        features: [],
        maxDevices: 1,
        dataRetentionDays: 30,
        smsRecovery: true,
        notificationRecovery: true,
        whatsappRecovery: false,
        mediaRecovery: false,
        exportFormats: [],
        supportResponseHours: 48,
        isActive: true,
        displayOrder: 0,
        badge: '',
    });
    const [featureInput, setFeatureInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/admin/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingPlan) {
                await api.put(`/admin/plans/${editingPlan.id}`, formData);
            } else {
                await api.post('/admin/plans', formData);
            }

            fetchPlans();
            resetForm();
        } catch (error) {
            console.error('Failed to save plan:', error);
            alert('Failed to save plan. ' + (error.response?.data?.message || ''));
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            code: plan.code,
            name: plan.name,
            price: plan.price,
            description: plan.description || '',
            features: plan.features || [],
            maxDevices: plan.maxDevices,
            dataRetentionDays: plan.dataRetentionDays,
            smsRecovery: plan.smsRecovery,
            notificationRecovery: plan.notificationRecovery,
            whatsappRecovery: plan.whatsappRecovery,
            mediaRecovery: plan.mediaRecovery,
            exportFormats: plan.exportFormats || [],
            supportResponseHours: plan.supportResponseHours,
            isActive: plan.isActive,
            displayOrder: plan.displayOrder,
            badge: plan.badge || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;

        try {
            await api.delete(`/admin/plans/${id}`);
            fetchPlans();
        } catch (error) {
            console.error('Failed to delete plan:', error);
            alert('Failed to delete plan');
        }
    };

    const toggleActive = async (id) => {
        try {
            await api.put(`/admin/plans/${id}/toggle`);
            fetchPlans();
        } catch (error) {
            console.error('Failed to toggle plan:', error);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingPlan(null);
        setFormData({
            code: '',
            name: '',
            price: 0,
            description: '',
            features: [],
            maxDevices: 1,
            dataRetentionDays: 30,
            smsRecovery: true,
            notificationRecovery: true,
            whatsappRecovery: false,
            mediaRecovery: false,
            exportFormats: [],
            supportResponseHours: 48,
            isActive: true,
            displayOrder: 0,
            badge: '',
        });
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const toggleExportFormat = (format) => {
        const formats = formData.exportFormats || [];
        if (formats.includes(format)) {
            setFormData({
                ...formData,
                exportFormats: formats.filter(f => f !== format),
            });
        } else {
            setFormData({
                ...formData,
                exportFormats: [...formats, format],
            });
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="plans-container">
            <div className="plans-header">
                <h1>Subscription Plans</h1>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                    + Create New Plan
                </button>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content plan-form">
                        <h2>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Plan Code *</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        required
                                        disabled={!!editingPlan}
                                        placeholder="e.g., basic, pro, family"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Plan Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g., Pro Plan"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Price (KES) *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Max Devices</label>
                                    <input
                                        type="number"
                                        value={formData.maxDevices}
                                        onChange={(e) => setFormData({ ...formData, maxDevices: parseInt(e.target.value) })}
                                        min="1"
                                        max="10"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Data Retention (Days)</label>
                                    <input
                                        type="number"
                                        value={formData.dataRetentionDays}
                                        onChange={(e) => setFormData({ ...formData, dataRetentionDays: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Support Response (Hours)</label>
                                    <input
                                        type="number"
                                        value={formData.supportResponseHours}
                                        onChange={(e) => setFormData({ ...formData, supportResponseHours: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Badge (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        placeholder="e.g., Recommended, Best Value"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    placeholder="Brief description of the plan"
                                />
                            </div>

                            <div className="form-section">
                                <h3>Features</h3>
                                <div className="features-input">
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        placeholder="Add a feature"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    />
                                    <button type="button" onClick={addFeature} className="btn-secondary">
                                        Add
                                    </button>
                                </div>
                                <div className="features-list">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <span>{feature}</span>
                                            <button type="button" onClick={() => removeFeature(index)} className="btn-danger-small">
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Recovery Features</h3>
                                <div className="checkbox-grid">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.smsRecovery}
                                            onChange={(e) => setFormData({ ...formData, smsRecovery: e.target.checked })}
                                        />
                                        SMS Recovery
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.notificationRecovery}
                                            onChange={(e) => setFormData({ ...formData, notificationRecovery: e.target.checked })}
                                        />
                                        Notification Recovery
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.whatsappRecovery}
                                            onChange={(e) => setFormData({ ...formData, whatsappRecovery: e.target.checked })}
                                        />
                                        WhatsApp Recovery
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.mediaRecovery}
                                            onChange={(e) => setFormData({ ...formData, mediaRecovery: e.target.checked })}
                                        />
                                        Media Recovery
                                    </label>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Export Formats</h3>
                                <div className="checkbox-grid">
                                    {['text', 'pdf', 'csv', 'html'].map(format => (
                                        <label key={format} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.exportFormats?.includes(format)}
                                                onChange={() => toggleExportFormat(format)}
                                            />
                                            {format.toUpperCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    Active (visible to users)
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="plans-grid">
                {plans.map(plan => (
                    <div key={plan.id} className={`plan-card ${!plan.isActive ? 'inactive' : ''}`}>
                        <div className="plan-header">
                            <h2>{plan.name}</h2>
                            {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                            <div className="plan-status">
                                <span className={`status-badge ${plan.isActive ? 'active' : 'inactive'}`}>
                                    {plan.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="plan-price">
                            <span className="currency">KES</span>
                            <span className="amount">{plan.price.toLocaleString()}</span>
                            <span className="period">/month</span>
                        </div>

                        <p className="plan-description">{plan.description}</p>

                        <div className="plan-details">
                            <div className="detail-item">
                                <strong>Code:</strong> {plan.code}
                            </div>
                            <div className="detail-item">
                                <strong>Max Devices:</strong> {plan.maxDevices}
                            </div>
                            <div className="detail-item">
                                <strong>Data Retention:</strong> {plan.dataRetentionDays} days
                            </div>
                            <div className="detail-item">
                                <strong>Support:</strong> {plan.supportResponseHours}h response
                            </div>
                        </div>

                        <div className="plan-features">
                            <h4>Features:</h4>
                            <ul>
                                {plan.features.map((feature, index) => (
                                    <li key={index}>✓ {feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="plan-recovery-features">
                            {plan.smsRecovery && <span className="feature-badge">SMS</span>}
                            {plan.notificationRecovery && <span className="feature-badge">Notifications</span>}
                            {plan.whatsappRecovery && <span className="feature-badge whatsapp">WhatsApp</span>}
                            {plan.mediaRecovery && <span className="feature-badge media">Media</span>}
                        </div>

                        <div className="plan-actions">
                            <button onClick={() => handleEdit(plan)} className="btn-secondary">
                                Edit
                            </button>
                            <button
                                onClick={() => toggleActive(plan.id)}
                                className={plan.isActive ? 'btn-warning' : 'btn-success'}
                            >
                                {plan.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDelete(plan.id)} className="btn-danger">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {plans.length === 0 && (
                <div className="empty-state">
                    <p>No subscription plans yet. Create one to get started!</p>
                </div>
            )}
        </div>
    );
}
