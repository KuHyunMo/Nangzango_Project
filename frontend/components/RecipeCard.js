import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeCard = ({ recipe }) => {
  const handleRating = (rating) => {
    // 실제 앱에서는 이 평가를 서버로 보내 저장해야 합니다.
    Alert.alert(`${recipe.name}`, `'${rating}'으로 평가했습니다!`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.details}>
        조리시간: {recipe.cookTime}분 | 난이도: {'★'.repeat(recipe.difficulty)}{'☆'.repeat(5 - recipe.difficulty)}
      </Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.question}>이 요리 마음에 드시나요?</Text>
        <TouchableOpacity onPress={() => handleRating('좋아요')} style={styles.button}>
          <Ionicons name="thumbs-up-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRating('싫어요')} style={styles.button}>
          <Ionicons name="thumbs-down-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 스타일시트 (생략)
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  details: { fontSize: 14, color: '#666', marginBottom: 15 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
  question: { flex: 1, fontSize: 16, color: '#333' },
  button: { marginLeft: 15, padding: 5 },
});

export default RecipeCard;