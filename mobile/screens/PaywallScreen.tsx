import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { billingApi } from '../services/api';
import { SecureStorage } from '../services/storage';
import api from '../services/api';
import theme from '../theme/colors';

const DEFAULT_PLANS = [
    {
        id: 'basic',
        code: 'basic',
        name: 'Basic',
        price: 400,
        currency: 'KES',
        features: ['SMS Recovery', 'Notifications', '1 Device'],
        badge: null,
    },
    {
        id: 'pro',
        code: 'pro',
        name: 'Pro',
        price: 800,
        currency: 'KES',
        features: ['Everything in Basic', 'WhatsApp Backups', 'Media Recovery', 'Export to PDF/CSV'],
        badge: 'Recommended',
    },
    {
        id: 'family',
        code: 'family',
        name: 'Family',
        price: 1200,
        currency: 'KES',
        features: ['Everything in Pro', '3 Devices', 'Priority Support'],
        badge: 'Best Value',
    },
];

export default function PaywallScreen({ navigation }: any) {
    const [plans, setPlans] = useState(DEFAULT_PLANS);
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [loading, setLoading] = useState(false);
    const [fetchingPlans, setFetchingPlans] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/plans');
            if (response.data && response.data.length > 0) {
                setPlans(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch plans, using defaults:', error);
            // Keep default plans
        } finally {
            setFetchingPlans(false);
        }
    };

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const userId = await SecureStorage.getUserId();
            if (!userId) {
                Toast.show({
                    type: 'error',
                    text1: 'Not Logged In',
                    text2: 'Please login first to subscribe',
                });
                return;
            }

            const response = await billingApi.createIntent({
                userId,
                plan: selectedPlan as any,
            });

            Toast.show({
                type: 'info',
                text1: 'Payment Required',
                text2: 'Please complete your payment to activate subscription',
                visibilityTime: 4000,
            });

            // TODO: Open payment URL in browser or WebView
            // For now, showing verification option after 3 seconds
            setTimeout(async () => {
                try {
                    await billingApi.verifyPayment(response.reference, 'stripe');
                    Toast.show({
                        type: 'success',
                        text1: 'Subscription Activated!',
                        text2: 'You now have full access to all features',
                    });
                    navigation.navigate('Messages');
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Verification Failed',
                        text2: 'Could not verify payment. Please contact support.',
                    });
                }
            }, 3000);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Payment Error',
                text2: 'Failed to create payment. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetchingPlans) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>Unlock full access to recovered messages</Text>

            {plans.map((plan: any) => (
                <TouchableOpacity
                    key={plan.code || plan.id}
                    style={[
                        styles.planCard,
                        selectedPlan === (plan.code || plan.id) && styles.planCardSelected,
                    ]}
                    onPress={() => setSelectedPlan(plan.code || plan.id)}
                >
                    {plan.badge && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badge}>{plan.badge}</Text>
                        </View>
                    )}
                    <View style={styles.planHeader}>
                        <Text style={styles.planName}>{plan.name}</Text>
                        <Text style={styles.planPrice}>
                            {plan.currency || 'KES'} {plan.price.toLocaleString()}/mo
                        </Text>
                    </View>
                    {plan.features?.map((feature: string, index: number) => (
                        <Text key={index} style={styles.planFeature}>
                            ✓ {feature}
                        </Text>
                    ))}
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                style={[styles.subscribeButton, loading && styles.buttonDisabled]}
                onPress={handleSubscribe}
                disabled={loading}
            >
                <Text style={styles.subscribeButtonText}>
                    {loading ? 'Processing...' : 'Subscribe Now'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
                • Cancel anytime{'\n'}
                • Secure payment{'\n'}
                • 100% legal and safe
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: theme.textSecondary,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
        color: theme.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        marginTop: 8,
        marginBottom: 24,
    },
    planCard: {
        backgroundColor: theme.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: theme.border,
        position: 'relative',
    },
    planCardSelected: {
        borderColor: theme.primary,
        backgroundColor: theme.surfaceVariant,
    },
    badgeContainer: {
        position: 'absolute',
        top: -10,
        right: 20,
        backgroundColor: theme.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badge: {
        color: theme.background,
        fontSize: 12,
        fontWeight: 'bold',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    planPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.primary,
    },
    planFeature: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 6,
    },
    subscribeButton: {
        backgroundColor: theme.success,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    subscribeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    disclaimer: {
        textAlign: 'center',
        color: theme.textSecondary,
        marginTop: 20,
        marginBottom: 40,
        fontSize: 12,
        lineHeight: 20,
    },
});
