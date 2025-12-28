import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

const ProfileCompletionScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Completion Step</Text>
            <Text style={styles.subtext}>Refer to backend 'redirect' field.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg.main,
    },
    text: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.xl, // Using sizes from theme if available, otherwise hardcode
        color: COLORS.text.primary,
        fontWeight: 'bold',
    },
    subtext: {
        marginTop: 10,
        color: COLORS.text.secondary,
    }
});

export default ProfileCompletionScreen;
