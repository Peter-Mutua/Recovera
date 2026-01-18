import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { authApi, RegisterData } from '../services/api';
import { SecureStorage } from '../services/storage';
import * as Device from 'expo-device';
import theme from '../theme/colors';

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields',
            });
            return;
        }

        setLoading(true);
        try {
            const deviceId = Device.osBuildId || 'unknown';
            const deviceInfo = `${Device.brand} ${Device.modelName}`;

            const data: RegisterData = {
                email,
                password,
                deviceId,
                deviceInfo,
            };

            const response = await authApi.register(data);

            await SecureStorage.saveAuthToken(response.token);
            await SecureStorage.saveUserId(response.userId);

            Toast.show({
                type: 'success',
                text1: 'Account Created!',
                text2: 'Welcome to Recovera',
            });

            navigation.navigate('Permissions');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error.response?.data?.message || 'Could not create account',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register for Recovera</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creating Account...' : 'Register'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: theme.background,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        marginBottom: 32,
    },
    input: {
        backgroundColor: theme.surface,
        padding: 15,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.border,
        color: theme.textPrimary,
    },
    button: {
        backgroundColor: theme.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: theme.background,
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        color: theme.primary,
        textAlign: 'center',
        fontSize: 14,
    },
});
