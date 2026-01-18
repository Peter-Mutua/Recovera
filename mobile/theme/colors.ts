export const darkTheme = {
    // Backgrounds
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    card: '#1E1E1E',

    // Primary colors
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    primaryLight: '#E1BEE7',

    // Secondary colors
    secondary: '#03DAC6',
    secondaryVariant: '#018786',

    // Status colors
    success: '#4CAF50',
    error: '#CF6679',
    warning: '#FFC107',
    info: '#2196F3',

    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textDisabled: '#666666',

    // Other
    border: '#333333',
    divider: '#2C2C2C',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Shadows
    shadowColor: '#000000',
    shadowOpacity: 0.3,
};

export type Theme = typeof darkTheme;

export default darkTheme;
