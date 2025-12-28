import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import * as Location from 'expo-location';

import { userApi } from '../../api/userApi';
import useAuthStore from '../../store/useAuthStore';
import TinderCard from '../../components/TinderCard';
import MatchModal from '../../components/MatchModal';
import { COLORS, SPACING } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

const HomeScreen = ({ navigation }) => {
    const { token, logout } = useAuthStore();
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [matchData, setMatchData] = useState(null);
    const [showMatch, setShowMatch] = useState(false);

    // Animation Values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        setIsLoading(true);
        try {
            // 1. Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                // Can still fetch feed, backend might handle null lat/long or use last known
            }

            let location = await Location.getCurrentPositionAsync({});

            // 2. Update Location in BG (fire and forget or await)
            await userApi.updateProfile({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }, token);

            // 3. Get Feed
            const feed = await userApi.getFeed(token);
            setProfiles(feed);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load feed');
        } finally {
            setIsLoading(false);
        }
    };

    // Swipe Handling
    const handleSwipeComplete = async (direction, swipedProfile) => {
        // Reset position instantly for next card (which is effectively the one behind)
        translateX.value = 0;
        translateY.value = 0;
        setCurrentIndex(prev => prev + 1);

        try {
            let response;
            if (direction === 'right') {
                response = await userApi.swipeLike(swipedProfile.id, token);
            } else if (direction === 'left') {
                response = await userApi.swipeDislike(swipedProfile.id, token);
            } else if (direction === 'up') {
                response = await userApi.swipeSuperLike(swipedProfile.id, token);
            }

            // Backend should return isMatch: true boolean
            // Assuming response.data contains the payload if using axios directly as in swipeLike
            const result = response.data || response;

            if (result.isMatch) {
                setMatchData({
                    name: swipedProfile.first_name,
                    photoUrl: (swipedProfile.photos && swipedProfile.photos[0]) || null,
                    matchId: result.match?.id || 'new-match'
                });
                setShowMatch(true);
            }
        } catch (error) {
            console.error('Swipe Error', error);
        }
    };

    const triggerSwipe = (direction) => {
        if (!profiles[currentIndex]) return;

        const targetX = direction === 'right' ? width * 1.5 : (direction === 'left' ? -width * 1.5 : 0);
        const targetY = direction === 'up' ? -width * 1.5 : 0;

        translateX.value = withSpring(targetX);
        translateY.value = withSpring(targetY, {}, () => {
            runOnJS(handleSwipeComplete)(direction, profiles[currentIndex]);
        });
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                // Horizontal Swipe (Like/Dislike)
                const direction = event.translationX > 0 ? 'right' : 'left';
                const targetX = direction === 'right' ? width * 1.5 : -width * 1.5;

                translateX.value = withSpring(targetX, {}, () => {
                    if (profiles[currentIndex]) {
                        runOnJS(handleSwipeComplete)(direction, profiles[currentIndex]);
                    }
                });
            } else if (event.translationY < -SWIPE_THRESHOLD) {
                // Vertical Swipe (Superlike)
                translateY.value = withSpring(-width * 1.5, {}, () => {
                    if (profiles[currentIndex]) {
                        runOnJS(handleSwipeComplete)('up', profiles[currentIndex]);
                    }
                });
            } else {
                // Reset
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            {
                rotate: interpolate(
                    translateX.value,
                    [-width / 2, 0, width / 2],
                    ['-10deg', '0deg', '10deg'],
                    Extrapolate.CLAMP
                )
            }
        ]
    }));

    // Render Empty State
    if (!isLoading && (profiles.length === 0 || currentIndex >= profiles.length)) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No more profiles nearby!</Text>
                    <TouchableOpacity onPress={loadFeed} style={styles.refreshButton}>
                        <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={[styles.refreshButton, { marginTop: 20, backgroundColor: COLORS.text.muted }]}>
                        <Text style={styles.refreshText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // We render the Deck: Bottom cards first, Top card last
    // Actually, optimization: Just render Current + Next 1 or 2
    const currentProfile = profiles[currentIndex];
    const nextProfile = profiles[currentIndex + 1];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle-outline" size={32} color={COLORS.text.muted} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Matchingo</Text>
                    <Ionicons name="chatbubbles-outline" size={28} color={COLORS.text.muted} onPress={() => { /* TODO: Nav to Chat List */ }} />
                </View>

                <View style={styles.deck}>
                    {/* Background Card (Next) */}
                    {nextProfile && (
                        <View style={[styles.cardContainer, styles.nextCard]}>
                            <TinderCard profile={nextProfile} />
                        </View>
                    )}

                    {/* Foreground Card (Current) - Animated */}
                    {currentProfile && (
                        <GestureDetector gesture={panGesture}>
                            <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
                                <TinderCard profile={currentProfile} />

                                {/* Overlay Labels (Like/Nope) could be added here using opacity interpolation */}
                            </Animated.View>
                        </GestureDetector>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={() => triggerSwipe('left')}>
                        <Ionicons name="close" size={30} color="#FF4D4D" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={() => triggerSwipe('up')}>
                        <Ionicons name="star" size={24} color="#3AB4F2" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => triggerSwipe('right')}>
                        <Ionicons name="heart" size={30} color="#4DFF4D" />
                    </TouchableOpacity>
                </View>

                {/* Match Modal */}
                <MatchModal
                    visible={showMatch}
                    matchData={matchData}
                    onClose={() => setShowMatch(false)}
                    onSendMessage={() => {
                        setShowMatch(false);
                        // Navigate to chat
                        navigation.navigate('Chat', { matchId: matchData.matchId });
                    }}
                />

            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg.main,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    headerIcon: { fontSize: 24 },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Inter-Bold', // Ensure this matches font loading key
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    deck: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: SPACING.lg,
        zIndex: 1,
    },
    cardContainer: {
        position: 'absolute',
        top: 0,
        zIndex: 2,
    },
    nextCard: {
        zIndex: 0,
        transform: [{ scale: 0.95 }, { translateY: 10 }], // Visual depth
        opacity: 0.8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.text.secondary,
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
    },
    refreshText: {
        color: 'white',
        fontWeight: 'bold',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 20, // Add bottom padding for better spacing above tab bar or safe area
        marginBottom: 40, // Push up a bit if tab bar is floating
    },
    actionButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    dislikeButton: { borderColor: '#FF4D4D', borderWidth: 1 },
    superLikeButton: { width: 50, height: 50, borderRadius: 25, borderColor: '#3AB4F2', borderWidth: 1, marginTop: -20 }, // Smaller and raised
    likeButton: { borderColor: '#4DFF4D', borderWidth: 1 },
});

export default HomeScreen;
