import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { billingApi } from '../services/api';
import { SecureStorage } from '../services/storage';
import theme from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');
    const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const userId = await SecureStorage.getUserId();
            if (userId) {
                const status = await billingApi.getStatus(userId);
                setSubscriptionStatus(status.status);
                setSubscriptionPlan(status.plan);
            }
        } catch (error) {
            console.error('Failed to load user info', error);
        }
    };

    const handleLogout = async () => {
        Toast.show({
            type: 'info',
            text1: 'Logout',
            text2: 'Logging you out...',
        });

        await SecureStorage.clearAuth();
        navigation.navigate('Login');

        Toast.show({
            type: 'success',
            text1: 'Logged Out',
            text2: 'See you next time!',
        });
    };

    const isSubscribed = subscriptionStatus === 'active';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recovera</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutButton}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Subscription Status</Text>
                <View style={[
                    styles.statusBadge,
                    isSubscribed ? styles.statusActive : styles.statusInactive
                ]}>
                    <Text style={styles.statusText}>
                        {isSubscribed ? '✓ Active' : '⨯ Inactive'}
                    </Text>
                </View>
                {subscriptionPlan && (
                    <Text style={styles.planText}>Plan: {subscriptionPlan.toUpperCase()}</Text>
                )}
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Scan')}
                >
                    <Text style={styles.actionIcon}>🔍</Text>
                    <Text style={styles.actionTitle}>Start Scan</Text>
                    <Text style={styles.actionDescription}>
                        Scan your device for recoverable messages
                    </Text>
                </TouchableOpacity>

                {isSubscribed && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Messages')}
                    >
                        <Text style={styles.actionIcon}>📱</Text>
                        <Text style={styles.actionTitle}>View Messages</Text>
                        <Text style={styles.actionDescription}>
                            Browse your recovered messages
                        </Text>
                    </TouchableOpacity>
                )}

                {!isSubscribed && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.upgradeButton]}
                        onPress={() => navigation.navigate('Paywall')}
                    >
                        <Text style={styles.actionIcon}>⭐</Text>
                        <Text style={styles.actionTitle}>Upgrade Now</Text>
                        <Text style={styles.actionDescription}>
                            Unlock full access to all features
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('History')}
                >
                    <Text style={styles.actionIcon}>📊</Text>
                    <Text style={styles.actionTitle}>Scan History</Text>
                    <Text style={styles.actionDescription}>
                        View your previous scan results
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: theme.primary,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.background,
    },
    logoutButton: {
        color: theme.background,
        fontSize: 16,
    },
    statusCard: {
        backgroundColor: theme.surface,
        margin: 20,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
    },
    statusLabel: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 8,
    },
    statusBadge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    statusActive: {
        backgroundColor: theme.success,
    },
    statusInactive: {
        backgroundColor: theme.error,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
    },
    planText: {
        fontSize: 14,
        color: theme.primary,
        fontWeight: '600',
    },
    actionsContainer: {
        padding: 20,
        paddingTop: 0,
    },
    actionButton: {
        backgroundColor: theme.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    upgradeButton: {
        backgroundColor: theme.warning,
        borderColor: theme.warning,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        color: theme.textSecondary,
    },
});
