import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const MatchModal = ({ visible, matchData, onClose, onSendMessage }) => {
    if (!visible || !matchData) return null;

    // We expect matchData to contain info about the OTHER user.
    // For MVP, we pass the matched profile as a prop or part of matchData.
    const { name, photoUrl } = matchData;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>It's a Match!</Text>
                    <Text style={styles.subtitle}>You and {name} liked each other.</Text>

                    <View style={styles.avatars}>
                        {/* Placeholder for current user avatar - in real app fetch from store */}
                        <View style={[styles.avatarContainer, styles.leftAvatar]}>
                            <View style={styles.placeholderAvatar} />
                        </View>
                        <View style={[styles.avatarContainer, styles.rightAvatar]}>
                            {photoUrl ? (
                                <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
                            ) : (
                                <View style={[styles.placeholderAvatar, { backgroundColor: COLORS.secondary }]} />
                            )}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.chatButton} onPress={onSendMessage}>
                        <Text style={styles.chatButtonText}>Send a Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
                        <Text style={styles.keepSwipingText}>Keep Swiping</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontFamily: FONTS.primary, // Using standard font for now as custom font might load async
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.success, // Green
        marginBottom: SPACING.sm,
        fontStyle: 'italic',
    },
    subtitle: {
        fontFamily: FONTS.secondary,
        fontSize: FONTS.sizes.md,
        color: COLORS.text.white,
        marginBottom: SPACING.xxl,
    },
    avatars: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.xxl,
        width: '100%',
        height: 100,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: COLORS.text.white,
        overflow: 'hidden',
        position: 'absolute',
    },
    leftAvatar: {
        left: '15%',
        zIndex: 1,
    },
    rightAvatar: {
        right: '15%',
        zIndex: 2,
    },
    placeholderAvatar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    chatButton: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: SPACING.lg,
        borderRadius: RADIUS.full,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    chatButtonText: {
        color: COLORS.text.white,
        fontSize: FONTS.sizes.lg,
        fontWeight: 'bold',
    },
    keepSwipingButton: {
        paddingVertical: SPACING.md,
    },
    keepSwipingText: {
        color: COLORS.text.white,
        fontSize: FONTS.sizes.md,
    },
});

export default MatchModal;
