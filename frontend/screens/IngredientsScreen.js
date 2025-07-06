import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchIngredients, deleteIngredientAPI } from '../api/ingredientApi'; // API 함수 임포트

// 각 재료 항목을 표시하는 컴포넌트
const IngredientItem = ({ item, onDelete }) => {
    const getQuantityStyle = (quantity) => {
        if (quantity === '자투리') return styles.quantitySome;
        if (quantity === '없음') return styles.quantityNone;
        return styles.quantityFull;
    };

    const getExpiryStyle = (days) => {
        if (days <= 3) return styles.expiryUrgent;
        if (days <= 7) return styles.expiryWarning;
        return styles.expirySafe;
    };

    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={[styles.itemQuantity, getQuantityStyle(item.quantity)]}>{item.quantity}</Text>
            </View>
            <View style={styles.itemDetails}>
                 <Text style={[styles.itemExpiry, getExpiryStyle(item.daysLeft)]}>
                    {item.daysLeft > 0 ? `유통기한: ${item.daysLeft}일 남음` : '유통기한 만료'}
                </Text>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const IngredientsScreen = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    // 화면이 포커스될 때마다 데이터를 다시 불러오는 hook
    useFocusEffect(
        useCallback(() => {
            loadIngredients();
        }, [])
    );

    const loadIngredients = async () => {
        setLoading(true);
        const data = await fetchIngredients();
        setIngredients(data);
        setLoading(false);
    };

    const handleDelete = (ingredientId) => {
        Alert.alert(
            "재료 삭제",
            "정말로 이 재료를 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                { 
                    text: "삭제", 
                    onPress: async () => {
                        const success = await deleteIngredientAPI(ingredientId);
                        if (success) {
                            // 성공적으로 삭제되면 목록을 다시 불러옴
                            loadIngredients();
                        } else {
                            Alert.alert("오류", "재료를 삭제하지 못했습니다.");
                        }
                    },
                    style: "destructive"
                },
            ]
        );
    };


    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#007bff" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>내 냉장고</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("준비중", "재료 추가 기능은 준비 중입니다.")}>
                    <Ionicons name="add-circle" size={32} color="#007bff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={ingredients}
                renderItem={({ item }) => <IngredientItem item={item} onDelete={handleDelete} />}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>냉장고가 비어있어요!</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    addButton: {},
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#868e96' },
    itemContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginHorizontal: 20, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    itemInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    itemName: { fontSize: 18, fontWeight: '600' },
    itemQuantity: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden', color: 'white', fontSize: 12, fontWeight: 'bold' },
    quantityFull: { backgroundColor: '#28a745' },
    quantitySome: { backgroundColor: '#ffc107' },
    quantityNone: { backgroundColor: '#dc3545' },
    itemDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f3f5' },
    itemExpiry: { fontSize: 14 },
    expirySafe: { color: '#495057' },
    expiryWarning: { color: '#fd7e14', fontWeight: 'bold' },
    expiryUrgent: { color: '#dc3545', fontWeight: 'bold' },
    deleteButton: {},
});

export default IngredientsScreen;
