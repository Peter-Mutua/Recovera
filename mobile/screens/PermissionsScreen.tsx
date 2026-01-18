import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import PermissionsService from '../services/permissions';

export default function PermissionsScreen({ navigation }: any) {
    const [permissions, setPermissions] = useState({
        sms: false,
        storage: false,
        notifications: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const status = await PermissionsService.checkAllPermissions();
        setPermissions({
            sms: status.sms.granted,
            storage: status.storage.granted,
            notifications: status.notifications.granted,
        });
    };

    const requestSms = async () => {
        setLoading(true);
        const granted = await PermissionsService.requestSmsPermission();
        setPermissions((prev) => ({ ...prev, sms: granted }));
        setLoading(false);
    };

    const requestStorage = async () => {
        setLoading(true);
        const granted = await PermissionsService.requestStoragePermission();
        setPermissions((prev) => ({ ...prev, storage: granted }));
        setLoading(false);
    };

    const requestNotifications = async () => {
        await PermissionsService.requestNotificationPermission();
        // Recheck after user returns from settings
        setTimeout(checkPermissions, 2000);
    };

    const requestAllPermissions = async () => {
        setLoading(true);
        await PermissionsService.requestAllPermissions();
        await checkPermissions();
        setLoading(false);
    };

    const handleContinue = () => {
        const allGranted = permissions.sms && permissions.storage && permissions.notifications;

        if (!allGranted) {
            Alert.alert(
                'Permissions Required',
                'All permissions are required for full functionality. Some features may not work without them.',
                [
                    { text: 'Continue Anyway', onPress: () => navigation.navigate('Home') },
                    { text: 'Grant Permissions', style: 'cancel' },
                ]
            );
        } else {
            navigation.navigate('Home');
        }
    };

    const getStatusIcon = (granted: boolean) => {
        return granted ? '✅' : '❌';
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Permissions Required</Text>
                <Text style={styles.subtitle}>
                    Recovera needs the following permissions to recover your messages
                </Text>
            </View>

            <View style={styles.permissionsContainer}>
                <View style={styles.permissionCard}>
                    <View style={styles.permissionHeader}>
                        <Text style={styles.permissionIcon}>📱</Text>
                        <View style={styles.permissionInfo}>
                            <Text style={styles.permissionTitle}>
                                SMS Permission {getStatusIcon(permissions.sms)}
                            </Text>
                            <Text style={styles.permissionDescription}>
                                Required to read and recover deleted text messages
                            </Text>
                        </View>
                    </View>
                    {!permissions.sms && (
                        <TouchableOpacity
                            style={styles.grantButton}
                            onPress={requestSms}
                            disabled={loading}
                        >
                            <Text style={styles.grantButtonText}>Grant Permission</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.permissionCard}>
                    <View style={styles.permissionHeader}>
                        <Text style={styles.permissionIcon}>📂</Text>
                        <View style={styles.permissionInfo}>
                            <Text style={styles.permissionTitle}>
                                Storage Permission {getStatusIcon(permissions.storage)}
                            </Text>
                            <Text style={styles.permissionDescription}>
                                Required to access WhatsApp backups and media files
                            </Text>
                        </View>
                    </View>
                    {!permissions.storage && (
                        <TouchableOpacity
                            style={styles.grantButton}
                            onPress={requestStorage}
                            disabled={loading}
                        >
                            <Text style={styles.grantButtonText}>Grant Permission</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.permissionCard}>
                    <View style={styles.permissionHeader}>
                        <Text style={styles.permissionIcon}>🔔</Text>
                        <View style={styles.permissionInfo}>
                            <Text style={styles.permissionTitle}>
                                Notification Access {getStatusIcon(permissions.notifications)}
                            </Text>
                            <Text style={styles.permissionDescription}>
                                Required to recover notification history
                            </Text>
                        </View>
                    </View>
                    {!permissions.notifications && (
                        <TouchableOpacity
                            style={styles.grantButton}
                            onPress={requestNotifications}
                            disabled={loading}
                        >
                            <Text style={styles.grantButtonText}>Open Settings</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.grantAllButton}
                    onPress={requestAllPermissions}
                    disabled={loading}
                >
                    <Text style={styles.grantAllButtonText}>
                        {loading ? 'Requesting...' : 'Grant All Permissions'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>ℹ️ Why These Permissions?</Text>
                <Text style={styles.infoText}>
                    • <Text style={styles.bold}>SMS:</Text> To read and recover deleted text messages from your device
                </Text>
                <Text style={styles.infoText}>
                    • <Text style={styles.bold}>Storage:</Text> To access WhatsApp backup files and media
                </Text>
                <Text style={styles.infoText}>
                    • <Text style={styles.bold}>Notifications:</Text> To recover notification history
                </Text>
                <Text style={styles.infoNote}>
                    All data stays on your device. We never upload your messages to our servers.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#007AFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    permissionsContainer: {
        padding: 20,
    },
    permissionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    permissionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    permissionIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    permissionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    grantButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    grantButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        padding: 20,
        paddingTop: 0,
    },
    grantAllButton: {
        backgroundColor: '#28a745',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    grantAllButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    continueButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    infoBox: {
        backgroundColor: '#fff3cd',
        padding: 16,
        margin: 20,
        marginTop: 0,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#856404',
        marginBottom: 6,
        lineHeight: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
    infoNote: {
        fontSize: 12,
        color: '#856404',
        marginTop: 8,
        fontStyle: 'italic',
    },
});
