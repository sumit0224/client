import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../theme';

// Screens
// Screens
import WelcomeScreen from '../features/auth/WelcomeScreen';
import LoginScreen from '../features/auth/LoginScreen';
import OtpScreen from '../features/auth/OtpScreen';
// Profile Screens
import NameScreen from '../features/profile/NameScreen';
import DateOfBirthScreen from '../features/profile/DateOfBirthScreen';
import GenderScreen from '../features/profile/GenderScreen';
import RelationshipGoalsScreen from '../features/profile/RelationshipGoalsScreen';
import LifestyleScreen from '../features/profile/LifestyleScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
// Feed
import HomeScreen from '../features/feed/HomeScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg.main }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    user?.isProfileCompleted ? (
                        <>
                            <Stack.Screen name="Main" component={BottomTabNavigator} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Name" component={NameScreen} />
                            <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
                            <Stack.Screen name="Gender" component={GenderScreen} />
                            <Stack.Screen name="RelationshipGoals" component={RelationshipGoalsScreen} />
                            <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
                        </>
                    )
                ) : (
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Otp" component={OtpScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
