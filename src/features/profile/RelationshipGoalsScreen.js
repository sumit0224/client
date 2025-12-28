import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useProfileStore from '../../store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';

const RelationshipGoalsScreen = ({ navigation }) => {
    const { relationshipGoals, updateField } = useProfileStore();

    const GOALS_OPTIONS = [
        { id: 'long-term', label: 'Long-term partner', icon: '❤️' },
        { id: 'short-term', label: 'Short-term fun', icon: '🥳' },
        { id: 'friends', label: 'New friends', icon: '👋' },
        { id: 'figuring-out', label: 'Still figuring it out', icon: '🤔' },
    ];

    const handleContinue = () => {
        if (relationshipGoals) {
            navigation.navigate('Lifestyle');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '80%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>I'm looking for...</Text>

                <View style={styles.optionsContainer}>
                    {GOALS_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                relationshipGoals === option.id && styles.selectedOption
                            ]}
                            onPress={() => updateField('relationshipGoals', option.id)}
                        >
                            <Text style={styles.optionIcon}>{option.icon}</Text>
                            <Text style={styles.optionLabel}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { opacity: relationshipGoals ? 1 : 0.7 }]}
                    onPress={handleContinue}
                    disabled={!relationshipGoals}
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
        fontSize: FONTS.sizes.xxl, // Slightly smaller
        fontWeight: FONTS.weights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.xl,
    },
    optionsContainer: {
        gap: SPACING.md,
    },
    optionCard: {
        backgroundColor: COLORS.bg.secondary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: COLORS.primary,
    },
    optionIcon: {
        fontSize: 24,
        marginRight: SPACING.md,
    },
    optionLabel: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.md,
        color: COLORS.text.primary,
        fontWeight: FONTS.weights.medium,
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

export default RelationshipGoalsScreen;
