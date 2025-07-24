import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Training from '../(tabs)/training';
import CategoryVideos from './CategoryVideos';

const Stack = createStackNavigator();

export default function TrainingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Training" component={Training} options={{ headerShown: false }} />
      <Stack.Screen 
        name="CategoryVideos" 
        component={CategoryVideos} 
        options={({ route }) => ({ title: route?.params?.category.name })} 
      />
    </Stack.Navigator>
  );
} 