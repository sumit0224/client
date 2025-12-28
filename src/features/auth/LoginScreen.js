import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { authApi } from '../../api/authApi';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        // Basic validation
        if (phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            await authApi.sendOtp(phoneNumber);
            navigation.navigate('Otp', { phoneNumber });
        } catch (err) {
            setError(err.error || 'Failed to send OTP. Check connection.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Enter your number</Text>
                    <Text style={styles.subtitle}>We will send you a verification code</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor={COLORS.text.muted}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                if (error) setError('');
                            }}
                            maxLength={10}
                        />
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, { opacity: phoneNumber.length === 10 ? 1 : 0.7 }]}
                        onPress={handleContinue}
                        disabled={phoneNumber.length !== 10 || isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Continue'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg.main,
    },
    content: {
        flex: 1,
        padding: SPACING.xl,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: SPACING.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -SPACING.sm, // Align with left edge
        marginBottom: SPACING.lg,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.bg.secondary,
    },
    title: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.xxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.md,
        color: COLORS.text.secondary,
    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: SPACING.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bg.secondary,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.bg.secondary,
    },
    countryCode: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.lg,
        color: COLORS.text.primary,
        marginRight: SPACING.sm,
        fontWeight: FONTS.weights.medium,
    },
    input: {
        flex: 1,
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.lg,
        color: COLORS.text.primary,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: FONTS.sizes.sm,
        marginTop: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    footer: {
        marginBottom: SPACING.md,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.full,
        alignItems: 'center',
        ...SHADOWS.md,
    },
    buttonText: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.lg,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.text.white,
    },
});

export default LoginScreen;
