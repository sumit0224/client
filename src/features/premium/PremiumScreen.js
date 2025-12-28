import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const PremiumScreen = () => {
    const handleBuy = (plan) => {
        // Mock backend call
        Alert.alert('Success', `You purchased the ${plan} plan!`);
    };

    const PlanCard = ({ title, price, duration, features }) => (
        <TouchableOpacity style={styles.planCard} onPress={() => handleBuy(title)}>
            <LinearGradient colors={[COLORS.primary, '#FF655B']} style={styles.gradient}>
                <Text style={styles.planTitle}>{title}</Text>
                <Text style={styles.planPrice}>{price}</Text>
                <Text style={styles.planDuration}>{duration}</Text>
            </LinearGradient>
            <View style={styles.features}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.headerTitle}>Get Premium</Text>
                <Text style={styles.subtitle}>Unlock exclusive features!</Text>

                <View style={styles.featuresList}>
                    <FeatureItem icon="heart" text="Unlimited Likes" />
                    <FeatureItem icon="eye" text="See who likes you" />
                    <FeatureItem icon="rocket" text="Boost your profile" />
                </View>

                <PlanCard
                    title="Gold"
                    price="$9.99"
                    duration="/ month"
                    features={['Unlimited Likes', '5 Super Likes/day']}
                />

                <PlanCard
                    title="Platinum"
                    price="$24.99"
                    duration="/ 3 months"
                    features={['All Gold Features', 'See who likes you', 'Monthly Boost']}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const FeatureItem = ({ icon, text }) => (
    <View style={styles.featureItem}>
        <View style={styles.iconCircle}>
            <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <Text style={styles.featureItemText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg.main },
    scroll: { padding: SPACING.lg },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.text.primary, textAlign: 'center' },
    subtitle: { fontSize: 18, color: COLORS.text.secondary, textAlign: 'center', marginBottom: SPACING.xl },
    featuresList: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.xl },
    featureItem: { alignItems: 'center' },
    iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.bg.secondary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
    featureItemText: { fontSize: 12, color: COLORS.text.secondary, textAlign: 'center', width: 80 },
    planCard: { backgroundColor: COLORS.bg.card, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg, ...SHADOWS.md },
    gradient: { padding: SPACING.lg, alignItems: 'center' },
    planTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    planPrice: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    planDuration: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
    features: { padding: SPACING.lg },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
    featureText: { fontSize: 16, color: COLORS.text.primary }
});

export default PremiumScreen;
