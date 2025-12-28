import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../../assets/logo.png';

const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image
                        source={logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.tagline}>Find your perfect match.</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        justifyContent: 'space-between',
        padding: SPACING.xl,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 320,
        height: 180,
        marginBottom: SPACING.sm,
    },
    tagline: {
        fontFamily: FONTS.primary,
        fontSize: FONTS.sizes.lg,
        color: COLORS.text.secondary,
    },
    footer: {
        marginBottom: SPACING.xl,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: 999, // Full radius
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontFamily: FONTS.primary,
        fontWeight: FONTS.weights.semibold,
        fontSize: FONTS.sizes.lg,
        color: COLORS.text.white,
    },
});

export default WelcomeScreen;
