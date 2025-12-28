import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Need to install if not present, but usually standard in Expo
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width, height } = Dimensions.get('window');

const TinderCard = ({ profile }) => {
    // profile: { first_name, date_of_birth, bio, photos: ['url'] }

    // Calculate Age
    const getAge = (dob) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const imageSource = (profile.photos && profile.photos.length > 0)
        ? { uri: profile.photos[0] }
        : require('../assets/default_avatar.png');

    return (
        <View style={styles.card}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />

            <View style={styles.overlay}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                >
                    <View style={styles.info}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{profile.first_name}</Text>
                            <Text style={styles.age}>{getAge(profile.date_of_birth)}</Text>
                        </View>
                        {/* Bio snippet */}
                        {profile.bio && (
                            <Text style={styles.bio} numberOfLines={2}>
                                {profile.bio}
                            </Text>
                        )}
                        {/* Distance - if calculated in basic object */}
                        {profile.distance_km && (
                            <Text style={styles.distance}>
                                📍 {Math.round(profile.distance_km)} km away
                            </Text>
                        )}
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: width * 0.9,
        height: height * 0.7,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.bg.card,
        ...SHADOWS.lg,
        overflow: 'hidden',
        position: 'absolute', // Stacked
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    gradient: {
        height: '40%',
        justifyContent: 'flex-end',
        padding: SPACING.lg,
    },
    info: {
        marginBottom: SPACING.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    name: {
        fontFamily: FONTS.primary,
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text.white,
    },
    age: {
        fontFamily: FONTS.primary,
        fontSize: 24,
        color: COLORS.text.white,
        fontWeight: 'normal',
    },
    bio: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.md,
        color: COLORS.text.white,
        marginBottom: SPACING.sm,
    },
    distance: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.sm,
        color: COLORS.text.muted, // Light gray
    },
});

export default TinderCard;
