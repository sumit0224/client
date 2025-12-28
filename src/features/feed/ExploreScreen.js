import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import useAuthStore from '../../store/useAuthStore';
import { userApi } from '../../api/userApi';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.lg * 3) / 2;

const ExploreScreen = ({ navigation }) => {
    const { token } = useAuthStore();
    const [filter, setFilter] = useState('All'); // All, Female, Male
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadExploreUsers();
    }, [filter]);

    const loadExploreUsers = async () => {
        // Mock fetch
        // const data = await userApi.getExplore(filter, token);
        const mockData = [
            { id: '101', first_name: 'Anna', age: 21, photo: 'https://randomuser.me/api/portraits/women/10.jpg' },
            { id: '102', first_name: 'Mike', age: 26, photo: 'https://randomuser.me/api/portraits/men/10.jpg' },
            { id: '103', first_name: 'Sarah', age: 23, photo: 'https://randomuser.me/api/portraits/women/11.jpg' },
            { id: '104', first_name: 'David', age: 28, photo: 'https://randomuser.me/api/portraits/men/11.jpg' },
        ];

        if (filter === 'Female') setUsers(mockData.filter(u => parseInt(u.id) % 2 !== 0)); // simple mock logic
        else if (filter === 'Male') setUsers(mockData.filter(u => parseInt(u.id) % 2 === 0));
        else setUsers(mockData);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.photo }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.name}>{item.first_name}, {item.age}</Text>
            </View>
        </TouchableOpacity>
    );

    const FilterChip = ({ label }) => (
        <TouchableOpacity
            style={[styles.chip, filter === label && styles.activeChip]}
            onPress={() => setFilter(label)}
        >
            <Text style={[styles.chipText, filter === label && styles.activeChipText]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                    <FilterChip label="All" />
                    <FilterChip label="Female" />
                    <FilterChip label="Male" />
                </ScrollView>
            </View>

            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg.main },
    header: { padding: SPACING.lg },
    headerTitle: { fontSize: 28, fontFamily: FONTS.primary, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: SPACING.md },
    filters: { flexDirection: 'row', gap: SPACING.sm },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.bg.secondary, marginRight: SPACING.sm },
    activeChip: { backgroundColor: COLORS.primary },
    chipText: { color: COLORS.text.secondary },
    activeChipText: { color: 'white', fontWeight: 'bold' },
    list: { paddingHorizontal: SPACING.lg, paddingBottom: 20 },
    row: { justifyContent: 'space-between', marginBottom: SPACING.md },
    card: { width: ITEM_WIDTH, height: ITEM_WIDTH * 1.3, borderRadius: RADIUS.md, overflow: 'hidden', backgroundColor: COLORS.text.muted },
    image: { width: '100%', height: '100%' },
    overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.sm, backgroundColor: 'rgba(0,0,0,0.5)' },
    name: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default ExploreScreen;
