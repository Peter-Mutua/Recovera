import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import theme from '../theme/colors';

export default function ResetPasswordScreen({ route, navigation }: any) {
    const { token } = route.params || {};
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields',
            });
            return;
        }

        if (newPassword.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Password Too Short',
                text2: 'Password must be at least 8 characters long',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Passwords Don\'t Match',
                text2: 'Please make sure both passwords are the same',
            });
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Your password has been reset successfully',
                visibilityTime: 3000,
            });

            // Navigate to login after 2 seconds
            setTimeout(() => navigation.navigate('Login'), 2000);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Reset Failed',
                text2: 'Invalid or expired token. Please request a new reset link.',
                visibilityTime: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your new password below
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor={theme.textSecondary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    editable={!loading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor={theme.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.background} />
                    ) : (
                        <Text style={styles.buttonText}>Reset Password</Text>
                    )}
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
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.textPrimary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        marginBottom: 40,
    },
    input: {
        backgroundColor: theme.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        color: theme.textPrimary,
        borderWidth: 1,
        borderColor: theme.border,
    },
    button: {
        backgroundColor: theme.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: theme.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
