import * as Permissions from 'expo-permissions';
import { Alert, Linking, Platform } from 'react-native';

export enum PermissionType {
    SMS = 'sms',
    STORAGE = 'storage',
    NOTIFICATIONS = 'notifications',
}

interface PermissionStatus {
    granted: boolean;
    canAskAgain: boolean;
}

class PermissionsService {
    /**
     * Check if SMS permission is granted
     */
    async checkSmsPermission(): Promise<PermissionStatus> {
        if (Platform.OS !== 'android') {
            return { granted: false, canAskAgain: false };
        }

        try {
            const { status, canAskAgain } = await Permissions.getAsync(
                Permissions.SMS
            );
            return {
                granted: status === 'granted',
                canAskAgain: canAskAgain ?? true,
            };
        } catch (error) {
            console.error('Error checking SMS permission:', error);
            return { granted: false, canAskAgain: true };
        }
    }

    /**
     * Request SMS permission
     */
    async requestSmsPermission(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            Alert.alert('Not Supported', 'SMS recovery is only available on Android');
            return false;
        }

        try {
            const { status } = await Permissions.askAsync(Permissions.SMS);

            if (status === 'granted') {
                return true;
            }

            if (status === 'denied') {
                this.showPermissionDeniedAlert('SMS', 'read your text messages for recovery');
            }

            return false;
        } catch (error) {
            console.error('Error requesting SMS permission:', error);
            return false;
        }
    }

    /**
     * Check if storage permission is granted
     */
    async checkStoragePermission(): Promise<PermissionStatus> {
        if (Platform.OS !== 'android') {
            return { granted: false, canAskAgain: false };
        }

        try {
            const { status, canAskAgain } = await Permissions.getAsync(
                Permissions.MEDIA_LIBRARY
            );
            return {
                granted: status === 'granted',
                canAskAgain: canAskAgain ?? true,
            };
        } catch (error) {
            console.error('Error checking storage permission:', error);
            return { granted: false, canAskAgain: true };
        }
    }

    /**
     * Request storage permission
     */
    async requestStoragePermission(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            Alert.alert('Not Supported', 'Storage access is only available on Android');
            return false;
        }

        try {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            if (status === 'granted') {
                return true;
            }

            if (status === 'denied') {
                this.showPermissionDeniedAlert('Storage', 'access your files for recovery');
            }

            return false;
        } catch (error) {
            console.error('Error requesting storage permission:', error);
            return false;
        }
    }

    /**
     * Check if notification listener permission is granted
     * Note: This requires native module to check NotificationListenerService
     */
    checkNotificationPermission(): PermissionStatus {
        if (Platform.OS !== 'android') {
            return { granted: false, canAskAgain: false };
        }

        // This requires a native module to properly check
        // For now, we'll assume it needs to be requested
        console.warn('Notification Listener check requires native module');
        return { granted: false, canAskAgain: true };
    }

    /**
     * Request notification listener permission
     * Opens Android settings for notification listener access
     */
    async requestNotificationPermission(): Promise<void> {
        if (Platform.OS !== 'android') {
            Alert.alert('Not Supported', 'Notification access is only available on Android');
            return;
        }

        Alert.alert(
            'Notification Access Required',
            'Recovera needs access to read notifications for recovery. You will be redirected to Android settings to grant this permission.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        // On Android, this opens the notification listener settings
                        Linking.openSettings();
                    },
                },
            ]
        );
    }

    /**
     * Request all required permissions
     */
    async requestAllPermissions(): Promise<{
        sms: boolean;
        storage: boolean;
        notifications: boolean;
    }> {
        const results = {
            sms: false,
            storage: false,
            notifications: false,
        };

        // Request SMS permission
        results.sms = await this.requestSmsPermission();

        // Request Storage permission
        results.storage = await this.requestStoragePermission();

        // Notification permission requires manual settings access
        await this.requestNotificationPermission();

        return results;
    }

    /**
     * Check all permissions status
     */
    async checkAllPermissions(): Promise<{
        sms: PermissionStatus;
        storage: PermissionStatus;
        notifications: PermissionStatus;
    }> {
        return {
            sms: await this.checkSmsPermission(),
            storage: await this.checkStoragePermission(),
            notifications: this.checkNotificationPermission(),
        };
    }

    /**
     * Show alert when permission is denied
     */
    private showPermissionDeniedAlert(permissionName: string, purpose: string) {
        Alert.alert(
            `${permissionName} Permission Required`,
            `Recovera needs ${permissionName} permission to ${purpose}. Please grant the permission in your device settings.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Open Settings',
                    onPress: () => Linking.openSettings(),
                },
            ]
        );
    }

    /**
     * Get permission status summary
     */
    async getPermissionsSummary(): Promise<string[]> {
        const permissions = await this.checkAllPermissions();
        const missing: string[] = [];

        if (!permissions.sms.granted) {
            missing.push('SMS');
        }
        if (!permissions.storage.granted) {
            missing.push('Storage');
        }
        if (!permissions.notifications.granted) {
            missing.push('Notifications');
        }

        return missing;
    }
}

export default new PermissionsService();
