import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import PaywallScreen from '../screens/PaywallScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#BB86FC',
                    },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                    options={{ title: 'Forgot Password' }}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                    options={{ title: 'Reset Password' }}
                />
                <Stack.Screen
                    name="Permissions"
                    component={PermissionsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Scan"
                    component={ScanScreen}
                    options={{ title: 'Scan Device' }}
                />
                <Stack.Screen
                    name="Paywall"
                    component={PaywallScreen}
                    options={{ title: 'Choose Plan' }}
                />
                <Stack.Screen
                    name="Messages"
                    component={MessagesScreen}
                    options={{ title: 'Recovered Messages' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
