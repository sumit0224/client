import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import useAuthStore from '../../store/useAuthStore';
// import { swipeApi } from '../../api/swipeApi'; // To be created

const LikesScreen = ({ navigation }) => {
    const { token } = useAuthStore();
    const [activeTab, setActiveTab] = useState('likes'); // 'likes' or 'matches'
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Mock Data for now until Backend is ready
            // const response = activeTab === 'likes' 
            //     ? await swipeApi.getMyLikes(token)
            //     : await swipeApi.getMatches(token);
            // setData(response);

            setTimeout(() => {
                setData(activeTab === 'likes' ? [
                    { id: '1', first_name: 'Jessica', age: 24, photo: 'https://randomuser.me/api/portraits/women/1.jpg' },
                    { id: '2', first_name: 'Sophie', age: 22, photo: 'https://randomuser.me/api/portraits/women/2.jpg' },
                ] : [
                    { id: '3', first_name: 'Emily', age: 25, photo: 'https://randomuser.me/api/portraits/women/3.jpg' },
                ]);
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.photo }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.first_name}, {item.age}</Text>
                {activeTab === 'matches' && <Text style={styles.matchText}>It's a Match!</Text>}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Likes</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
                    onPress={() => setActiveTab('likes')}
                >
                    <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>Likes You</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
                    onPress={() => setActiveTab('matches')}
                >
                    <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>Matches</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>No {activeTab} yet.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg.main },
    header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
    headerTitle: { fontSize: 28, fontFamily: FONTS.primary, fontWeight: 'bold', color: COLORS.text.primary },
    tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
    tab: { marginRight: SPACING.lg, paddingBottom: SPACING.xs },
    activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
    tabText: { fontSize: 16, color: COLORS.text.secondary, fontFamily: FONTS.secondary },
    activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
    list: { padding: SPACING.lg },
    itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, backgroundColor: COLORS.bg.card, padding: SPACING.sm, borderRadius: RADIUS.md },
    itemImage: { width: 60, height: 60, borderRadius: 30 },
    itemInfo: { marginLeft: SPACING.md },
    itemName: { fontSize: 18, fontFamily: FONTS.primary, fontWeight: 'bold', color: COLORS.text.primary },
    matchText: { color: COLORS.primary, fontSize: 14 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: COLORS.text.muted, fontSize: 16 }
});

export default LikesScreen;
