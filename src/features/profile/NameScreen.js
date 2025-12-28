import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useProfileStore from '../../store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';

const NameScreen = ({ navigation }) => {
    const { firstName, lastName, updateField } = useProfileStore();

    const handleContinue = () => {
        if (firstName.trim() && lastName.trim()) {
            navigation.navigate('DateOfBirth');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '20%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>My name is</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        placeholderTextColor={COLORS.text.muted}
                        value={firstName}
                        onChangeText={(text) => updateField('firstName', text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor={COLORS.text.muted}
                        value={lastName}
                        onChangeText={(text) => updateField('lastName', text)}
                    />
                </View>

                <Text style={styles.infoText}>This is how it will appear in Matchingo and you will not be able to change it</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { opacity: (firstName && lastName) ? 1 : 0.7 }]}
                    onPress={handleContinue}
                    disabled={!firstName || !lastName}
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
    header: {
        marginBottom: SPACING.xl,
    },
    backButton: {
        marginBottom: SPACING.md,
    },
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
    content: {
        flex: 1,
    },
    title: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.xxxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text.primary,
        marginBottom: SPACING.xl,
    },
    inputContainer: {
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.text.muted,
    },
    input: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.xl,
        color: COLORS.text.primary,
        paddingVertical: SPACING.sm,
    },
    infoText: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.sm,
        color: COLORS.text.secondary,
        marginTop: SPACING.sm,
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

export default NameScreen;
