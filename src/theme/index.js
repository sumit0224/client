export const COLORS = {
    primary: '#D50407',      // Main brand (love / swipe right)
    primaryDark: '#e63e5c',
    secondary: '#6c63ff',    // Accent / highlights
    success: '#22c55e',      // Match / online
    danger: '#ef4444',       // Swipe left
    warning: '#f59e0b',

    bg: {
        main: '#ffffff',
        secondary: '#f8f9fa',
        card: '#ffffff',
        dark: '#0f172a',
    },

    text: {
        primary: '#111827',
        secondary: '#6b7280',
        muted: '#9ca3af',
        white: '#ffffff',
    }
};

export const FONTS = {
    primary: 'Inter',   // Make sure to load these fonts in App.js
    secondary: 'Poppins',
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 22,
        xxl: 28,
        xxxl: 36,
    },
    weights: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    }
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const RADIUS = {
    sm: 6,
    md: 12,
    lg: 20,
    full: 999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
};

export const THEME = {
    colors: COLORS,
    fonts: FONTS,
    spacing: SPACING,
    radius: RADIUS,
    shadows: SHADOWS,
};
