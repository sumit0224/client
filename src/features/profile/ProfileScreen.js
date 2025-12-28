import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import useAuthStore from '../../store/useAuthStore';
import { userApi } from '../../api/userApi';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { user, token, login } = useAuthStore(); // login used here to update store user data
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [bio, setBio] = useState(user?.bio || '');
    const [jobTitle, setJobTitle] = useState(user?.job_title || '');
    const [company, setCompany] = useState(user?.company || '');
    const [city, setCity] = useState(user?.city || '');

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedUser = await userApi.updateProfile({
                bio,
                job_title: jobTitle,
                company,
                city
            }, token);

            // Update local store
            // Assuming updateProfile returns the full updated user object or we merge it
            // For now, let's merge manually to update the UI immediately if backend returns minimal data
            // Ideally backend returns the fresh user object.

            // Re-fetch user or update state if the API returns the updated user
            // If the API just returns { success: true }, we should trust our local state or refetch.
            // Let's assume we can patch the local user object for immediate feedback
            const newUserState = { ...user, bio, job_title: jobTitle, company, city };
            login(newUserState, token); // Update store

            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const imageSource = (user?.photos && user.photos.length > 0)
        ? { uri: user.photos[0] }
        : require('../../assets/default_avatar.png');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                        <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.profileImage} />
                    <TouchableOpacity style={styles.cameraButton}>
                        <Ionicons name="camera" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Name & Age */}
                <View style={styles.centerInfo}>
                    <Text style={styles.name}>
                        {user?.first_name}, {user?.date_of_birth ? new Date().getFullYear() - new Date(user.date_of_birth).getFullYear() : ''}
                    </Text>
                </View>

                {/* Stats / Info Grid */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>About Me</Text>

                    {isEditing ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholder="Write something about yourself..."
                            />

                            <Text style={styles.label}>Job Title</Text>
                            <TextInput
                                style={styles.input}
                                value={jobTitle}
                                onChangeText={setJobTitle}
                                placeholder="Software Engineer"
                            />

                            <Text style={styles.label}>Company</Text>
                            <TextInput
                                style={styles.input}
                                value={company}
                                onChangeText={setCompany}
                                placeholder="Google"
                            />

                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={styles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="New York"
                            />
                        </View>
                    ) : (
                        <View style={styles.viewMode}>
                            {user?.bio ? <Text style={styles.bioText}>{user.bio}</Text> : <Text style={styles.placeholderText}>No bio yet.</Text>}

                            <View style={styles.row}>
                                <Ionicons name="briefcase-outline" size={20} color={COLORS.text.secondary} />
                                <Text style={styles.rowText}>
                                    {user?.job_title || 'No Job Title'} {user?.company ? `at ${user.company}` : ''}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Ionicons name="location-outline" size={20} color={COLORS.text.secondary} />
                                <Text style={styles.rowText}>{user?.city || 'No City'}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg.main,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bg.secondary,
    },
    headerTitle: {
        fontSize: FONTS.sizes.xl,
        fontFamily: FONTS.primary,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    editButton: {
        fontSize: FONTS.sizes.md,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.bg.main,
    },
    centerInfo: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    name: {
        fontSize: FONTS.sizes.xxl,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    infoSection: {
        paddingHorizontal: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.lg,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    form: {
        gap: SPACING.md,
    },
    label: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text.secondary,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.bg.secondary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        fontSize: FONTS.sizes.md,
        color: COLORS.text.primary,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    viewMode: {
        gap: SPACING.md,
    },
    bioText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text.primary,
        lineHeight: 24,
    },
    placeholderText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text.muted,
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    rowText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text.secondary,
    }
});

export default ProfileScreen;
