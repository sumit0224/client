import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useProfileStore from '../../store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';

const GenderScreen = ({ navigation }) => {
    const { gender, updateField } = useProfileStore();

    const GENDER_OPTIONS = ['Woman', 'Man', 'More'];

    const handleContinue = () => {
        if (gender) {
            navigation.navigate('RelationshipGoals');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '60%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>I am a</Text>

                <View style={styles.optionsContainer}>
                    {GENDER_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.optionButton,
                                gender === option && styles.selectedOption
                            ]}
                            onPress={() => updateField('gender', option)}
                        >
                            <Text style={[
                                styles.optionText,
                                gender === option && styles.selectedOptionText
                            ]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { opacity: gender ? 1 : 0.7 }]}
                    onPress={handleContinue}
                    disabled={!gender}
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
    optionsContainer: {
        gap: SPACING.md,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: COLORS.text.muted,
        borderRadius: RADIUS.full,
        paddingVertical: SPACING.md,
        alignItems: 'center',
    },
    selectedOption: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.bg.secondary // Or transparent with colored text, Tinder outlines usually
    },
    optionText: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.lg,
        color: COLORS.text.secondary,
        fontWeight: FONTS.weights.medium,
    },
    selectedOptionText: {
        color: COLORS.primary,
        fontWeight: FONTS.weights.bold,
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

export default GenderScreen;
