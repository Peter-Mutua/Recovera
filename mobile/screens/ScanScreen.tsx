import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { RecoveryScanner } from '../services/scanner';
import { recoveryApi } from '../services/api';
import { SecureStorage } from '../services/storage';
import theme from '../theme/colors';

interface ScanResults {
    smsCount: number;
    whatsappCount: number;
    notificationCount: number;
    mediaCount: number;
    total: number;
}

export default function ScanScreen({ navigation }: any) {
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState<ScanResults | null>(null);

    const handleScan = async () => {
        setScanning(true);
        try {
            // Perform scan
            const scanResults = await RecoveryScanner.performFullScan();
            setResults(scanResults);

            // Submit report to backend
            const userId = await SecureStorage.getUserId();
            if (userId) {
                await recoveryApi.submitReport({
                    userId,
                    smsCount: scanResults.smsCount,
                    whatsappCount: scanResults.whatsappCount,
                    notificationCount: scanResults.notificationCount,
                    mediaCount: scanResults.mediaCount,
                });
            }

            Toast.show({
                type: 'success',
                text1: 'Scan Complete!',
                text2: `Found ${scanResults.total} recoverable items`,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Scan Failed',
                text2: 'Failed to complete scan. Please try again.',
            });
            console.error(error);
        } finally {
            setScanning(false);
        }
    };

    const handleViewResults = () => {
        // Navigate to paywall
        navigation.navigate('Paywall', { results });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recovery Scan</Text>
            <Text style={styles.subtitle}>
                Scan your device for recoverable messages
            </Text>

            {!scanning && !results && (
                <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
                    <Text style={styles.scanButtonText}>Start Scan</Text>
                </TouchableOpacity>
            )}

            {scanning && (
                <View style={styles.scanningContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={styles.scanningText}>Scanning your device...</Text>
                </View>
            )}

            {results && !scanning && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Scan Complete!</Text>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>SMS Messages</Text>
                        <Text style={styles.resultValue}>{results.smsCount}</Text>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>WhatsApp Backups</Text>
                        <Text style={styles.resultValue}>{results.whatsappCount}</Text>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Notifications</Text>
                        <Text style={styles.resultValue}>{results.notificationCount}</Text>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Media Files</Text>
                        <Text style={styles.resultValue}>{results.mediaCount}</Text>
                    </View>

                    <View style={[styles.resultCard, styles.totalCard]}>
                        <Text style={styles.totalLabel}>Total Recoverable</Text>
                        <Text style={styles.totalValue}>{results.total}</Text>
                    </View>

                    <TouchableOpacity style={styles.viewButton} onPress={handleViewResults}>
                        <Text style={styles.viewButtonText}>View Messages</Text>
                    </TouchableOpacity>

                    <Text style={styles.unlockText}>
                        🔒 Unlock full access to view and export your recovered messages
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 40,
        color: theme.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        marginTop: 8,
        marginBottom: 32,
    },
    scanButton: {
        backgroundColor: theme.primary,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    scanButtonText: {
        color: theme.background,
        fontSize: 18,
        fontWeight: '600',
    },
    scanningContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    scanningText: {
        marginTop: 20,
        fontSize: 16,
        color: theme.textSecondary,
    },
    resultsContainer: {
        marginTop: 20,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.success,
        marginBottom: 20,
        textAlign: 'center',
    },
    resultCard: {
        backgroundColor: theme.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
    },
    resultLabel: {
        fontSize: 16,
        color: theme.textPrimary,
    },
    resultValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.primary,
    },
    totalCard: {
        backgroundColor: theme.primary,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        color: theme.background,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.background,
    },
    viewButton: {
        backgroundColor: theme.success,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    unlockText: {
        textAlign: 'center',
        color: theme.textSecondary,
        marginTop: 16,
        fontSize: 14,
    },
});
