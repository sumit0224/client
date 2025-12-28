import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useProfileStore from '../../store/useProfileStore';
import useAuthStore from '../../store/useAuthStore';
import { profileApi } from '../../api/profileApi';
import { Ionicons } from '@expo/vector-icons';

const LifestyleScreen = ({ navigation }) => {
    const profileStore = useProfileStore();
    const { token, login } = useAuthStore(); // We need to update user in auth store after success
    const [isSubmitting, setIsSubmitting] = useState(false);

    const LIFESTYLE_OPTIONS = [
        'Gym', 'Travel', 'Music', 'Netflix', 'Art', 'Gaming',
        'Cooking', 'Reading', 'Photography', 'Pets', 'Nature', 'Foodie'
    ];

    const toggleInterest = (interest) => {
        const currentInterests = profileStore.lifestyle || [];
        if (currentInterests.includes(interest)) {
            profileStore.updateField('lifestyle', currentInterests.filter(i => i !== interest));
        } else {
            if (currentInterests.length < 5) {
                profileStore.updateField('lifestyle', [...currentInterests, interest]);
            } else {
                Alert.alert('Max 5', 'You can only select up to 5 interests.');
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                firstName: profileStore.firstName,
                lastName: profileStore.lastName,
                dateOfBirth: profileStore.dateOfBirth,
                gender: profileStore.gender,
                relationshipGoals: profileStore.relationshipGoals,
                lifestyle: profileStore.lifestyle
            };

            const response = await profileApi.updateProfile(payload, token);

            // Update auth store with new user data (which has isProfileCompleted: true)
            login(response.user, token);
            // reset profile store
            profileStore.resetProfile();
            // Navigation handled by AppNavigator observing isProfileCompleted
        } catch (error) {
            Alert.alert('Error', error.error || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '100%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Interests</Text>
                <Text style={styles.subtitle}>Select up to 5</Text>

                <View style={styles.interestsContainer}>
                    {LIFESTYLE_OPTIONS.map((interest) => (
                        <TouchableOpacity
                            key={interest}
                            style={[
                                styles.chip,
                                profileStore.lifestyle?.includes(interest) && styles.selectedChip
                            ]}
                            onPress={() => toggleInterest(interest)}
                        >
                            <Text style={[
                                styles.chipText,
                                profileStore.lifestyle?.includes(interest) && styles.selectedChipText
                            ]}>{interest}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { opacity: (profileStore.lifestyle?.length > 0) ? 1 : 0.7 }]}
                    onPress={handleSubmit}
                    disabled={profileStore.lifestyle?.length === 0 || isSubmitting}
                >
                    <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Finish'}</Text>
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
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.md,
        color: COLORS.text.secondary,
        marginBottom: SPACING.xl,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    chip: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.text.muted,
    },
    selectedChip: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.bg.secondary, // or light primary tint
    },
    chipText: {
        fontFamily: FONTS.primary,
        color: COLORS.text.secondary,
        fontSize: FONTS.sizes.md,
    },
    selectedChipText: {
        color: COLORS.primary,
        fontWeight: 'bold',
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

export default LifestyleScreen;
