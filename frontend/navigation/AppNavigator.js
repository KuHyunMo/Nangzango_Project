import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // 스택 네비게이터 임포트
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import IngredientsScreen from '../screens/IngredientsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddIngredientScreen from '../screens/AddIngredientScreen'; // 새로 만들 화면 임포트

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 기존의 하단 탭 네비게이터를 별도의 컴포넌트로 분리
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '재료 관리') {
            iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
          } else if (route.name === '설정') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="재료 관리" component={IngredientsScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// 메인 앱 네비게이터는 스택 네비게이터가 관리
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainTabs} 
        options={{ headerShown: false }} // 하단 탭 화면에서는 스택 헤더를 숨김
      />
      <Stack.Screen 
        name="AddIngredient" 
        component={AddIngredientScreen}
        options={{ title: '새 재료 추가' }} // 새 화면의 헤더 제목 설정
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
