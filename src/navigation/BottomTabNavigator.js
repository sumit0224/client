import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

// Screens
import HomeScreen from '../features/feed/HomeScreen';
import LikesScreen from '../features/matches/LikesScreen';
import ExploreScreen from '../features/feed/ExploreScreen';
import PremiumScreen from '../features/premium/PremiumScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'flame' : 'flame-outline';
                    } else if (route.name === 'Explore') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Likes') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Premium') {
                        iconName = focused ? 'diamond' : 'diamond-outline';
                        color = focused ? '#FFD700' : color; // Gold for premium
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Ionicons name={iconName} size={size + 2} color={color} />
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    );
                },
                tabBarActiveTintColor: COLORS.primary, // Define in theme, usually pink/red
                tabBarInactiveTintColor: COLORS.text.muted,
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} />
            <Tab.Screen name="Likes" component={LikesScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Premium" component={PremiumScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        elevation: 0,
        backgroundColor: 'white',
        borderRadius: 25,
        height: 70,
        ...SHADOWS.lg,
        borderTopWidth: 0,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 10
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginTop: 4
    }
});

export default BottomTabNavigator;
