import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { addIngredientAPI } from '../api/ingredientApi';

const AddIngredientScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('있음'); // 기본값 설정
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("입력 오류", "재료 이름을 입력해주세요.");
            return;
        }
        setLoading(true);
        const newIngredient = await addIngredientAPI(name, quantity);
        setLoading(false);

        if (newIngredient) {
            // 성공적으로 추가되면 이전 화면으로 돌아감
            navigation.goBack();
        } else {
            Alert.alert("오류", "재료를 추가하지 못했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>재료 이름</Text>
                <TextInput
                    style={styles.input}
                    placeholder="예: 돼지고기"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>수량</Text>
                <View style={styles.quantityContainer}>
                    {['있음', '자투리', '없음'].map((q) => (
                        <TouchableOpacity
                            key={q}
                            style={[
                                styles.quantityButton,
                                quantity === q && styles.quantityButtonSelected
                            ]}
                            onPress={() => setQuantity(q)}
                        >
                            <Text
                                style={[
                                    styles.quantityButtonText,
                                    quantity === q && styles.quantityButtonTextSelected
                                ]}
                            >
                                {q}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>저장하기</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    fieldContainer: { marginBottom: 25 },
    label: { fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 10 },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quantityButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    quantityButtonSelected: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    quantityButtonText: {
        fontSize: 16,
        color: '#495057',
    },
    quantityButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddIngredientScreen;
