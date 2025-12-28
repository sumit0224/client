import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useAuthStore from '../../store/useAuthStore';
import { authApi } from '../../api/authApi';
import { Ionicons } from '@expo/vector-icons';

const OtpScreen = ({ route, navigation }) => {
    const { phoneNumber } = route.params || { phoneNumber: '' };
    const [otp, setOtp] = useState(['', '', '', '']); // 4 digit OTP
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    // Auth Store
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text, index) => {
        if (text.length > 1) {
            // Handle paste logic if needed, simplifed for now
            const pasted = text.split('').slice(0, 4);
            const newOtp = [...otp];
            pasted.forEach((char, i) => {
                if (index + i < 4) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            if (index + pasted.length < 4) {
                inputRefs.current[index + pasted.length]?.focus();
            } else {
                inputRefs.current[3]?.blur(); // Blur if filled
            }
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (text, index) => {
        if (!text && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = ''; // Clear previous
            setOtp(newOtp);
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 4) {
            Alert.alert('Error', 'Please enter a valid 4-digit code');
            return;
        }

        setIsLoading(true);
        try {
            const data = await authApi.verifyOtp(phoneNumber, enteredOtp);
            // The backend should return the user object with an 'isProfileCompleted' flag.
            // If isProfileCompleted is true, AppNavigator switches to Main stack.
            // If false, it switches to Registration stack (Name, etc).
            login(data.user, data.token);

        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.error || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer === 0) {
            try {
                await authApi.sendOtp(phoneNumber);
                setTimer(30);
                Alert.alert('Sent', 'A new code has been sent.');
            } catch (err) {
                Alert.alert('Error', 'Failed to resend OTP');
            }
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
                    <Text style={styles.title}>Enter code</Text>
                    <Text style={styles.subtitle}>
                        We've sent an SMS with an activation code to your phone {phoneNumber}
                    </Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[
                                styles.otpInput,
                                { borderColor: digit ? COLORS.primary : COLORS.bg.secondary }
                            ]}
                            keyboardType="number-pad"
                            maxLength={1} // or more for paste handling
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    handleBackspace(digit, index);
                                }
                            }}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>I didn't receive a code. </Text>
                    <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                        <Text style={[styles.resendLink, { color: timer > 0 ? COLORS.text.muted : COLORS.primary }]}>
                            {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, { opacity: otp.join('').length === 4 ? 1 : 0.7 }]}
                        onPress={handleVerify}
                        disabled={otp.join('').length !== 4 || isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Verifying...' : 'Verify'}</Text>
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
        lineHeight: 24,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centered OTP
        gap: SPACING.md,

        marginVertical: SPACING.md,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.bg.secondary,
        textAlign: 'center',
        fontSize: FONTS.sizes.xl,
        fontFamily: FONTS.primary,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text.primary,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    resendText: {
        fontFamily: FONTS.secondary,
        color: COLORS.text.secondary,
    },
    resendLink: {
        fontFamily: FONTS.secondary,
        fontWeight: FONTS.weights.bold,
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

export default OtpScreen;
