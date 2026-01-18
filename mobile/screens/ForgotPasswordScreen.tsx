import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import theme from '../theme/colors';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email address',
            });
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            Toast.show({
                type: 'success',
                text1: 'Email Sent',
                text2: 'If your email is registered, you will receive a password reset link.',
                visibilityTime: 4000,
            });

            // Navigate back to login after 2 seconds
            setTimeout(() => navigation.navigate('Login'), 2000);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we'll send you a link to reset your password.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={theme.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
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
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>← Back to Login</Text>
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
        lineHeight: 24,
    },
    input: {
        backgroundColor: theme.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
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
        marginBottom: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: theme.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: theme.primary,
        textAlign: 'center',
        fontSize: 16,
        marginTop: 10,
    },
});
