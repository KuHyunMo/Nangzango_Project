import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchRecommendations } from '../api/recommendApi';
import RecipeCard from '../components/RecipeCard';

// HomeScreen은 플로우차트의 주요 흐름을 담당합니다.
const HomeScreen = () => {
  const [step, setStep] = useState('initial'); // 'initial', 'loading', 'results'
  const [recommendations, setRecommendations] = useState([]);

  const handleStartRecommendation = async () => {
    setStep('loading'); // 로딩 상태로 변경
    // 플로우 차트의 '필요 재료', '조리시간' 등은 이 부분에서 파라미터로 넘겨줍니다.
    // 예제에서는 가용시간 40분으로 고정.
    const results = await fetchRecommendations(40);
    setRecommendations(results);
    setStep('results'); // 결과 표시 상태로 변경
  };

  const handleReset = () => {
    setRecommendations([]);
    setStep('initial');
  };

  // 각 단계별로 다른 UI를 렌더링
  const renderStep = () => {
    switch (step) {
      case 'loading':
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.infoText}>최적의 레시피를 찾고 있어요...</Text>
          </View>
        );
      case 'results':
        return (
          <>
            <FlatList
              data={recommendations}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={<Text style={styles.header}>오늘 이 요리 어떠세요?</Text>}
              ListEmptyComponent={<Text style={styles.infoText}>추천할 만한 요리가 없네요 😢</Text>}
            />
            <TouchableOpacity style={styles.refreshButton} onPress={handleStartRecommendation}>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.buttonText}>다른 추천 보기</Text>
            </TouchableOpacity>
          </>
        );
      case 'initial':
      default:
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.title}>내 냉장고를 위한 맞춤 요리</Text>
            <TouchableOpacity style={styles.mainButton} onPress={handleStartRecommendation}>
              <Text style={styles.buttonText}>AI 추천 받기 👨‍🍳</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {step === 'results' && (
         <TouchableOpacity style={styles.backButton} onPress={handleReset}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
      )}
      {renderStep()}
    </View>
  );
};

// 스타일시트 (생략)
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    mainButton: { backgroundColor: '#007bff', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 3 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    infoText: { marginTop: 20, fontSize: 16, color: '#666' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
    refreshButton: { flexDirection: 'row', backgroundColor: '#28a745', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 10 }
});


export default HomeScreen;