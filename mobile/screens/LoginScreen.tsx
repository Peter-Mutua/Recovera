import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { authApi, LoginData } from '../services/api';
import { SecureStorage } from '../services/storage';
import theme from '../theme/colors';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
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
            const data: LoginData = { email, password };
            const response = await authApi.login(data);

            await SecureStorage.saveAuthToken(response.token);
            await SecureStorage.saveUserId(response.userId);

            Toast.show({
                type: 'success',
                text1: 'Welcome Back!',
                text2: 'Login successful',
            });

            navigation.navigate('Home');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.response?.data?.message || 'Invalid email or password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to Recovera</Text>

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

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Don't have an account? Register</Text>
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
    forgotText: {
        color: theme.primary,
        textAlign: 'right',
        fontSize: 14,
        marginBottom: 20,
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
