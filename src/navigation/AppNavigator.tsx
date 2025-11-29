import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from './BottomTabs';
import { EmergencyScreen } from '../screens/Emergency/EmergencyScreen';
import { colors } from '../utils/colors';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Emergency Mode',
            headerTintColor: colors.crisis,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
