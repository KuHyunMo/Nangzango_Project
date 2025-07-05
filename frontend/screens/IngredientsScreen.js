import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IngredientsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>여기에서 식재료를 검색하고</Text>
    <Text style={styles.text}>추가/관리할 수 있습니다.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#555' },
});

export default IngredientsScreen;