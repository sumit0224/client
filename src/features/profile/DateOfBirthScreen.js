import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Note: In a real app we might use @react-native-community/datetimepicker, 
// keeping it simple with text inputs or just 3 fields for now because of native module linking constraints if any.
// Actually, standard TextInput for DD / MM / YYYY is easiest for this environment.
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useProfileStore from '../../store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Alert } from 'react-native';

const DateOfBirthScreen = ({ navigation }) => {
    const { updateField } = useProfileStore();
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const handleContinue = () => {
        // Basic validation
        if (day && month && year) {
            const d = parseInt(day);
            const m = parseInt(month);
            const y = parseInt(year);

            // Basic range check
            if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
                Alert.alert('Invalid Date', 'Please enter a valid date.');
                return;
            }

            // Construct Date object
            const date = new Date(y, m - 1, d); // Month is 0-indexed in JS Date

            // Check 18+
            const now = new Date();
            let age = now.getFullYear() - date.getFullYear();
            const mDiff = now.getMonth() - date.getMonth();
            if (mDiff < 0 || (mDiff === 0 && now.getDate() < date.getDate())) {
                age--;
            }

            if (age < 18) {
                Alert.alert('Age Restriction', 'You must be at least 18 years old.');
                return;
            }

            updateField('dateOfBirth', date);
            navigation.navigate('Gender');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '40%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>My birthday is</Text>

                <View style={styles.dateContainer}>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="DD"
                        placeholderTextColor={COLORS.text.muted}
                        keyboardType="number-pad"
                        maxLength={2}
                        value={day}
                        onChangeText={setDay}
                    />
                    <Text style={styles.slash}>/</Text>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="MM"
                        placeholderTextColor={COLORS.text.muted}
                        keyboardType="number-pad"
                        maxLength={2}
                        value={month}
                        onChangeText={setMonth}
                    />
                    <Text style={styles.slash}>/</Text>
                    <TextInput
                        style={[styles.dateInput, { width: 80 }]}
                        placeholder="YYYY"
                        placeholderTextColor={COLORS.text.muted}
                        keyboardType="number-pad"
                        maxLength={4}
                        value={year}
                        onChangeText={setYear}
                    />
                </View>

                <Text style={styles.infoText}>Your age will be public</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { opacity: (day && month && year.length === 4) ? 1 : 0.7 }]}
                    onPress={handleContinue}
                    disabled={!day || !month || year.length !== 4}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg.main,
        padding: SPACING.xl,
    },
    header: { marginBottom: SPACING.xl },
    backButton: { marginBottom: SPACING.md },
    progressBar: {
        height: 6,
        backgroundColor: COLORS.bg.secondary,
        borderRadius: RADIUS.full,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.full,
    },
    content: { flex: 1 },
    title: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.xxxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.xl,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    dateInput: {
        width: 60,
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.xl,
        color: COLORS.text.primary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.text.muted,
        textAlign: 'center',
        paddingVertical: SPACING.sm,
    },
    slash: {
        fontSize: FONTS.sizes.xl,
        color: COLORS.text.muted,
    },
    infoText: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.sm,
        color: COLORS.text.secondary,
        marginTop: SPACING.lg,
    },
    footer: { marginBottom: SPACING.md },
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

export default DateOfBirthScreen;
